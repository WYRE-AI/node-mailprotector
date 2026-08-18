import { API_PREFIX } from '../config.js';
import type { HttpClient } from '../http.js';
import { scopePath, type DomainParentScope } from '../scopes.js';
import type {
  Domain,
  DomainCreateData,
  DomainUpdateData,
  ListParams,
} from '../types/index.js';

/** Domains and domain aliases. */
export class DomainsResource {
  constructor(private readonly http: HttpClient) {}

  /** List domains under a parent entity (`reseller` or `customer`). */
  async listFor(
    parent: DomainParentScope,
    parentId: number,
    params?: ListParams
  ): Promise<Domain[]> {
    return this.http.request(`${API_PREFIX}/${scopePath(parent)}/${parentId}/domains`, {
      params: { ...params },
    });
  }

  async get(domainId: number): Promise<Domain> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}`);
  }

  /** Create a domain under a customer. */
  async create(customerId: number, data: DomainCreateData): Promise<Domain> {
    return this.http.request(`${API_PREFIX}/customers/${customerId}/domains`, {
      method: 'POST',
      body: data,
    });
  }

  async update(domainId: number, data: DomainUpdateData): Promise<Domain> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(domainId: number): Promise<void> {
    await this.http.request(`${API_PREFIX}/domains/${domainId}`, { method: 'DELETE' });
  }

  /** Move a domain to another customer. */
  async move(domainId: number, customerId: number): Promise<Domain> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/move`, {
      method: 'POST',
      body: { customer_id: customerId },
    });
  }

  /** List a domain's aliases. */
  async listAliases(domainId: number, params?: ListParams): Promise<Domain[]> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/aliases`, {
      params: { ...params },
    });
  }

  /** Create an alias for a domain. */
  async createAlias(domainId: number, name: string): Promise<Domain> {
    return this.http.request(`${API_PREFIX}/domains/${domainId}/aliases`, {
      method: 'POST',
      body: { name },
    });
  }
}
