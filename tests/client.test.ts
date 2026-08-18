import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { MailprotectorClient } from '../src/index.js';
import { resellerFixture } from './fixtures/mailprotector.js';
import { server } from './mocks/server.js';

describe('MailprotectorClient', () => {
  it('throws immediately when apiKey is missing/empty', () => {
    expect(() => new MailprotectorClient({ apiKey: '' })).toThrow(/apiKey/);
    expect(
      () => new MailprotectorClient({ apiKey: '   ' })
    ).toThrow(/apiKey/);
    // @ts-expect-error deliberate bad input
    expect(() => new MailprotectorClient({})).toThrow(/apiKey/);
  });

  it('wires up all fifteen resources', () => {
    const client = new MailprotectorClient({ apiKey: 'k' });
    for (const resource of [
      'resellers',
      'customers',
      'domains',
      'userGroups',
      'users',
      'managers',
      'messages',
      'allowBlockRules',
      'configuration',
      'logs',
      'statements',
      'emailRouting',
      'userSyncs',
      'notificationDestinations',
      'results',
    ] as const) {
      expect(client[resource]).toBeDefined();
    }
  });

  it('honors a custom baseUrl (host swap only — /api/v1 stays)', async () => {
    server.use(
      http.get('https://custom.example.com/api/v1/resellers/:id', () =>
        HttpResponse.json(resellerFixture)
      )
    );
    const client = new MailprotectorClient({
      apiKey: 'k',
      baseUrl: 'https://custom.example.com/',
      maxRetries: 0,
    });
    expect(await client.resellers.get(188)).toEqual(resellerFixture);
  });
});
