import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { notificationDestinationFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('notificationDestinations', () => {
  it('lists a user notification destinations', async () => {
    expect(await client.notificationDestinations.listForUser(883326)).toEqual([
      notificationDestinationFixture,
    ]);
  });

  it('creates a user notification destination', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/users/:id/notification_destinations`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(notificationDestinationFixture);
      })
    );
    const data = { value: 'new-destination@domain.com', destination_type_id: 1, level_id: 1 };
    await client.notificationDestinations.createForUser(883326, data);
    expect(body).toEqual(data);
  });

  it('deletes a notification destination by id (204)', async () => {
    await expect(client.notificationDestinations.delete(312879)).resolves.toBeUndefined();
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/users/:id/notification_destinations', 401);
    await expect(client.notificationDestinations.listForUser(883326)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('delete', '/notification_destinations/:id', 404);
    await expect(client.notificationDestinations.delete(999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/users/:id/notification_destinations', 429);
    await expect(client.notificationDestinations.listForUser(883326)).rejects.toBeInstanceOf(
      RateLimitError
    );
  });
});
