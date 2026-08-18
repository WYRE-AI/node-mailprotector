import {
  AuthenticationError,
  ForbiddenError,
  MailprotectorError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from './errors.js';
import type { RateLimiter } from './rate-limiter.js';

export interface HttpClientConfig {
  baseUrl: string;
  apiKey: string;
  rateLimiter: RateLimiter;
  /** Max retries for network errors, 429s, and 5xx responses (default 3). */
  maxRetries?: number;
  /** Per-request timeout in milliseconds (default 30 000). */
  timeoutMs?: number;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /**
   * Query parameters. Mailprotector list endpoints accept arbitrary field
   * filters (e.g. `?first_name=Bob`) plus `page` — undefined/null entries are
   * dropped, everything else is stringified.
   */
  params?: Record<string, unknown>;
  /** JSON request body for POST/PUT. */
  body?: unknown;
}

/** Pull a human-readable message out of an error body (`{"message": …}` / `{"error": …}`). */
function bodyMessage(body: unknown): string | undefined {
  if (body !== null && typeof body === 'object') {
    for (const key of ['message', 'error']) {
      const value = (body as Record<string, unknown>)[key];
      if (typeof value === 'string' && value.length > 0) return value;
    }
  }
  return undefined;
}

/**
 * Native-fetch HTTP client for the Mailprotector API.
 *
 * - Sends `Authorization: Bearer <apiKey>` on EVERY request.
 * - Retries network errors/timeouts, 429, and 5xx with exponential backoff
 *   `min(1000 * 2^(attempt-1), 30s)`; Retry-After is honored for 429s.
 * - Reads every response body as text first, then JSON.parse — never `.json()`
 *   (avoids "Body already read" on error paths).
 * - Normalizes trailing slashes on the base URL and paths.
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly rateLimiter: RateLimiter;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;

  constructor(config: HttpClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.rateLimiter = config.rateLimiter;
    this.maxRetries = config.maxRetries ?? 3;
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', params, body } = options;

    // Leading slash guaranteed; trailing slashes stripped so the API never
    // answers with a redirect round-trip (redirects strip auth headers).
    let normalizedPath = path.startsWith('/') ? path : `/${path}`;
    if (normalizedPath.length > 1) normalizedPath = normalizedPath.replace(/\/+$/, '');
    let url = `${this.baseUrl}${normalizedPath}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) searchParams.set(key, String(value));
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) {
        const delay = Math.min(1000 * 2 ** (attempt - 1), 30_000);
        await new Promise((r) => setTimeout(r, delay));
      }

      await this.rateLimiter.acquire();

      const headers: Record<string, string> = {
        Accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      };
      if (body !== undefined) headers['Content-Type'] = 'application/json';

      let response: Response;
      try {
        response = await fetch(url, {
          method,
          headers,
          body: body !== undefined ? JSON.stringify(body) : undefined,
          signal: AbortSignal.timeout(this.timeoutMs),
        });
      } catch (err) {
        // Network failure or timeout — retryable.
        lastError = err as Error;
        continue;
      }

      if (response.ok) {
        if (response.status === 204) return undefined as T;
        const rawText = await response.text();
        if (rawText.length === 0) return undefined as T;
        try {
          return JSON.parse(rawText) as T;
        } catch {
          return rawText as T; // defensive: non-JSON success body
        }
      }

      // Read the error body safely: text first, then parse.
      let responseBody: unknown;
      const rawText = await response.text();
      try {
        responseBody = JSON.parse(rawText);
      } catch {
        responseBody = rawText;
      }
      const message = bodyMessage(responseBody);

      switch (response.status) {
        case 400:
          throw new ValidationError(message ?? 'Bad request', [], responseBody);
        case 401:
          // Static Bearer key — terminal, never retried.
          throw new AuthenticationError(message ?? 'Authentication failed', responseBody);
        case 403:
          throw new ForbiddenError(message ?? 'Forbidden', responseBody);
        case 404:
          throw new NotFoundError(message ?? 'Resource not found', responseBody);
        case 422:
          throw new ValidationError(message ?? 'Unprocessable entity', [], responseBody, 422);
        case 429: {
          const retryAfterHeader = response.headers.get('retry-after');
          const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 5;
          const error = new RateLimitError('Rate limit exceeded', retryAfter, responseBody);
          if (attempt < this.maxRetries) {
            if (retryAfterHeader) await new Promise((r) => setTimeout(r, retryAfter * 1000));
            lastError = error;
            continue;
          }
          throw error;
        }
        default:
          if (response.status >= 500) {
            lastError = new ServerError(
              message ?? `Server error: ${response.status}`,
              responseBody,
              response.status
            );
            if (attempt < this.maxRetries) continue;
            throw lastError;
          }
          throw new MailprotectorError(
            message ?? `HTTP ${response.status}`,
            response.status,
            responseBody
          );
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}
