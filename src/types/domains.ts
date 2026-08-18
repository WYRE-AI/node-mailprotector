import type { EntityRef } from './common.js';

/** A domain (or domain alias, when `parent` is set). */
export interface Domain {
  id: number;
  name?: string;
  /** Owning customer account. */
  account?: EntityRef;
  domain_status?: EntityRef;
  /** For aliases: the parent domain. Null for primary domains. */
  parent?: EntityRef | null;
  verification_token?: string | null;
  address_discovery_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DomainCreateData {
  name: string;
  [key: string]: unknown;
}

export interface DomainUpdateData {
  name?: string;
  address_discovery_enabled?: boolean;
  [key: string]: unknown;
}

/** A user group within a domain (service tier + user container). */
export interface UserGroup {
  id: number;
  name?: string;
  domain?: EntityRef;
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

/** The service assignment on a user group. */
export interface UserGroupService {
  id: number;
  service_type?: string;
  user_group?: EntityRef;
  domain?: EntityRef;
  created_at?: string;
}

export interface UserGroupServicesUpdateData {
  service_types?: {
    addons?: string[];
    hosting?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}
