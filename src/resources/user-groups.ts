import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import type {
  ListParams,
  UserGroup,
  UserGroupService,
  UserGroupServicesUpdateData,
} from '../types/index.js';

/** User groups (service containers within a domain). */
export class UserGroupsResource {
  constructor(private readonly http: HttpClient) {}

  /** List user groups within a domain. */
  async list(domainId: number, params?: ListParams): Promise<UserGroup[]> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/user_groups`, {
      params: { ...params },
    });
  }

  async get(userGroupId: number): Promise<UserGroup> {
    return this.http.request(`${API_PREFIX}/user_groups/${userGroupId}`);
  }

  async create(domainId: number, data: { name: string; [key: string]: unknown }): Promise<UserGroup> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/user_groups`, {
      method: 'POST',
      body: data,
    });
  }

  async update(
    userGroupId: number,
    data: { name?: string; [key: string]: unknown }
  ): Promise<UserGroup> {
    return this.http.request(`${API_PREFIX}/user_groups/${userGroupId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(userGroupId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/user_groups/${userGroupId}`, { method: 'DELETE' });
  }

  /** Get the service assignment on a user group. */
  async getServices(userGroupId: number): Promise<UserGroupService> {
    return this.http.request(`${API_PREFIX}/user_groups/${userGroupId}/services`);
  }

  /** Update the service assignment (hosting type + addons) on a user group. */
  async updateServices(
    userGroupId: number,
    data: UserGroupServicesUpdateData
  ): Promise<UserGroupService> {
    return this.http.request(`${API_PREFIX}/user_groups/${userGroupId}/services`, {
      method: 'PUT',
      body: data,
    });
  }
}
