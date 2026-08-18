/**
 * Mailprotector's entity hierarchy is Provider → Reseller → Customer →
 * Domain → User Group → User, and many operations (messages, allow/block
 * rules, logs, configuration, …) exist at several of these scopes with
 * identical shapes. Scoped resource methods take a `scope` + `scopeId` pair
 * and route to `/{scopes}/{scopeId}/...`.
 */
export type EntityScope = 'reseller' | 'customer' | 'domain' | 'user_group' | 'user';

/** messages, allow/block rules, logs — all five scopes. */
export type MessageScope = EntityScope;
/** configuration — every scope except user. */
export type ConfigurationScope = Exclude<EntityScope, 'user'>;
/** users can be listed under any ancestor entity. */
export type UserParentScope = Exclude<EntityScope, 'user'>;
/** statements — billing entities only. */
export type StatementScope = 'reseller' | 'customer';
/** email routing destinations/sources. */
export type EmailRoutingScope = 'domain' | 'user_group';
/** domains hang off account-level entities. */
export type DomainParentScope = 'reseller' | 'customer';
/** managers hang off account-level entities. */
export type ManagerScope = 'reseller' | 'customer';

const SCOPE_PATHS: Record<EntityScope, string> = {
  reseller: 'resellers',
  customer: 'customers',
  domain: 'domains',
  user_group: 'user_groups',
  user: 'users',
};

/** Map a scope name to its URL collection segment (e.g. `user_group` → `user_groups`). */
export function scopePath(scope: EntityScope): string {
  const path = SCOPE_PATHS[scope];
  if (!path) {
    throw new Error(
      `Unknown Mailprotector scope "${String(scope)}" — expected one of: ${Object.keys(SCOPE_PATHS).join(', ')}`
    );
  }
  return path;
}
