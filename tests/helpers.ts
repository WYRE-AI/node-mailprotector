import { http, HttpResponse } from 'msw';

import { MailprotectorClient } from '../src/index.js';
import { BASE } from './mocks/handlers.js';
import { server } from './mocks/server.js';

export { BASE };

/** maxRetries defaults to 0 so error-path tests fail fast (no backoff sleeps). */
export function makeClient(maxRetries = 0): MailprotectorClient {
  return new MailprotectorClient({ apiKey: 'test-api-key', maxRetries });
}

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

/** Override one route to answer a fixed error status (reset by afterEach). */
export function respondWithError(method: Method, path: string, status: number): void {
  const bodies: Record<number, unknown> = {
    401: { message: 'Invalid API key' },
    404: { message: 'Not found' },
    429: { message: 'Too many requests' },
    500: { message: 'Internal server error' },
  };
  server.use(
    http[method](`${BASE}${path}`, () =>
      HttpResponse.json(bodies[status] ?? { message: `HTTP ${status}` }, { status })
    )
  );
}
