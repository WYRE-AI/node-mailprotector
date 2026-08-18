export { MailprotectorClient } from './client.js';
export {
  DEFAULT_BASE_URL,
  API_PREFIX,
  type MailprotectorConfig,
  type RateLimitConfig,
} from './config.js';
export { HttpClient, type HttpClientConfig, type RequestOptions } from './http.js';
export { RateLimiter } from './rate-limiter.js';
export {
  MailprotectorError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
} from './errors.js';
export {
  scopePath,
  type EntityScope,
  type MessageScope,
  type ConfigurationScope,
  type UserParentScope,
  type StatementScope,
  type EmailRoutingScope,
  type DomainParentScope,
  type ManagerScope,
} from './scopes.js';
export { ResellersResource } from './resources/resellers.js';
export { CustomersResource } from './resources/customers.js';
export { DomainsResource } from './resources/domains.js';
export { UserGroupsResource } from './resources/user-groups.js';
export { UsersResource } from './resources/users.js';
export { ManagersResource } from './resources/managers.js';
export { MessagesResource } from './resources/messages.js';
export { AllowBlockRulesResource } from './resources/allow-block-rules.js';
export { ConfigurationResource } from './resources/configuration.js';
export { LogsResource } from './resources/logs.js';
export { StatementsResource } from './resources/statements.js';
export { EmailRoutingResource } from './resources/email-routing.js';
export { UserSyncsResource } from './resources/user-syncs.js';
export { NotificationDestinationsResource } from './resources/notification-destinations.js';
export { ResultsResource } from './resources/results.js';
export type * from './types/index.js';
