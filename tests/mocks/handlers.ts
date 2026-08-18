import { http, HttpResponse } from 'msw';

import {
  allowBlockRuleFixture,
  configurationFixture,
  customerFixture,
  deliverManyFixture,
  domainAliasFixture,
  domainFixture,
  emailDestinationFixture,
  emailSourceFixture,
  logEntryFixture,
  managerFixture,
  messageFixture,
  movedDomainFixture,
  notificationDestinationFixture,
  resellerFixture,
  resultCodeFixture,
  statementFixture,
  userAliasFixture,
  userFixture,
  userGroupFixture,
  userGroupServiceFixture,
  userSyncFilterFixture,
  userSyncFixture,
  userSyncScheduleFixture,
} from '../fixtures/mailprotector.js';

export const BASE = 'https://emailservice.io/api/v1';

const noContent = () => new HttpResponse(null, { status: 204 });
const created = (body: unknown) => HttpResponse.json(body, { status: 201 });

async function merged<T extends object>(fixture: T, request: Request): Promise<T> {
  const body = (await request.json()) as Partial<T>;
  return { ...fixture, ...body };
}

export const handlers = [
  // ---- resellers -----------------------------------------------------------
  http.get(`${BASE}/providers/:providerId/resellers`, () =>
    HttpResponse.json([resellerFixture])
  ),
  http.post(`${BASE}/providers/:providerId/resellers`, async ({ request }) =>
    created(await merged(resellerFixture, request))
  ),
  http.get(`${BASE}/resellers/:id`, () => HttpResponse.json(resellerFixture)),
  http.put(`${BASE}/resellers/:id`, async ({ request }) =>
    HttpResponse.json(await merged(resellerFixture, request))
  ),
  http.delete(`${BASE}/resellers/:id`, noContent),

  // ---- customers -----------------------------------------------------------
  http.get(`${BASE}/resellers/:id/customers`, () => HttpResponse.json([customerFixture])),
  http.post(`${BASE}/resellers/:id/customers`, async ({ request }) =>
    created(await merged(customerFixture, request))
  ),
  http.get(`${BASE}/customers/:id`, () => HttpResponse.json(customerFixture)),
  http.put(`${BASE}/customers/:id`, async ({ request }) =>
    HttpResponse.json(await merged(customerFixture, request))
  ),
  http.delete(`${BASE}/customers/:id`, noContent),

  // ---- domains -------------------------------------------------------------
  // Generic list-by-parent covers /resellers/:id/domains and /customers/:id/domains.
  http.get(`${BASE}/:scope/:id/domains`, () => HttpResponse.json([domainFixture])),
  http.post(`${BASE}/customers/:id/domains`, async ({ request }) =>
    created(await merged(domainFixture, request))
  ),
  http.get(`${BASE}/domains/:id`, () => HttpResponse.json(domainFixture)),
  http.put(`${BASE}/domains/:id`, async ({ request }) =>
    HttpResponse.json(await merged(domainFixture, request))
  ),
  http.delete(`${BASE}/domains/:id`, noContent),
  http.post(`${BASE}/domains/:id/move`, () => HttpResponse.json(movedDomainFixture)),
  http.get(`${BASE}/domains/:id/aliases`, () => HttpResponse.json([domainAliasFixture])),
  http.post(`${BASE}/domains/:id/aliases`, () => created(domainAliasFixture)),

  // ---- user groups ---------------------------------------------------------
  http.get(`${BASE}/domains/:id/user_groups`, () => HttpResponse.json([userGroupFixture])),
  http.post(`${BASE}/domains/:id/user_groups`, async ({ request }) =>
    created(await merged(userGroupFixture, request))
  ),
  http.get(`${BASE}/user_groups/:id`, () => HttpResponse.json(userGroupFixture)),
  http.put(`${BASE}/user_groups/:id`, async ({ request }) =>
    HttpResponse.json(await merged(userGroupFixture, request))
  ),
  http.delete(`${BASE}/user_groups/:id`, noContent),
  http.get(`${BASE}/user_groups/:id/services`, () => HttpResponse.json(userGroupServiceFixture)),
  http.put(`${BASE}/user_groups/:id/services`, () => HttpResponse.json(userGroupServiceFixture)),

  // ---- users ---------------------------------------------------------------
  // Generic list-by-parent covers resellers/customers/domains/user_groups.
  http.get(`${BASE}/:scope/:id/users`, () => HttpResponse.json([userFixture])),
  http.post(`${BASE}/user_groups/:id/users`, () => created(userFixture)),
  http.post(`${BASE}/user_groups/:id/users/create_many`, () => created([userFixture])),
  http.post(`${BASE}/users/find_by_address`, () => HttpResponse.json(userFixture)),
  http.get(`${BASE}/users/:id`, () => HttpResponse.json(userFixture)),
  http.put(`${BASE}/users/:id`, async ({ request }) =>
    HttpResponse.json(await merged(userFixture, request))
  ),
  http.delete(`${BASE}/users/:id`, noContent),
  http.post(`${BASE}/users/:id/reset_password`, () => HttpResponse.json(userFixture)),
  http.get(`${BASE}/users/:id/aliases`, () => HttpResponse.json([userAliasFixture])),
  http.post(`${BASE}/users/:id/aliases`, () => created(userAliasFixture)),

  // ---- managers ------------------------------------------------------------
  http.get(`${BASE}/:scope/:id/managers`, () => HttpResponse.json([managerFixture])),
  http.post(`${BASE}/:scope/:id/managers`, () => created(managerFixture)),
  http.get(`${BASE}/managers/:id`, () => HttpResponse.json(managerFixture)),
  http.delete(`${BASE}/managers/:id`, noContent),
  http.get(`${BASE}/managers/:id/notification_destinations`, () =>
    HttpResponse.json([notificationDestinationFixture])
  ),
  http.post(`${BASE}/managers/:id/notification_destinations`, () =>
    HttpResponse.json(notificationDestinationFixture)
  ),

  // ---- messages ------------------------------------------------------------
  http.get(`${BASE}/:scope/:id/messages`, () => HttpResponse.json([messageFixture])),
  http.post(`${BASE}/messages/:id/deliver`, noContent),
  http.post(`${BASE}/:scope/:id/messages/deliver_many`, () =>
    HttpResponse.json(deliverManyFixture)
  ),

  // ---- allow/block rules ---------------------------------------------------
  http.get(`${BASE}/:scope/:id/allow_block_rules`, () =>
    HttpResponse.json([allowBlockRuleFixture])
  ),
  http.post(`${BASE}/:scope/:id/allow_block_rules`, async ({ request }) =>
    created(await merged(allowBlockRuleFixture, request))
  ),
  http.delete(`${BASE}/allow_block_rules/:id`, noContent),

  // ---- configuration -------------------------------------------------------
  // GET answers wrapped ({ configuration: {...} }); PUT answers unwrapped.
  http.get(`${BASE}/:scope/:id/configuration`, () =>
    HttpResponse.json({ configuration: configurationFixture })
  ),
  http.put(`${BASE}/:scope/:id/configuration`, () => HttpResponse.json(configurationFixture)),

  // ---- logs / statements ---------------------------------------------------
  http.get(`${BASE}/:scope/:id/logs`, () => HttpResponse.json([logEntryFixture])),
  http.get(`${BASE}/:scope/:id/statements`, () => HttpResponse.json([statementFixture])),

  // ---- email routing -------------------------------------------------------
  http.get(`${BASE}/:scope/:id/email_destinations`, () =>
    HttpResponse.json([emailDestinationFixture])
  ),
  http.post(`${BASE}/:scope/:id/email_destinations`, () => created(emailDestinationFixture)),
  http.get(`${BASE}/:scope/:id/email_sources`, () => HttpResponse.json([emailSourceFixture])),
  http.post(`${BASE}/:scope/:id/email_sources`, () => created(emailSourceFixture)),

  // ---- user syncs ----------------------------------------------------------
  http.get(`${BASE}/domains/:id/user_syncs`, () => HttpResponse.json([userSyncFixture])),
  http.post(`${BASE}/domains/:id/user_syncs`, () => created(userSyncFixture)),
  http.get(`${BASE}/user_syncs/:id`, () => HttpResponse.json(userSyncFixture)),
  http.put(`${BASE}/user_syncs/:id`, () => HttpResponse.json(userSyncFixture)),
  http.delete(`${BASE}/user_syncs/:id`, noContent),
  http.get(`${BASE}/domains/:id/user_sync_schedule`, () =>
    HttpResponse.json(userSyncScheduleFixture)
  ),
  http.put(`${BASE}/domains/:id/user_sync_schedule`, async ({ request }) =>
    HttpResponse.json(await merged(userSyncScheduleFixture, request))
  ),
  http.get(`${BASE}/user_syncs/:id/filters`, () => HttpResponse.json([userSyncFilterFixture])),
  http.post(`${BASE}/user_syncs/:id/filters`, () => created(userSyncFilterFixture)),
  http.get(`${BASE}/user_sync_filters/:id`, () => HttpResponse.json(userSyncFilterFixture)),
  http.delete(`${BASE}/user_sync_filters/:id`, noContent),

  // ---- notification destinations (users) -----------------------------------
  http.get(`${BASE}/users/:id/notification_destinations`, () =>
    HttpResponse.json([notificationDestinationFixture])
  ),
  http.post(`${BASE}/users/:id/notification_destinations`, () =>
    HttpResponse.json(notificationDestinationFixture)
  ),
  http.delete(`${BASE}/notification_destinations/:id`, noContent),

  // ---- results -------------------------------------------------------------
  http.post(`${BASE}/results`, () => HttpResponse.json(resultCodeFixture)),
];
