import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type EmailRoutingScope } from '../scopes.js';
import type {
  EmailDestination,
  EmailDestinationCreateData,
  EmailSource,
  EmailSourceCreateData,
  ListParams,
} from '../types/index.js';

/** Email routing: delivery destinations and allowed sources — scopes: domain | user_group. */
export class EmailRoutingResource {
  constructor(private readonly http: HttpClient) {}

  async listDestinations(
    scope: EmailRoutingScope,
    scopeId: number,
    params?: ListParams
  ): Promise<EmailDestination[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/email_destinations`, {
      params: { ...params },
    });
  }

  async createDestination(
    scope: EmailRoutingScope,
    scopeId: number,
    data: EmailDestinationCreateData
  ): Promise<EmailDestination> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/email_destinations`, {
      method: 'POST',
      body: data,
    });
  }

  async listSources(
    scope: EmailRoutingScope,
    scopeId: number,
    params?: ListParams
  ): Promise<EmailSource[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/email_sources`, {
      params: { ...params },
    });
  }

  async createSource(
    scope: EmailRoutingScope,
    scopeId: number,
    data: EmailSourceCreateData
  ): Promise<EmailSource> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/email_sources`, {
      method: 'POST',
      body: data,
    });
  }
}
