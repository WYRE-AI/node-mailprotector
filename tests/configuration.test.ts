import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { configurationFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('configuration', () => {
  it.each(['reseller', 'customer', 'domain', 'user_group'] as const)(
    'gets configuration at %s scope (unwraps the envelope)',
    async (scope) => {
      expect(await client.configuration.getFor(scope, 1)).toEqual(configurationFixture);
    }
  );

  it('updates configuration (PUT answers unwrapped)', async () => {
    let body: unknown;
    server.use(
      http.put(`${BASE}/customers/:id/configuration`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(configurationFixture);
      })
    );
    const update = { permissions: { messages: { allow_spam_release: true } } };
    const result = await client.configuration.updateFor('customer', 329, update);
    expect(body).toEqual(update);
    expect(result).toEqual(configurationFixture);
  });

  it('handles an already-unwrapped GET response defensively', async () => {
    server.use(
      http.get(`${BASE}/domains/:id/configuration`, () =>
        HttpResponse.json(configurationFixture)
      )
    );
    expect(await client.configuration.getFor('domain', 102)).toEqual(configurationFixture);
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/resellers/:id/configuration', 401);
    await expect(client.configuration.getFor('reseller', 188)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/user_groups/:id/configuration', 404);
    await expect(client.configuration.getFor('user_group', 999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('429 → RateLimitError', async () => {
    respondWithError('put', '/domains/:id/configuration', 429);
    await expect(client.configuration.updateFor('domain', 102, {})).rejects.toBeInstanceOf(
      RateLimitError
    );
  });
});
