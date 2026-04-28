export type BackupRecord = {
  id: string;
  createdAt: string;
  label: string;
  schemaVersion: string;
  itemCounts: Record<string, number>;
  snapshot: Record<string, unknown>;
};
