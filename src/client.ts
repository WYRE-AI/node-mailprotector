import { DEFAULT_BASE_URL, type MailprotectorConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { AllowBlockRulesResource } from './resources/allow-block-rules.js';
import { ConfigurationResource } from './resources/configuration.js';
import { CustomersResource } from './resources/customers.js';
import { DomainsResource } from './resources/domains.js';
import { EmailRoutingResource } from './resources/email-routing.js';
import { LogsResource } from './resources/logs.js';
import { ManagersResource } from './resources/managers.js';
import { MessagesResource } from './resources/messages.js';
import { NotificationDestinationsResource } from './resources/notification-destinations.js';
import { ResellersResource } from './resources/resellers.js';
import { ResultsResource } from './resources/results.js';
import { StatementsResource } from './resources/statements.js';
import { UserGroupsResource } from './resources/user-groups.js';
import { UserSyncsResource } from './resources/user-syncs.js';
import { UsersResource } from './resources/users.js';

/** Mailprotector API client. One HttpClient shared by all resources. */
export class MailprotectorClient {
  readonly resellers: ResellersResource;
  readonly customers: CustomersResource;
  readonly domains: DomainsResource;
  readonly userGroups: UserGroupsResource;
  readonly users: UsersResource;
  readonly managers: ManagersResource;
  readonly messages: MessagesResource;
  readonly allowBlockRules: AllowBlockRulesResource;
  readonly configuration: ConfigurationResource;
  readonly logs: LogsResource;
  readonly statements: StatementsResource;
  readonly emailRouting: EmailRoutingResource;
  readonly userSyncs: UserSyncsResource;
  readonly notificationDestinations: NotificationDestinationsResource;
  readonly results: ResultsResource;

  constructor(config: MailprotectorConfig) {
    if (typeof config.apiKey !== 'string' || config.apiKey.trim() === '') {
      throw new Error(
        'Mailprotector credential "apiKey" is required and must be a non-empty string. ' +
          'API keys are per manager-role, from the web console profile page.'
      );
    }

    const http = new HttpClient({
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      apiKey: config.apiKey,
      rateLimiter: new RateLimiter(
        config.rateLimit?.maxRequests ?? 25,
        config.rateLimit?.windowMs ?? 5_000
      ),
      ...(config.maxRetries !== undefined ? { maxRetries: config.maxRetries } : {}),
      ...(config.timeoutMs !== undefined ? { timeoutMs: config.timeoutMs } : {}),
    });

    this.resellers = new ResellersResource(http);
    this.customers = new CustomersResource(http);
    this.domains = new DomainsResource(http);
    this.userGroups = new UserGroupsResource(http);
    this.users = new UsersResource(http);
    this.managers = new ManagersResource(http);
    this.messages = new MessagesResource(http);
    this.allowBlockRules = new AllowBlockRulesResource(http);
    this.configuration = new ConfigurationResource(http);
    this.logs = new LogsResource(http);
    this.statements = new StatementsResource(http);
    this.emailRouting = new EmailRoutingResource(http);
    this.userSyncs = new UserSyncsResource(http);
    this.notificationDestinations = new NotificationDestinationsResource(http);
    this.results = new ResultsResource(http);
  }
}
