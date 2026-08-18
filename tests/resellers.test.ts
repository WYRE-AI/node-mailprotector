import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { resellerFixture } from './fixtures/mailprotector.js';
import { makeClient, respondWithError } from './helpers.js';

const client = makeClient();

describe('resellers', () => {
  it('lists resellers by provider', async () => {
    expect(await client.resellers.list(65)).toEqual([resellerFixture]);
  });

  it('gets a reseller', async () => {
    expect(await client.resellers.get(188)).toEqual(resellerFixture);
  });

  it('creates a reseller under a provider', async () => {
    const created = await client.resellers.create(65, {
      name: 'New reseller name',
      email: 'contact@domain.com',
    });
    expect(created.name).toBe('New reseller name');
  });

  it('updates a reseller', async () => {
    const updated = await client.resellers.update(188, { name: 'Different Reseller Name' });
    expect(updated.name).toBe('Different Reseller Name');
  });

  it('deletes a reseller (204)', async () => {
    await expect(client.resellers.delete(188)).resolves.toBeUndefined();
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/resellers/:id', 401);
    await expect(client.resellers.get(188)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/resellers/:id', 404);
    await expect(client.resellers.get(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/providers/:providerId/resellers', 429);
    await expect(client.resellers.list(65)).rejects.toBeInstanceOf(RateLimitError);
  });
});
