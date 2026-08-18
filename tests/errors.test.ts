import { describe, expect, it } from 'vitest';

import {
  AuthenticationError,
  ForbiddenError,
  MailprotectorError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
} from '../src/index.js';

describe('error hierarchy', () => {
  it('all subclasses extend MailprotectorError (and Error)', () => {
    const errors = [
      new AuthenticationError('nope', {}),
      new ForbiddenError('nope', {}),
      new NotFoundError('nope', {}),
      new ValidationError('nope', [], {}),
      new RateLimitError('nope', 5, {}),
      new ServerError('nope', {}),
    ];
    for (const err of errors) {
      expect(err).toBeInstanceOf(MailprotectorError);
      expect(err).toBeInstanceOf(Error);
    }
  });

  it('pins status codes', () => {
    expect(new AuthenticationError('x', {}).statusCode).toBe(401);
    expect(new ForbiddenError('x', {}).statusCode).toBe(403);
    expect(new NotFoundError('x', {}).statusCode).toBe(404);
    expect(new ValidationError('x', [], {}).statusCode).toBe(400);
    expect(new ValidationError('x', [], {}, 422).statusCode).toBe(422);
    expect(new RateLimitError('x', 5, {}).statusCode).toBe(429);
    expect(new ServerError('x', {}).statusCode).toBe(500);
    expect(new ServerError('x', {}, 503).statusCode).toBe(503);
  });

  it('carries retryAfter and the raw response body', () => {
    const body = { message: 'slow down' };
    const err = new RateLimitError('x', 30, body);
    expect(err.retryAfter).toBe(30);
    expect(err.response).toBe(body);
  });
});
