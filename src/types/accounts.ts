import type { EntityRef } from './common.js';

/** A reseller (the MSP). Lives under a provider; `reseller` is null at top level. */
export interface Reseller {
  id: number;
  name?: string;
  provider?: EntityRef;
  reseller?: EntityRef | null;
  created_at?: string;
  updated_at?: string;
}

/** A customer account under a reseller. */
export interface Customer {
  id: number;
  name?: string;
  provider?: EntityRef;
  reseller?: EntityRef | null;
  created_at?: string;
  updated_at?: string;
}

/** Create/update body for resellers and customers. */
export interface AccountData {
  name?: string;
  email?: string;
  [key: string]: unknown;
}

/** A manager (console login with roles on one or more entities). */
export interface Manager {
  id: number;
  name?: string;
  username?: string;
  email?: string;
  roles?: ManagerRole[];
}

export interface ManagerRole {
  entity_id: number;
  entity_type: string;
  entity_name?: string;
}

export interface ManagerCreateData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  [key: string]: unknown;
}

/** A billing statement (resellers and customers). */
export interface Statement {
  id: number;
  amount?: number;
  currency?: string;
  statement_type?: string;
  statement_status?: string;
  starting_date?: string;
  ending_date?: string;
  billing_date?: string;
  due_date?: string;
}
