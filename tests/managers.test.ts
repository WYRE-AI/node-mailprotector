import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { managerFixture, notificationDestinationFixture } from './fixtures/mailprotector.js';
import { makeClient, respondWithError } from './helpers.js';

const client = makeClient();

describe('managers', () => {
  it('lists managers on a reseller', async () => {
    expect(await client.managers.listFor('reseller', 188)).toEqual([managerFixture]);
  });

  it('lists managers on a customer', async () => {
    expect(await client.managers.listFor('customer', 329)).toEqual([managerFixture]);
  });

  it('gets a manager', async () => {
    expect(await client.managers.get(13790)).toEqual(managerFixture);
  });

  it('creates a manager on a reseller', async () => {
    const created = await client.managers.createFor('reseller', 188, {
      first_name: 'FirstName',
      last_name: 'LastName',
      email: 'name@domain.com',
      username: 'username',
      password: 'password',
    });
    expect(created.id).toBe(managerFixture.id);
  });

  it('deletes a manager (204)', async () => {
    await expect(client.managers.delete(13790)).resolves.toBeUndefined();
  });

  it('lists a manager notification destinations', async () => {
    expect(await client.managers.listNotificationDestinations(13790)).toEqual([
      notificationDestinationFixture,
    ]);
  });

  it('creates a manager notification destination', async () => {
    const created = await client.managers.createNotificationDestination(13790, {
      value: 'new-destination@domain.com',
      destination_type_id: 1,
      level_id: 1,
    });
    expect(created.id).toBe(notificationDestinationFixture.id);
  });

  it('deletes a notification destination (204)', async () => {
    await expect(client.managers.deleteNotificationDestination(312884)).resolves.toBeUndefined();
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/managers/:id', 401);
    await expect(client.managers.get(13790)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/managers/:id', 404);
    await expect(client.managers.get(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/resellers/:id/managers', 429);
    await expect(client.managers.listFor('reseller', 188)).rejects.toBeInstanceOf(RateLimitError);
  });
});
