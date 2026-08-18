import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { resultCodeFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('results', () => {
  it('looks up a result code (POST /results)', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/results`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(resultCodeFixture);
      })
    );
    const info = await client.results.findByCode({ code: 'no_rdns', mode: 'inbound' });
    expect(body).toEqual({ code: 'no_rdns', mode: 'inbound' });
    expect(info).toEqual(resultCodeFixture);
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('post', '/results', 401);
    await expect(
      client.results.findByCode({ code: 'no_rdns', mode: 'inbound' })
    ).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('post', '/results', 404);
    await expect(
      client.results.findByCode({ code: 'unknown_code', mode: 'inbound' })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('post', '/results', 429);
    await expect(
      client.results.findByCode({ code: 'no_rdns', mode: 'inbound' })
    ).rejects.toBeInstanceOf(RateLimitError);
  });
});
