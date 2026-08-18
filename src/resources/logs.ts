import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type EntityScope } from '../scopes.js';
import type { ListParams, LogEntry } from '../types/index.js';

/** Message logs — exist at all five scopes. */
export class LogsResource {
  constructor(private readonly http: HttpClient) {}

  async listFor(scope: EntityScope, scopeId: number, params?: ListParams): Promise<LogEntry[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/logs`, {
      params: { ...params },
    });
  }
}
