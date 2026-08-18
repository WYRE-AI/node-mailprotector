import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type UserParentScope } from '../scopes.js';
import type {
  ListParams,
  MpUser,
  UserCreateData,
  UserUpdateData,
} from '../types/index.js';

/** Mail users and user aliases. */
export class UsersResource {
  constructor(private readonly http: HttpClient) {}

  /** List users under a parent entity (`reseller`, `customer`, `domain`, or `user_group`). */
  async listFor(
    parent: UserParentScope,
    parentId: number,
    params?: ListParams
  ): Promise<MpUser[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(parent)}/${parentId}/users`, {
      params: { ...params },
    });
  }

  async get(userId: number): Promise<MpUser> {
    return this.http.request(`${API_PREFIX}/users/${userId}`);
  }

  /** Create a user in a user group. */
  async create(userGroupId: number, data: UserCreateData): Promise<MpUser> {
    return this.http.request(`${API_PREFIX}/user_groups/${userGroupId}/users`, {
      method: 'POST',
      body: data,
    });
  }

  /** Create several users in a user group in one call. */
  async createMany(userGroupId: number, users: UserCreateData[]): Promise<MpUser[]> {
    return this.http.request(`${API_PREFIX}/user_groups/${userGroupId}/users/create_many`, {
      method: 'POST',
      body: { users },
    });
  }

  async update(userId: number, data: UserUpdateData): Promise<MpUser> {
    return this.http.request(`${API_PREFIX}/users/${userId}`, { method: 'PUT', body: data });
  }

  async delete(userId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/users/${userId}`, { method: 'DELETE' });
  }

  /** Look up a user by any of their email addresses. */
  async findByAddress(address: string): Promise<MpUser> {
    return this.http.request(`${API_PREFIX}/users/find_by_address`, {
      method: 'POST',
      body: { address },
    });
  }

  /** Reset a user's password. */
  async resetPassword(userId: number, password: string): Promise<MpUser> {
    return this.http.request(`${API_PREFIX}/users/${userId}/reset_password`, {
      method: 'POST',
      body: { password },
    });
  }

  /** List a user's aliases. */
  async listAliases(userId: number, params?: ListParams): Promise<MpUser[]> {
    return this.http.request(`${API_PREFIX}/users/${userId}/aliases`, {
      params: { ...params },
    });
  }

  /** Create an alias for a user (body is nested: `{ alias: { name } }`). */
  async createAlias(userId: number, name: string): Promise<MpUser> {
    return this.http.request(`${API_PREFIX}/users/${userId}/aliases`, {
      method: 'POST',
      body: { alias: { name } },
    });
  }
}
