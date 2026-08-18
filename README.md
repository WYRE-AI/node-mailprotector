# node-mailprotector

Node.js client library for the [Mailprotector](https://api.mailprotector.com/) API (CloudFilter, Bracket, SafeSend, XtraMail).

- Zero runtime dependencies — built on native `fetch` (Node 20+).
- Dual ESM + CJS build with full TypeScript types.
- Token-bucket rate limiting (25 requests / 5 s by default — Mailprotector publishes no limits).
- Automatic retries with exponential backoff for network errors/timeouts, 429, and 5xx (Retry-After honored).
- Typed error hierarchy (`MailprotectorError` → `AuthenticationError`, `ForbiddenError`, `NotFoundError`, `ValidationError`, `RateLimitError`, `ServerError`).
- Scope-aware helpers for the operations Mailprotector exposes at multiple entity levels (messages, allow/block rules, logs, configuration, …).

## Install

```bash
npm install @wyre-technology/node-mailprotector
```

The package is published to GitHub Packages under the `@wyre-technology` scope. Configure your `.npmrc`:

```
@wyre-technology:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Usage

```ts
import { MailprotectorClient } from '@wyre-technology/node-mailprotector';

const mp = new MailprotectorClient({
  apiKey: process.env.MAILPROTECTOR_API_KEY!, // per manager-role, from the console profile page
  // baseUrl: 'https://emailservice.io',      // default
  // timeoutMs: 30_000,
  // maxRetries: 3,
  // rateLimit: { maxRequests: 25, windowMs: 5_000 },
});

// Entity hierarchy: Provider → Reseller → Customer → Domain → User Group → User.
const customers = await mp.customers.list(188); // by reseller id
const domains = await mp.domains.listFor('customer', customers[0].id);
const groups = await mp.userGroups.list(domains[0].id);

// List endpoints accept arbitrary field filters plus `page`:
const bobs = await mp.users.listFor('customer', 329, { first_name: 'Bob', page: 1 });

// Look a user up by any of their addresses.
const user = await mp.users.findByAddress('abigail.thompson@mailprotector.com');

// Quarantine: list and release messages at any scope
// (reseller | customer | domain | user_group | user).
const held = await mp.messages.listFor('user', user.id, { page: 1 });
await mp.messages.release(held[0].id);
await mp.messages.releaseMany('domain', domains[0].id, held.map((m) => m.id));

// Allow/block rules at any scope.
await mp.allowBlockRules.createFor('domain', domains[0].id, {
  value: 'spammer.example',
  rule_type: 'block',
});

// Configuration (reseller | customer | domain | user_group) — partial updates.
await mp.configuration.updateFor('customer', 329, {
  permissions: { messages: { allow_spam_release: true } },
});
```

## Resources

| Property | Coverage |
|---|---|
| `resellers` | list by provider, get, create, update, delete |
| `customers` | list by reseller, get, create, update, delete |
| `domains` | list by parent (reseller/customer), get, create under customer, update, delete, move, aliases list/create |
| `userGroups` | list by domain, get, create, update, delete, services get/update |
| `users` | list by parent (reseller/customer/domain/user_group), get, create, createMany, update, delete, findByAddress, resetPassword, aliases list/create |
| `managers` | list/create by reseller or customer, get, delete, notification destinations list/create/delete |
| `messages` | listFor (5 scopes), release (`POST /messages/{id}/deliver`), releaseMany (`deliver_many`) |
| `allowBlockRules` | listFor/createFor (5 scopes), delete |
| `configuration` | getFor/updateFor (reseller/customer/domain/user_group) |
| `logs` | listFor (5 scopes) |
| `statements` | listFor (reseller/customer) |
| `emailRouting` | destinations list/create + sources list/create (domain/user_group) |
| `userSyncs` | list by domain, get, create, update, delete, schedule get/update, filters list/get/create/delete |
| `notificationDestinations` | user destinations list/create, delete by id |
| `results` | findByCode (`POST /results`) — result-code documentation lookup |

## API quirks this SDK handles for you

- **`GET .../configuration` responses are wrapped** in `{ configuration: {...} }` while the `PUT` answers unwrapped — `configuration.getFor()`/`updateFor()` normalize both to the bare document.
- **User aliases are created with a nested body** (`{ alias: { name } }`) — `users.createAlias()` builds it for you.
- **`deliver_many` wants comma-joined id strings** — `messages.releaseMany()` accepts a plain array.
- **Max page size on message lists is 50**; pass `page` to walk pages.
- **`UserSyncSource.usersname`** is the vendor's own typo, faithfully typed.

## Error handling

```ts
import {
  AuthenticationError,
  NotFoundError,
  RateLimitError,
} from '@wyre-technology/node-mailprotector';

try {
  await mp.customers.get(999999);
} catch (err) {
  if (err instanceof AuthenticationError) {
    // 401 — bad/expired API key (terminal; keys are static)
  } else if (err instanceof NotFoundError) {
    // 404
  } else if (err instanceof RateLimitError) {
    console.log(`retry after ${err.retryAfter}s`);
  }
}
```

All errors expose `statusCode` and the raw `response` body. 429 and 5xx are retried automatically up to `maxRetries` (default 3) before throwing.

## Development

```bash
export NODE_AUTH_TOKEN=$(gh auth token)
npm install
npm run lint   # tsc --noEmit
npm run build  # tsup (ESM + CJS + d.ts)
npm test       # vitest + MSW (no live API calls)
```

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[Apache-2.0](./LICENSE) © WYRE Technology
