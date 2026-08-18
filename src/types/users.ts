import type { EntityRef } from './common.js';

/** A user's parent reference (aliases point at their primary user). */
export interface UserParentRef {
  id: number;
  name?: string;
  primary_address?: string;
}

/** A mail user (or user alias, when `parent` is set / `user_type` is Alias). */
export interface MpUser {
  id: number;
  name?: string;
  parent?: UserParentRef | null;
  user_type?: EntityRef;
  user_group?: EntityRef;
  domain?: EntityRef;
  primary_address?: string;
  email_addresses?: string[];
  first_name?: string;
  last_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserCreateData {
  name: string;
  first_name?: string;
  last_name?: string;
  user_type_id?: number;
  aliases?: string[];
  [key: string]: unknown;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  user_type_id?: number;
  [key: string]: unknown;
}
