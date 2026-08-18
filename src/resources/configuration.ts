import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type ConfigurationScope } from '../scopes.js';
import type { EntityConfiguration, EntityConfigurationUpdate } from '../types/index.js';

/** Unwrap the GET response's `{ configuration: {...} }` envelope (PUT answers unwrapped). */
function unwrapConfiguration(payload: unknown): EntityConfiguration {
  if (payload !== null && typeof payload === 'object' && 'configuration' in payload) {
    const inner = (payload as Record<string, unknown>)['configuration'];
    if (inner !== null && typeof inner === 'object') return inner as EntityConfiguration;
  }
  return (payload ?? {}) as EntityConfiguration;
}

/** Entity configuration — scopes: reseller | customer | domain | user_group. */
export class ConfigurationResource {
  constructor(private readonly http: HttpClient) {}

  async getFor(scope: ConfigurationScope, scopeId: number): Promise<EntityConfiguration> {
    const payload = await this.http.request<unknown>(
      `${API_PREFIX}/${scopePath(scope)}/${scopeId}/configuration`
    );
    return unwrapConfiguration(payload);
  }

  /** Partial update — send only the sections to change. */
  async updateFor(
    scope: ConfigurationScope,
    scopeId: number,
    data: EntityConfigurationUpdate
  ): Promise<EntityConfiguration> {
    const payload = await this.http.request<unknown>(
      `${API_PREFIX}/${scopePath(scope)}/${scopeId}/configuration`,
      { method: 'PUT', body: data }
    );
    return unwrapConfiguration(payload);
  }
}
