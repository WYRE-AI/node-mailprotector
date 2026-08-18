import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { customerFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('customers', () => {
  it('lists customers by reseller', async () => {
    expect(await client.customers.list(188)).toEqual([customerFixture]);
  });

  it('passes arbitrary field filters and page through as query params', async () => {
    let query: URLSearchParams | null = null;
    server.use(
      http.get(`${BASE}/resellers/:id/customers`, ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([customerFixture]);
      })
    );
    await client.customers.list(188, { name: 'Acme', page: 2 });
    expect(query!.get('name')).toBe('Acme');
    expect(query!.get('page')).toBe('2');
  });

  it('gets a customer', async () => {
    expect(await client.customers.get(329)).toEqual(customerFixture);
  });

  it('creates a customer under a reseller', async () => {
    const created = await client.customers.create(188, {
      name: 'A New Customer',
      email: 'contactemail@domain.com',
    });
    expect(created.name).toBe('A New Customer');
  });

  it('updates a customer', async () => {
    const updated = await client.customers.update(329, { name: 'Different Customer Name' });
    expect(updated.name).toBe('Different Customer Name');
  });

  it('deletes a customer (204)', async () => {
    await expect(client.customers.delete(329)).resolves.toBeUndefined();
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/customers/:id', 401);
    await expect(client.customers.get(329)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/customers/:id', 404);
    await expect(client.customers.get(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/resellers/:id/customers', 429);
    await expect(client.customers.list(188)).rejects.toBeInstanceOf(RateLimitError);
  });
});
