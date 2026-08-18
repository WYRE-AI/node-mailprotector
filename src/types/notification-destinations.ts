/** A notification destination on a user or manager. */
export interface NotificationDestination {
  id: number;
  value?: string;
  owner?: {
    id: number;
    name?: string;
    entity_type?: string;
  };
  level?: {
    level_id: number;
    level?: string;
  };
  destination_type?: {
    destination_type_id: number;
    destination_type?: string;
  };
}

export interface NotificationDestinationCreateData {
  value: string;
  /** 1 = Email. */
  destination_type_id: number;
  /** 1 = Normal. */
  level_id: number;
  [key: string]: unknown;
}
