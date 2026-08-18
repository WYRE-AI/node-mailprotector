import type {
  AllowBlockRule,
  Customer,
  Domain,
  EmailDestination,
  EmailSource,
  EntityConfiguration,
  LogEntry,
  Manager,
  MpMessage,
  MpUser,
  NotificationDestination,
  Reseller,
  ResultCodeInfo,
  Statement,
  UserGroup,
  UserGroupService,
  UserSync,
  UserSyncFilter,
  UserSyncSchedule,
} from '../../src/index.js';

// All fixtures are drawn from the Mailprotector API documentation's example
// responses (ids and names included), lightly trimmed.

export const resellerFixture: Reseller = {
  id: 188,
  name: 'Mailprotector Direct (old)',
  provider: { id: 65, name: 'United States' },
  reseller: null,
  created_at: '2010-05-13T18:08:25.000Z',
  updated_at: '2014-05-13T23:27:51.000Z',
};

export const customerFixture: Customer = {
  id: 329,
  name: 'Mailprotector group',
  provider: { id: 65, name: 'United States' },
  reseller: { id: 188, name: 'Mailprotector Direct (old)' },
  created_at: '2010-05-12T10:33:24.000Z',
  updated_at: '2014-05-13T23:27:51.000Z',
};

export const domainFixture: Domain = {
  id: 102,
  name: 'mpdemo.net',
  account: { id: 7114, name: 'Mailprotector Demo Customer' },
  domain_status: { id: 2, name: 'Active' },
  parent: null,
  verification_token: null,
  address_discovery_enabled: true,
  created_at: '2010-01-02T00:00:00.000Z',
  updated_at: '2019-08-23T02:00:52.000Z',
};

export const domainAliasFixture: Domain = {
  id: 28483,
  name: 'new-domain-alias.com',
  account: { id: 7114, name: 'Mailprotector Demo Customer' },
  domain_status: { id: 1, name: 'Pending' },
  parent: { id: 102, name: 'mpdemo.net' },
  verification_token: 'd9qxEzUXAV0xQNx/DJimsa79kxedAUVrLVoRlb4Oqw8=',
  address_discovery_enabled: false,
  created_at: '2020-01-09T20:19:52.000Z',
  updated_at: '2020-01-09T20:19:52.000Z',
};

export const movedDomainFixture: Domain = {
  ...domainFixture,
  account: { id: 16998, name: 'Test Customer 3' },
};

export const userGroupFixture: UserGroup = {
  id: 109,
  name: 'CloudMail with Bracket',
  domain: { id: 102, name: 'mpdemo.net' },
  user_count: 56,
  created_at: '2010-05-13T18:12:15.000Z',
  updated_at: '2019-07-18T02:00:38.000Z',
};

export const userGroupServiceFixture: UserGroupService = {
  id: 9529,
  service_type: 'CloudFilter Email Security',
  user_group: { id: 109, name: 'CloudMail with Bracket' },
  domain: { id: 102, name: 'mpdemo.net' },
  created_at: '2012-04-30T18:57:35.000Z',
};

export const userFixture: MpUser = {
  id: 883326,
  name: 'abigail.thompson',
  parent: null,
  user_type: { id: 1, name: 'User' },
  user_group: { id: 25212, name: 'Office 365' },
  domain: { id: 1473, name: 'mailprotector.com' },
  primary_address: 'abigail.thompson@mailprotector.com',
  email_addresses: [
    'abigail.thompson@mailprotector.com',
    'abigail.thompson@mailprotector.net',
  ],
  first_name: 'Abigail',
  last_name: 'Thompson',
  created_at: '2017-10-06T18:31:17.000Z',
  updated_at: '2020-01-15T17:27:46.000Z',
};

export const userAliasFixture: MpUser = {
  id: 1274646,
  name: 'alias-username',
  parent: {
    id: 883326,
    name: 'abigail.thompson',
    primary_address: 'abigail.thompson@mailprotector.com',
  },
  user_type: { id: 2, name: 'Alias' },
  user_group: { id: 25212, name: 'Office 365' },
  domain: { id: 1473, name: 'mailprotector.com' },
  primary_address: 'abigail.thompson@mailprotector.com',
  email_addresses: ['alias-username@mailprotector.com', 'alias-username@mailprotector.net'],
  first_name: '',
  last_name: '',
  created_at: '2020-01-15T17:28:56.000Z',
  updated_at: '2020-01-15T17:28:56.000Z',
};

export const managerFixture: Manager = {
  id: 13790,
  name: 'API Test',
  username: 'api.test',
  email: 'operations@mailprotector.com',
  roles: [
    { entity_id: 343, entity_type: 'Account', entity_name: 'Mailprotector Demos Reseller' },
  ],
};

export const messageFixture: MpMessage = {
  id: 1985056110,
  uuid: '4F03A4FF-7E36-489E-9F14-D7F95BB0EA2B.1',
  address: 'sales@mailprotector.com.au',
  recipients: ['sales@mailprotector.com.au'],
  sender: 'lanxifa02@163.com',
  to: '"sales" <sales@mailprotector.com.au>',
  from: '"Keans Group Corp." <lanxifa02@163.com>',
  cc: '',
};

export const deliverManyFixture = {
  delivered_messages: [2015573173, 2015573567],
};

export const allowBlockRuleFixture: AllowBlockRule = {
  id: 2445355,
  entity: { id: 329, entity_type: 'Account', name: 'Different Customer Name' },
  value: 'blockdomain.com',
  rule_type: 'Block',
};

export const logEntryFixture: LogEntry = {
  id: 'a96c91c6-fdfe-4e99-a03c-3717b06bcdcb',
  uuid: 'a96c91c6-fdfe-4e99-a03c-3717b06bcdcb',
  sender: 'bounces@abmail.mailings.ncaa.com',
  from: '"NCAA.com" <no-reply@mailings.ncaa.com>',
  recipient: 'carnegie@mpdemo.net',
  score: { score: 340 },
  direction: 'inbound',
  origin: '167.89.41.152',
  subject: 'The Journey to Detroit Continues!',
  user: { id: 871139, name: 'carnegie' },
  user_group: { id: 109, name: 'Different User Group Name' },
  domain: { id: 102, name: 'mpdemo.net' },
  customer: { id: 7114, name: 'Mailprotector Demo Customer' },
  reseller: { id: 343, name: 'Mailprotector Demos Reseller' },
  provider: { id: 65, name: 'United States' },
  received_at: '2020-01-09T15:46:01.913+00:00',
  results_data: ['spf_pass', 'from_spf_none', 'reply_spf_softfail', 'multiple_from_replyto', 'bulk'],
  rule_ids: [],
  helo: 'o903.abmail.mailings.ncaa.com',
  ptr: 'o903.abmail.mailings.ncaa.com',
  ip: '167.89.41.152',
  postfix_queue_id: '29E3A61729',
};

export const statementFixture: Statement = {
  id: 3000448,
  amount: 50,
  currency: 'USD',
  statement_type: 'Automatic',
  statement_status: 'Settled',
  starting_date: '2016-10-05',
  ending_date: '2016-11-04',
  billing_date: '2016-11-04',
  due_date: '2016-11-04',
};

export const configurationFixture: EntityConfiguration = {
  region: { locale: 'en', time_zone: 'Eastern Time (US & Canada)' },
  billing: { cc_addresses: [] },
  permissions: { messages: { allow_spam_release: true, allow_policy_release: true } },
};

export const emailDestinationFixture: EmailDestination = {
  id: 1293,
  entity_id: 102,
  entity_type: 'Domain',
  address: 'example.com',
  priority: 0,
};

export const emailSourceFixture: EmailSource = {
  id: 127,
  entity: { id: 102, entity_type: 'Domain', name: 'mpdemo.net' },
  address: '97.81.240.155',
};

export const userSyncFixture: UserSync = {
  id: 3229,
  name: 'Active Directory',
  domain: { id: 102, name: 'mpdemo.net' },
  destination_user_group: { id: 109, name: 'CloudMail with Bracket' },
  source_type: 'UserSync::LdapSource',
  source: {
    id: 1138,
    host: null,
    port: null,
    usersname: null,
    password: null,
    search_base: null,
    use_ssl: false,
  },
  filters: [{ id: 2820, field: 'Department', value: 'Accounting', comparison_type: 1 }],
  alive: true,
  priority: null,
  enabled: false,
};

export const userSyncScheduleFixture: UserSyncSchedule = {
  id: 370,
  domain: { id: 102, name: 'mpdemo.net' },
  interval: 60,
  enabled: true,
  last_run_at: '2020-01-09T22:19:05.000Z',
  next_run_at: '2020-01-09T23:19:05.000Z',
};

export const userSyncFilterFixture: UserSyncFilter = {
  id: 2820,
  field: 'Department',
  value: 'Accounting',
  filter_group: 'all',
  comparison_type: { id: 1, name: 'equals' },
};

export const notificationDestinationFixture: NotificationDestination = {
  id: 1868,
  value: 'abigail.thompson@mailprotector.com',
  owner: { id: 883326, name: 'abigail.thompson', entity_type: 'User' },
  level: { level_id: 1, level: 'Normal' },
  destination_type: { destination_type_id: 1, destination_type: 'Email' },
};

export const resultCodeFixture: ResultCodeInfo = {
  code: 'no_rdns',
  mode: 'inbound',
  name: 'No reverse DNS',
  description: 'The sending IP address has no reverse DNS (PTR) record.',
};
