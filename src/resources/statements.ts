import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type StatementScope } from '../scopes.js';
import type { ListParams, Statement } from '../types/index.js';

/** Billing statements — scopes: reseller | customer. */
export class StatementsResource {
  constructor(private readonly http: HttpClient) {}

  async listFor(
    scope: StatementScope,
    scopeId: number,
    params?: ListParams
  ): Promise<Statement[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/statements`, {
      params: { ...params },
    });
  }
}
