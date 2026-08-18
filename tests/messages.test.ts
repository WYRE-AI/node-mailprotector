import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { deliverManyFixture, messageFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('messages', () => {
  it.each(['reseller', 'customer', 'domain', 'user_group', 'user'] as const)(
    'lists quarantined messages at %s scope',
    async (scope) => {
      expect(await client.messages.listFor(scope, 1)).toEqual([messageFixture]);
    }
  );

  it('routes scope to the right path segment', async () => {
    let path: string | null = null;
    server.use(
      http.get(`${BASE}/user_groups/:id/messages`, ({ request }) => {
        path = new URL(request.url).pathname;
        return HttpResponse.json([messageFixture]);
      })
    );
    await client.messages.listFor('user_group', 109);
    expect(path).toBe('/api/v1/user_groups/109/messages');
  });

  it('releases one message (POST /messages/{id}/deliver → 204)', async () => {
    await expect(client.messages.release(1985056110)).resolves.toBeUndefined();
  });

  it('release passes delivery options through', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/messages/:id/deliver`, async ({ request }) => {
        body = await request.json();
        return new HttpResponse(null, { status: 204 });
      })
    );
    await client.messages.release(1985056110, {
      include_original_recipients: 1,
      recipients: 'address1@domain.com',
    });
    expect(body).toEqual({ include_original_recipients: 1, recipients: 'address1@domain.com' });
  });

  it('releases many messages (ids array → comma-joined string)', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/customers/:id/messages/deliver_many`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(deliverManyFixture);
      })
    );
    const result = await client.messages.releaseMany('customer', 329, [2015573567, 2015573173]);
    expect(body).toEqual({ ids: '2015573567,2015573173' });
    expect(result).toEqual(deliverManyFixture);
  });

  it('releaseMany accepts a preformatted ids string and options', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/users/:id/messages/deliver_many`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(deliverManyFixture);
      })
    );
    await client.messages.releaseMany('user', 883326, '1,2', {
      include_original_recipients: 1,
    });
    expect(body).toEqual({ ids: '1,2', include_original_recipients: 1 });
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/domains/:id/messages', 401);
    await expect(client.messages.listFor('domain', 102)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('post', '/messages/:id/deliver', 404);
    await expect(client.messages.release(1)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/users/:id/messages', 429);
    await expect(client.messages.listFor('user', 883326)).rejects.toBeInstanceOf(RateLimitError);
  });
});
