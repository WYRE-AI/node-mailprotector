import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import type {
  ListParams,
  UserSync,
  UserSyncData,
  UserSyncFilter,
  UserSyncFilterCreateData,
  UserSyncSchedule,
  UserSyncScheduleUpdateData,
} from '../types/index.js';

/** Directory user syncs, the per-domain sync schedule, and sync filters. */
export class UserSyncsResource {
  constructor(private readonly http: HttpClient) {}

  /** List user syncs on a domain. */
  async list(domainId: number, params?: ListParams): Promise<UserSync[]> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/user_syncs`, {
      params: { ...params },
    });
  }

  async get(userSyncId: number): Promise<UserSync> {
    return this.http.request(`${API_PREFIX}/user_syncs/${userSyncId}`);
  }

  async create(domainId: number, data: UserSyncData): Promise<UserSync> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/user_syncs`, {
      method: 'POST',
      body: data,
    });
  }

  async update(userSyncId: number, data: UserSyncData): Promise<UserSync> {
    return this.http.request(`${API_PREFIX}/user_syncs/${userSyncId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(userSyncId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/user_syncs/${userSyncId}`, { method: 'DELETE' });
  }

  /** Get the sync schedule on a domain. */
  async getSchedule(domainId: number): Promise<UserSyncSchedule> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/user_sync_schedule`);
  }

  /** Update the sync schedule on a domain. */
  async updateSchedule(
    domainId: number,
    data: UserSyncScheduleUpdateData
  ): Promise<UserSyncSchedule> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/user_sync_schedule`, {
      method: 'PUT',
      body: data,
    });
  }

  /** List a user sync's filters. */
  async listFilters(userSyncId: number, params?: ListParams): Promise<UserSyncFilter[]> {
    return this.http.request(`${API_PREFIX}/user_syncs/${userSyncId}/filters`, {
      params: { ...params },
    });
  }

  /** Get a filter by its own id. */
  async getFilter(filterId: number): Promise<UserSyncFilter> {
    return this.http.request(`${API_PREFIX}/user_sync_filters/${filterId}`);
  }

  async createFilter(
    userSyncId: number,
    data: UserSyncFilterCreateData
  ): Promise<UserSyncFilter> {
    return this.http.request(`${API_PREFIX}/user_syncs/${userSyncId}/filters`, {
      method: 'POST',
      body: data,
    });
  }

  async deleteFilter(filterId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/user_sync_filters/${filterId}`, { method: 'DELETE' });
  }
}
