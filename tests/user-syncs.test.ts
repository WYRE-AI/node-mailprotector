import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import {
  userSyncFilterFixture,
  userSyncFixture,
  userSyncScheduleFixture,
} from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('userSyncs', () => {
  it('lists user syncs on a domain', async () => {
    expect(await client.userSyncs.list(102)).toEqual([userSyncFixture]);
  });

  it('gets a user sync', async () => {
    expect(await client.userSyncs.get(3229)).toEqual(userSyncFixture);
  });

  it('creates a user sync on a domain', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/domains/:id/user_syncs`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(userSyncFixture, { status: 201 });
      })
    );
    const data = {
      destination_user_group_id: 109,
      source_type: 'UserSync::LdapSource',
      enabled: true,
      source: { host: 'host.com', port: '389', use_ssl: false },
    };
    await client.userSyncs.create(102, data);
    expect(body).toEqual(data);
  });

  it('updates a user sync', async () => {
    expect(await client.userSyncs.update(3229, { enabled: true })).toEqual(userSyncFixture);
  });

  it('deletes a user sync (204)', async () => {
    await expect(client.userSyncs.delete(3229)).resolves.toBeUndefined();
  });

  it('gets the sync schedule on a domain', async () => {
    expect(await client.userSyncs.getSchedule(102)).toEqual(userSyncScheduleFixture);
  });

  it('updates the sync schedule on a domain', async () => {
    const updated = await client.userSyncs.updateSchedule(102, { interval: 30, enabled: true });
    expect(updated.interval).toBe(30);
  });

  it('lists filters on a user sync', async () => {
    expect(await client.userSyncs.listFilters(3229)).toEqual([userSyncFilterFixture]);
  });

  it('gets a filter by id', async () => {
    expect(await client.userSyncs.getFilter(2820)).toEqual(userSyncFilterFixture);
  });

  it('creates a filter on a user sync', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/user_syncs/:id/filters`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(userSyncFilterFixture, { status: 201 });
      })
    );
    const data = { field: 'Department', value: 'Accounting', filter_group: 'any', comparison_type_id: 1 };
    await client.userSyncs.createFilter(3229, data);
    expect(body).toEqual(data);
  });

  it('deletes a filter (204)', async () => {
    await expect(client.userSyncs.deleteFilter(2820)).resolves.toBeUndefined();
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/user_syncs/:id', 401);
    await expect(client.userSyncs.get(3229)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/user_sync_filters/:id', 404);
    await expect(client.userSyncs.getFilter(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/domains/:id/user_syncs', 429);
    await expect(client.userSyncs.list(102)).rejects.toBeInstanceOf(RateLimitError);
  });
});
