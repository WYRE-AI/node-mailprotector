/**
 * Mailprotector's single global API host. The `/api/v1` prefix is baked into
 * each resource path (not the base URL) so overriding `baseUrl` only ever
 * swaps the host.
 */
export const DEFAULT_BASE_URL = 'https://emailservice.io';

/** Path prefix shared by every Mailprotector endpoint. */
export const API_PREFIX = '/api/v1';

/** Token-bucket rate limit settings. */
export interface RateLimitConfig {
  /** Requests allowed per window. */
  maxRequests: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface MailprotectorConfig {
  /**
   * Mailprotector API key (per manager-role, from the web console profile
   * page). Sent as `Authorization: Bearer <apiKey>` on every request.
   */
  apiKey: string;
  /** Override the API host. Default {@link DEFAULT_BASE_URL}. */
  baseUrl?: string;
  /** Per-request timeout in milliseconds (default 30 000). */
  timeoutMs?: number;
  /** Max retries for network errors, 429s, and 5xx responses (default 3). */
  maxRetries?: number;
  /**
   * Rate limiter tuning. Mailprotector publishes no limits; the default is a
   * conservative 25 requests / 5 s.
   */
  rateLimit?: RateLimitConfig;
}
