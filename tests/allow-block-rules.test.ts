import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { allowBlockRuleFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient, respondWithError } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('allowBlockRules', () => {
  it.each(['reseller', 'customer', 'domain', 'user_group', 'user'] as const)(
    'lists rules at %s scope',
    async (scope) => {
      expect(await client.allowBlockRules.listFor(scope, 1)).toEqual([allowBlockRuleFixture]);
    }
  );

  it('creates a rule at a scope with { value, rule_type }', async () => {
    let body: unknown;
    server.use(
      http.post(`${BASE}/domains/:id/allow_block_rules`, async ({ request }) => {
        body = await request.json();
        return HttpResponse.json(allowBlockRuleFixture, { status: 201 });
      })
    );
    await client.allowBlockRules.createFor('domain', 102, {
      value: 'block@domain.com',
      rule_type: 'block',
    });
    expect(body).toEqual({ value: 'block@domain.com', rule_type: 'block' });
  });

  it('deletes a rule by id (204)', async () => {
    await expect(client.allowBlockRules.delete(2445355)).resolves.toBeUndefined();
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/users/:id/allow_block_rules', 401);
    await expect(client.allowBlockRules.listFor('user', 883326)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('delete', '/allow_block_rules/:id', 404);
    await expect(client.allowBlockRules.delete(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/resellers/:id/allow_block_rules', 429);
    await expect(client.allowBlockRules.listFor('reseller', 188)).rejects.toBeInstanceOf(
      RateLimitError
    );
  });
});
