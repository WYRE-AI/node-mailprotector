/** A quarantined message. */
export interface MpMessage {
  id: number;
  uuid?: string;
  address?: string;
  recipients?: string[];
  sender?: string;
  to?: string;
  from?: string;
  cc?: string;
  subject?: string;
  received_at?: string;
}

/** Options for releasing (delivering) quarantined messages. */
export interface MessageReleaseOptions {
  /** 1 to deliver to the original recipients as well. */
  include_original_recipients?: number | boolean;
  /** Comma-separated additional recipient addresses. */
  recipients?: string;
  [key: string]: unknown;
}

export interface DeliverManyResult {
  delivered_messages: number[];
}

/** An allow/block rule at any scope. */
export interface AllowBlockRule {
  id: number;
  entity?: {
    id: number;
    entity_type: string;
    name?: string;
  };
  value?: string;
  /** `Allow` / `Block` (the API accepts lowercase on create). */
  rule_type?: string;
}

export interface AllowBlockRuleCreateData {
  value: string;
  rule_type: string;
}

/** A message-log entry. */
export interface LogEntry {
  id: string;
  uuid?: string;
  sender?: string | null;
  from?: string;
  recipient?: string;
  score?: { score: number };
  direction?: string;
  origin?: string;
  subject?: string;
  user?: { id: number; name?: string };
  user_group?: { id: number; name?: string };
  domain?: { id: number; name?: string };
  customer?: { id: number; name?: string };
  reseller?: { id: number; name?: string };
  provider?: { id: number; name?: string };
  received_at?: string;
  results_data?: string[];
  rule_ids?: number[];
  helo?: string;
  ptr?: string;
  ip?: string;
  postfix_queue_id?: string;
}

/** Result-code lookup request (POST /results). */
export interface ResultCodeQuery {
  /** e.g. `no_rdns` (values appear in `LogEntry.results_data`). */
  code: string;
  /** e.g. `inbound` / `outbound`. */
  mode: string;
}

/** Result-code documentation entry — shape is not documented, so fields stay loose. */
export interface ResultCodeInfo {
  code?: string;
  mode?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}
