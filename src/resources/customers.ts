import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import type { AccountData, Customer, ListParams } from '../types/index.js';

/** Customer accounts. Listed/created under a reseller. */
export class CustomersResource {
  constructor(private readonly http: HttpClient) {}

  /** List all customers belonging to a reseller. */
  async list(resellerId: number, params?: ListParams): Promise<Customer[]> {
    return this.http.request(`${API_PREFIX}/resellers/${resellerId}/customers`, {
      params: { ...params },
    });
  }

  async get(customerId: number): Promise<Customer> {
    return this.http.request(`${API_PREFIX}/customers/${customerId}`);
  }

  async create(resellerId: number, data: AccountData): Promise<Customer> {
    return this.http.request(`${API_PREFIX}/resellers/${resellerId}/customers`, {
      method: 'POST',
      body: data,
    });
  }

  async update(customerId: number, data: AccountData): Promise<Customer> {
    return this.http.request(`${API_PREFIX}/customers/${customerId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(customerId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/customers/${customerId}`, { method: 'DELETE' });
  }
}
