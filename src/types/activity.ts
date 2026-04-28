export type ActivityEntityType =
  | 'ticket'
  | 'error'
  | 'incident'
  | 'user'
  | 'business'
  | 'knowledge_article'
  | 'resolution'
  | 'release'
  | 'data'
  | 'backup'
  | 'settings';

export type ActivityRecord = {
  id: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: string;
  actor: string;
  summary: string;
  timestamp: string;
  metadata: Record<string, string | number | boolean | null>;
};
