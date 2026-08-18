import { describe, expect, it } from 'vitest';

import { AuthenticationError, NotFoundError, RateLimitError } from '../src/index.js';
import { statementFixture } from './fixtures/mailprotector.js';
import { makeClient, respondWithError } from './helpers.js';

const client = makeClient();

describe('statements', () => {
  it.each(['reseller', 'customer'] as const)('lists statements at %s scope', async (scope) => {
    expect(await client.statements.listFor(scope, 1)).toEqual([statementFixture]);
  });

  it('401 → AuthenticationError', async () => {
    respondWithError('get', '/resellers/:id/statements', 401);
    await expect(client.statements.listFor('reseller', 188)).rejects.toBeInstanceOf(
      AuthenticationError
    );
  });

  it('404 → NotFoundError', async () => {
    respondWithError('get', '/customers/:id/statements', 404);
    await expect(client.statements.listFor('customer', 999)).rejects.toBeInstanceOf(
      NotFoundError
    );
  });

  it('429 → RateLimitError', async () => {
    respondWithError('get', '/customers/:id/statements', 429);
    await expect(client.statements.listFor('customer', 329)).rejects.toBeInstanceOf(
      RateLimitError
    );
  });
});
