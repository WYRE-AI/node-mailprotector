import type { EntityRef } from './common.js';

/** LDAP/directory source settings on a user sync. NB: `usersname` is the vendor's own typo. */
export interface UserSyncSource {
  id?: number;
  host?: string | null;
  port?: string | number | null;
  /** Vendor typo for "username" — returned as-is by the API. */
  usersname?: string | null;
  username?: string | null;
  password?: string | null;
  search_base?: string | null;
  use_ssl?: boolean;
  [key: string]: unknown;
}

export interface UserSync {
  id: number;
  name?: string;
  domain?: EntityRef;
  destination_user_group?: EntityRef;
  source_type?: string;
  source?: UserSyncSource;
  filters?: Array<{
    id: number;
    field?: string;
    value?: string;
    comparison_type?: number | EntityRef;
  }>;
  alive?: boolean;
  priority?: number | null;
  enabled?: boolean;
}

export interface UserSyncData {
  destination_user_group_id?: number;
  source_type?: string;
  enabled?: boolean | string;
  source?: UserSyncSource;
  [key: string]: unknown;
}

/** The per-domain sync schedule. */
export interface UserSyncSchedule {
  id: number;
  domain?: EntityRef;
  /** Minutes between runs. */
  interval?: number;
  enabled?: boolean;
  last_run_at?: string | null;
  next_run_at?: string | null;
}

export interface UserSyncScheduleUpdateData {
  interval?: number;
  enabled?: boolean;
  [key: string]: unknown;
}

export interface UserSyncFilter {
  id: number;
  field?: string;
  value?: string;
  /** `all` / `any`. */
  filter_group?: string;
  comparison_type?: EntityRef | number;
}

export interface UserSyncFilterCreateData {
  field: string;
  value: string;
  /** `all` / `any`. */
  filter_group?: string;
  comparison_type_id?: number;
  [key: string]: unknown;
}
