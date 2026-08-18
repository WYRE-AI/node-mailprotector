import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type ManagerScope } from '../scopes.js';
import type {
  ListParams,
  Manager,
  ManagerCreateData,
  NotificationDestination,
  NotificationDestinationCreateData,
} from '../types/index.js';

/** Managers (console logins) and their notification destinations. */
export class ManagersResource {
  constructor(private readonly http: HttpClient) {}

  /** List managers on a reseller or customer. */
  async listFor(scope: ManagerScope, scopeId: number, params?: ListParams): Promise<Manager[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/managers`, {
      params: { ...params },
    });
  }

  async get(managerId: number): Promise<Manager> {
    return this.http.request(`${API_PREFIX}/managers/${managerId}`);
  }

  /** Create a manager on a reseller or customer. */
  async createFor(
    scope: ManagerScope,
    scopeId: number,
    data: ManagerCreateData
  ): Promise<Manager> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/managers`, {
      method: 'POST',
      body: data,
    });
  }

  async delete(managerId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/managers/${managerId}`, { method: 'DELETE' });
  }

  /** List a manager's notification destinations. */
  async listNotificationDestinations(
    managerId: number,
    params?: ListParams
  ): Promise<NotificationDestination[]> {
    return this.http.request(`${API_PREFIX}/managers/${managerId}/notification_destinations`, {
      params: { ...params },
    });
  }

  /** Add a notification destination to a manager. */
  async createNotificationDestination(
    managerId: number,
    data: NotificationDestinationCreateData
  ): Promise<NotificationDestination> {
    return this.http.request(`${API_PREFIX}/managers/${managerId}/notification_destinations`, {
      method: 'POST',
      body: data,
    });
  }

  /** Delete a notification destination by its own id (shared with user destinations). */
  async deleteNotificationDestination(destinationId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/notification_destinations/${destinationId}`, {
      method: 'DELETE',
    });
  }
}
