import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import type { AccountData, ListParams, Reseller } from '../types/index.js';

/** Resellers (the MSP entities). Listed/created under a provider. */
export class ResellersResource {
  constructor(private readonly http: HttpClient) {}

  /** List all resellers belonging to a provider. */
  async list(providerId: number, params?: ListParams): Promise<Reseller[]> {
    return this.http.request(`${API_PREFIX}/providers/${providerId}/resellers`, {
      params: { ...params },
    });
  }

  async get(resellerId: number): Promise<Reseller> {
    return this.http.request(`${API_PREFIX}/resellers/${resellerId}`);
  }

  async create(providerId: number, data: AccountData): Promise<Reseller> {
    return this.http.request(`${API_PREFIX}/providers/${providerId}/resellers`, {
      method: 'POST',
      body: data,
    });
  }

  async update(resellerId: number, data: AccountData): Promise<Reseller> {
    return this.http.request(`${API_PREFIX}/resellers/${resellerId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(resellerId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/resellers/${resellerId}`, { method: 'DELETE' });
  }
}
