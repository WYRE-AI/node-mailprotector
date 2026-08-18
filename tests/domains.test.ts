import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { domainAliasFixture, domainFixture, movedDomainFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('domains', () => {
  it('lists domains under a customer', async () => {
    expect(await client.domains.listFor('customer', 329)).toEqual([domainFixture]);
  });

  it('lists domains under a reseller', async () => {
    let path: string | null = null;
    server.use(
      http.get(`${BASE}/resellers/:id/domains`, ({ request }) => {
        path = new URL(request.url).pathname;
        return HttpResponse.json([domainFixture]);
      })
    );
    await client.domains.listFor('reseller', 188);
    expect(path).toBe('/api/v1/resellers/188/domains');
  });

  it('gets a domain', async () => {
    expect(await client.domains.get(102)).toEqual(domainFixture);
  });

  it('creates a domain under a customer', async () => {
    const created = await client.domains.create(329, { name: 'domain.com' });
    expect(created.name).toBe('domain.com');
  });

  it('updates a domain', async () => {
    const updated = await client.domains.update(102, { address_discovery_enabled: false });
    expect(updated.address_discovery_enabled).toBe(false);
  });

  it('deletes a domain (204)', async () => {
    await expect(client.domains.delete(102)).resolves.toBeUndefined();
  });

  it('moves a domain to another customer', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/domains/:id/move`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(movedDomainFixture);
      })
    );
    const moved = await client.domains.move(102, 16998);
    expect(body).toEqual({ customer_id: 16998 });
    expect(moved.account?.id).toBe(16998);
  });

  it('lists domain aliases', async () => {
    expect(await client.domains.listAliases(102)).toEqual([domainAliasFixture]);
  });

  it('creates a domain alias', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/domains/:id/aliases`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(domainAliasFixture, { status: 201 });
      })
    );
    const alias = await client.domains.createAlias(102, 'new-domain-alias.com');
    expect(body).toEqual({ name: 'new-domain-alias.com' });
    expect(alias.parent?.id).toBe(102);
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/domains/:id', 401);
    await expect(client.domains.get(102)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/domains/:id', 404);
    await expect(client.domains.get(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/customers/:id/domains', 429);
    await expect(client.domains.listFor('customer', 329)).rejects.toBeInstanceOf(RateLimitError);
  });
});
