import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type MessageScope } from '../scopes.js';
import type {
  DeliverManyResult,
  ListParams,
  MessageReleaseOptions,
  MpMessage,
} from '../types/index.js';

/** Quarantined messages. Max page size on message lists is 50. */
export class MessagesResource {
  constructor(private readonly http: HttpClient) {}

  /** List quarantined messages at any scope (`reseller`|`customer`|`domain`|`user_group`|`user`). */
  async listFor(
    scope: MessageScope,
    scopeId: number,
    params?: ListParams
  ): Promise<MpMessage[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(scope)}/${scopeId}/messages`, {
      params: { ...params },
    });
  }

  /** Release (deliver) a single quarantined message. */
  async release(messageId: number, options?: MessageReleaseOptions): Promise<void> {
    await this.http.request(`${API_PREFIX}/messages/${messageId}/deliver`, {
      method: 'POST',
      body: options ?? {},
    });
  }

  /** Release (deliver) several quarantined messages at a scope in one call. */
  async releaseMany(
    scope: MessageScope,
    scopeId: number,
    ids: Array<number | string> | string,
    options?: MessageReleaseOptions
  ): Promise<DeliverManyResult> {
    const idList = Array.isArray(ids) ? ids.join(',') : ids;
    return this.http.request(
      `${API_PREFIX}/${scopePath(scope)}/${scopeId}/messages/deliver_many`,
      {
        method: 'POST',
        body: { ids: idList, ...options },
      }
    );
  }
}
