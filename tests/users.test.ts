import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { userAliasFixture, userFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('users', () => {
  it.each(['reseller', 'customer', 'domain', 'user_group'] as const)(
    'lists users under a %s',
    async (parent) => {
      expect(await client.users.listFor(parent, 1)).toEqual([userFixture]);
    }
  );

  it('passes field filters through on list', async () => {
    let query: URLSearchParams | null = null;
    server.use(
      http.get(`${BASE}/customers/:id/users`, ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([userFixture]);
      })
    );
    await client.users.listFor('customer', 329, { first_name: 'Bob', page: 3 });
    expect(query!.get('first_name')).toBe('Bob');
    expect(query!.get('page')).toBe('3');
  });

  it('gets a user', async () => {
    expect(await client.users.get(883326)).toEqual(userFixture);
  });

  it('creates a user in a user group', async () => {
    const created = await client.users.create(109, { name: 'Username', user_type_id: 1 });
    expect(created.id).toBe(userFixture.id);
  });

  it('creates many users (wraps in { users })', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/user_groups/:id/users/create_many`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json([userFixture], { status: 201 });
      })
    );
    const users = [{ name: 'Username1' }, { name: 'Username2' }];
    expect(await client.users.createMany(109, users)).toEqual([userFixture]);
    expect(body).toEqual({ users });
  });

  it('updates a user', async () => {
    const updated = await client.users.update(883326, { first_name: 'First Name' });
    expect(updated.first_name).toBe('First Name');
  });

  it('deletes a user (204)', async () => {
    await expect(client.users.delete(883326)).resolves.toBeUndefined();
  });

  it('finds a user by address (POST /users/find_by_address)', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/users/find_by_address`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(userFixture);
      })
    );
    const user = await client.users.findByAddress('abigail.thompson@mailprotector.com');
    expect(body).toEqual({ address: 'abigail.thompson@mailprotector.com' });
    expect(user.id).toBe(883326);
  });

  it('resets a password', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/users/:id/reset_password`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(userFixture);
      })
    );
    await client.users.resetPassword(883326, 'A different password');
    expect(body).toEqual({ password: 'A different password' });
  });

  it('lists user aliases', async () => {
    expect(await client.users.listAliases(883326)).toEqual([userAliasFixture]);
  });

  it('creates a user alias (nested { alias: { name } } body)', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/users/:id/aliases`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(userAliasFixture, { status: 201 });
      })
    );
    await client.users.createAlias(883326, 'alias-username');
    expect(body).toEqual({ alias: { name: 'alias-username' } });
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/users/:id', 401);
    await expect(client.users.get(883326)).rejects.toBeInstanceOf(AuthenticationError);
  });

  it('404 → NotFoundError', async () => {
    respondWithError('post', '/users/find_by_address', 404);
    await expect(client.users.findByAddress('missing@nowhere.com')).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/user_groups/:id/users', 429);
    await expect(client.users.listFor('user_group', 109)).rejects.toBeInstanceOf(RateLimitError);
  });
});
