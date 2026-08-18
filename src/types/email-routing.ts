import type { TypedEntityRef } from './common.js';

/** A delivery destination (MX-style host) on a domain or user group. */
export interface EmailDestination {
  id: number;
  entity_id?: number;
  entity_type?: string;
  address?: string;
  priority?: number;
}

export interface EmailDestinationCreateData {
  address: string;
  [key: string]: unknown;
}

/** An allowed sending source (IP/host) on a domain or user group. */
export interface EmailSource {
  id: number;
  entity?: TypedEntityRef;
  address?: string;
}

export interface EmailSourceCreateData {
  address: string;
  [key: string]: unknown;
}
