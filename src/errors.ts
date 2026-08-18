/**
 * Base error carries the HTTP status code and raw response body; subclasses
 * pin their status (ServerError carries the actual 5xx status it observed).
 */
export class MailprotectorError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response: unknown
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** 401. The Bearer API key is static — a 401 is terminal (nothing to refresh). */
export class AuthenticationError extends MailprotectorError {
  constructor(message: string, response: unknown) {
    super(message, 401, response);
  }
}

export class ForbiddenError extends MailprotectorError {
  constructor(message: string, response: unknown) {
    super(message, 403, response);
  }
}

export class NotFoundError extends MailprotectorError {
  constructor(message: string, response: unknown) {
    super(message, 404, response);
  }
}

/** 400/422. Mailprotector gives a single message; `errors` stays empty unless field detail appears. */
export class ValidationError extends MailprotectorError {
  constructor(
    message: string,
    public errors: Array<{ field: string; message: string }>,
    response: unknown,
    statusCode = 400
  ) {
    super(message, statusCode, response);
  }
}

/** 429. `retryAfter` is seconds, from the Retry-After header when present (default 5). */
export class RateLimitError extends MailprotectorError {
  constructor(message: string, public retryAfter: number, response: unknown) {
    super(message, 429, response);
  }
}

/** 5xx. */
export class ServerError extends MailprotectorError {
  constructor(message: string, response: unknown, statusCode = 500) {
    super(message, statusCode, response);
  }
}
