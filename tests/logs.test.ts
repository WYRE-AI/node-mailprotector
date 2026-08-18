import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { logEntryFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('logs', () => {
  it.each(['reseller', 'customer', 'domain', 'user_group', 'user'] as const)(
    'lists logs at %s scope',
    async (scope) => {
      expect(await client.logs.listFor(scope, 1)).toEqual([logEntryFixture]);
    }
  );

  it('passes filter params through', async () => {
    let query: URLSearchParams | null = null;
    server.use(
      http.get(`${BASE}/domains/:id/logs`, ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([logEntryFixture]);
      })
    );
    await client.logs.listFor('domain', 102, { direction: 'inbound', page: 2 });
    expect(query!.get('direction')).toBe('inbound');
    expect(query!.get('page')).toBe('2');
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/customers/:id/logs', 401);
    await expect(client.logs.listFor('customer', 329)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/users/:id/logs', 404);
    await expect(client.logs.listFor('user', 999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/resellers/:id/logs', 429);
    await expect(client.logs.listFor('reseller', 188)).rejects.toBeInstanceOf(RateLimitError);
  });
});
