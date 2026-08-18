/** `{ id, name }` reference used throughout Mailprotector responses. */
export interface EntityRef {
  id: number;
  name: string;
}

/** Reference that also carries the entity's type (`Account`, `Domain`, `UserGroup`, `User`). */
export interface TypedEntityRef {
  id: number;
  entity_type: string;
  name?: string;
}

/**
 * Common list-endpoint query parameters. Mailprotector list endpoints accept
 * arbitrary field filters (e.g. `{ first_name: 'Bob' }`) plus `page`
 * (pagination; max page size is 50 on messages). All entries pass through to
 * the query string as-is.
 */
export interface ListParams {
  /** 1-based page number. */
  page?: number;
  /** Arbitrary field filters — passed through as query-string params. */
  [field: string]: string | number | boolean | undefined;
}
