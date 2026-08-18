/**
 * Entity configuration (reseller / customer / domain / user group). The
 * document is large and deeply nested; the sections observed in API examples
 * are typed loosely and everything else flows through the index signature.
 */
export interface EntityConfiguration {
  region?: {
    locale?: string;
    time_zone?: string;
    [key: string]: unknown;
  };
  billing?: {
    cc_addresses?: string[];
    [key: string]: unknown;
  };
  branding?: Record<string, unknown>;
  archiving?: {
    journal_address?: string | null;
    smtp_collector_address?: string | null;
    url?: string | null;
    [key: string]: unknown;
  };
  permissions?: {
    messages?: Record<string, boolean>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** Partial configuration update — send only the sections to change. */
export type EntityConfigurationUpdate = EntityConfiguration;
