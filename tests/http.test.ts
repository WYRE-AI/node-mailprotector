import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import {
  ForbiddenError,
  MailprotectorError,
  ValidationError,
} from '../src/index.js';
import { customerFixture } from './fixtures/mailprotector.js';
import { BASE, makeClient } from './helpers.js';
import { server } from './mocks/server.js';

const client = makeClient();

describe('http client', () => {
  it('sends Authorization: Bearer <apiKey> on every request', async () => {
    let auth: string | null = null;
    server.use(
      http.get(`${BASE}/customers/:id`, ({ request }) => {
        auth = request.headers.get('authorization');
        return HttpResponse.json(customerFixture);
      })
    );
    await client.customers.get(329);
    expect(auth).toBe('Bearer test-api-key');
  });

  it('drops undefined/null query params and stringifies the rest', async () => {
    let query: URLSearchParams | null = null;
    server.use(
      http.get(`${BASE}/resellers/:id/customers`, ({ request }) => {
        query = new URL(request.url).searchParams;
        return HttpResponse.json([customerFixture]);
      })
    );
    await client.customers.list(188, {
      name: 'Acme',
      page: 1,
      active: true,
      skipped: undefined,
    });
    expect(query!.get('name')).toBe('Acme');
    expect(query!.get('page')).toBe('1');
    expect(query!.get('active')).toBe('true');
    expect(query!.has('skipped')).toBe(false);
  });

  it('400 → ValidationError', async () => {
    server.use(
      http.get(`${BASE}/customers/:id`, () =>
        HttpResponse.json({ message: 'Bad request' }, { status: 400 })
      )
    );
    await expect(client.customers.get(329)).rejects.toBeInstanceOf(ValidationError);
  });

  it('403 → ForbiddenError', async () => {
    server.use(
      http.get(`${BASE}/customers/:id`, () =>
        HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
      )
    );
    await expect(client.customers.get(329)).rejects.toBeInstanceOf(ForbiddenError);
  });

  it('422 → ValidationError with statusCode 422', async () => {
    server.use(
      http.get(`${BASE}/customers/:id`, () =>
        HttpResponse.json({ message: 'Unprocessable' }, { status: 422 })
      )
    );
    const err = await client.customers.get(329).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).statusCode).toBe(422);
  });

  it('unmapped 4xx → MailprotectorError with the status code', async () => {
    server.use(
      http.get(`${BASE}/customers/:id`, () =>
        HttpResponse.json({ message: 'Teapot' }, { status: 418 })
      )
    );
    const err = await client.customers.get(329).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(MailprotectorError);
    expect((err as MailprotectorError).statusCode).toBe(418);
    expect((err as MailprotectorError).message).toBe('Teapot');
  });

  it('retries a 429 (honoring Retry-After) and succeeds', async () => {
    const retrying = makeClient(1);
    let calls = 0;
    server.use(
      http.get(`${BASE}/customers/:id`, () => {
        calls += 1;
        if (calls === 1) {
          return HttpResponse.json(
            { message: 'Too many requests' },
            { status: 429, headers: { 'Retry-After': '0' } }
          );
        }
        return HttpResponse.json(customerFixture);
      })
    );
    expect(await retrying.customers.get(329)).toEqual(customerFixture);
    expect(calls).toBe(2);
  }, 10_000);

  it('retries a 500 and succeeds', async () => {
    const retrying = makeClient(1);
    let calls = 0;
    server.use(
      http.get(`${BASE}/customers/:id`, () => {
        calls += 1;
        if (calls === 1) {
          return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
        return HttpResponse.json(customerFixture);
      })
    );
    expect(await retrying.customers.get(329)).toEqual(customerFixture);
    expect(calls).toBe(2);
  }, 10_000);

  it('retries a network error and succeeds', async () => {
    const retrying = makeClient(1);
    server.use(
      http.get(`${BASE}/customers/:id`, () => HttpResponse.error(), { once: true })
    );
    expect(await retrying.customers.get(329)).toEqual(customerFixture);
  }, 10_000);

  it('parses non-JSON error bodies into the response field', async () => {
    server.use(
      http.get(
        `${BASE}/customers/:id`,
        () => new HttpResponse('gateway exploded', { status: 400 })
      )
    );
    const err = await client.customers.get(329).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).response).toBe('gateway exploded');
  });
});
