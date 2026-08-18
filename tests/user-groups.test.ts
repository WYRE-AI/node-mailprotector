import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { userGroupFixture, userGroupServiceFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('userGroups', () => {
  it('lists user groups by domain', async () => {
    expect(await client.userGroups.list(102)).toEqual([userGroupFixture]);
  });

  it('gets a user group', async () => {
    expect(await client.userGroups.get(109)).toEqual(userGroupFixture);
  });

  it('creates a user group in a domain', async () => {
    const created = await client.userGroups.create(102, { name: 'new user group' });
    expect(created.name).toBe('new user group');
  });

  it('updates a user group', async () => {
    const updated = await client.userGroups.update(109, { name: 'Different User Group Name' });
    expect(updated.name).toBe('Different User Group Name');
  });

  it('deletes a user group (204)', async () => {
    await expect(client.userGroups.delete(109)).resolves.toBeUndefined();
  });

  it('gets the service assignment', async () => {
    expect(await client.userGroups.getServices(109)).toEqual(userGroupServiceFixture);
  });

  it('updates the service assignment', async () => {
    let body: unknown;
    server.use(
      http.put(`${BASE}/user_groups/:id/services`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(userGroupServiceFixture);
      })
    );
    const update = { service_types: { addons: ['bracket', 'securestore'], hosting: 'other' } };
    await client.userGroups.updateServices(109, update);
    expect(body).toEqual(update);
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/user_groups/:id', 401);
    await expect(client.userGroups.get(109)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/user_groups/:id', 404);
    await expect(client.userGroups.get(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/domains/:id/user_groups', 429);
    await expect(client.userGroups.list(102)).rejects.toBeInstanceOf(RateLimitError);
  });
});
