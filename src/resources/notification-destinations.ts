import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import type {
  ListParams,
  NotificationDestination,
  NotificationDestinationCreateData,
} from '../types/index.js';

/**
 * Notification destinations on users. (Manager destinations live on
 * `ManagersResource`; deletes share the same id space.)
 */
export class NotificationDestinationsResource {
  constructor(private readonly http: HttpClient) {}

  /** List a user's notification destinations. */
  async listForUser(userId: number, params?: ListParams): Promise<NotificationDestination[]> {
    return this.http.request(`${API_PREFIX}/users/${userId}/notification_destinations`, {
      params: { ...params },
    });
  }

  /** Add a notification destination to a user. */
  async createForUser(
    userId: number,
    data: NotificationDestinationCreateData
  ): Promise<NotificationDestination> {
    return this.http.request(`${API_PREFIX}/users/${userId}/notification_destinations`, {
      method: 'POST',
      body: data,
    });
  }

  /** Delete a notification destination by id (user- or manager-owned). */
  async delete(destinationId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/notification_destinations/${destinationId}`, {
      method: 'DELETE',
    });
  }
}
