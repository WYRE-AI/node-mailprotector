import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type EntityScope } from '../scopes.js';
import type {
  AllowBlockRule,
  AllowBlockRuleCreateData,
  ListParams,
} from '../types/index.js';

/** Allow/block rules — exist at all five scopes. */
export class AllowBlockRulesResource {
  constructor(private readonly http: HttpClient) {}

  async listFor(
    scope: EntityScope,
    scopeId: number,
    params?: ListParams
  ): Promise<AllowBlockRule[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/allow_block_rules`, {
      params: { ...params },
    });
  }

  async createFor(
    scope: EntityScope,
    scopeId: number,
    data: AllowBlockRuleCreateData
  ): Promise<AllowBlockRule> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/allow_block_rules`, {
      method: 'POST',
      body: data,
    });
  }

  /** Delete a rule by its own id (scope-independent). */
  async delete(ruleId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/allow_block_rules/${ruleId}`, { method: 'DELETE' });
  }
}
