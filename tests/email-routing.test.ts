import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { emailDestinationFixture, emailSourceFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('emailRouting', () => {
  it.each(['domain', 'user_group'] as const)('lists destinations at %s scope', async (scope) => {
    expect(await client.emailRouting.listDestinations(scope, 1)).toEqual([
      emailDestinationFixture,
    ]);
  });

  it('creates a destination', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/domains/:id/email_destinations`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(emailDestinationFixture, { status: 201 });
      })
    );
    await client.emailRouting.createDestination('domain', 102, { address: 'domain.com' });
    expect(body).toEqual({ address: 'domain.com' });
  });

  it.each(['domain', 'user_group'] as const)('lists sources at %s scope', async (scope) => {
    expect(await client.emailRouting.listSources(scope, 1)).toEqual([emailSourceFixture]);
  });

  it('creates a source', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/user_groups/:id/email_sources`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(emailSourceFixture, { status: 201 });
      })
    );
    await client.emailRouting.createSource('user_group', 109, { address: '192.168.0.1' });
    expect(body).toEqual({ address: '192.168.0.1' });
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/domains/:id/email_destinations', 401);
    await expect(client.emailRouting.listDestinations('domain', 102)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/user_groups/:id/email_sources', 404);
    await expect(client.emailRouting.listSources('user_group', 999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('429 → RateLimitError', async () => {
    respondWithError('post', '/domains/:id/email_sources', 429);
    await expect(
      client.emailRouting.createSource('domain', 102, { address: '10.0.0.1' })
    ).rejects.toBeInstanceOf(RateLimitError);
  });
});
