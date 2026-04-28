import { addActivity } from '@/features/activity/lib/activityStore';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { BackupRecord } from '@/types/backups';

const STORAGE_KEY = 'inex-it-support:backups';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

const fallbackBackups: BackupRecord[] = [];

function normalizeBackups(raw: unknown): raw is BackupRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as BackupRecord).id === 'string');
}

function readStoredBackups() {
  return readLocalStore<BackupRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: fallbackBackups,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeBackups,
  });
}

function writeStoredBackups(records: BackupRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextBackupId(existing: BackupRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 8000), 8000);
  return `BKP-${highest + 1}`;
}

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getBackups() {
  return readStoredBackups().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getBackupById(backupId: string) {
  return getBackups().find((record) => record.id === backupId) || null;
}

export function createBackup(input: Omit<BackupRecord, 'id'>) {
  const existing = readStoredBackups();
  const record: BackupRecord = { id: nextBackupId(existing), ...input };
  const next = [record, ...existing];
  writeStoredBackups(next);

  addActivity({
    entityType: 'backup',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Backup ${record.id} was created with label ${record.label}.`,
    timestamp: record.createdAt,
    metadata: {
      schemaVersion: record.schemaVersion,
      moduleCount: Object.keys(record.itemCounts).length,
    },
  });

  return record;
}

export function updateBackup(backupId: string, updates: Partial<BackupRecord>) {
  const timestamp = nowIsoLike();
  const next = readStoredBackups().map((record) => (
    record.id === backupId ? { ...record, ...updates } : record
  ));
  writeStoredBackups(next);
  const updated = next.find((record) => record.id === backupId) || null;

  if (updated) {
    addActivity({
      entityType: 'backup',
      entityId: updated.id,
      action: 'updated',
      actor: 'System',
      summary: `Backup ${updated.id} was updated.`,
      timestamp,
      metadata: {
        label: updated.label,
      },
    });
  }

  return updated;
}

export function deleteBackup(backupId: string) {
  const existing = readStoredBackups();
  const deleted = existing.find((record) => record.id === backupId) || null;
  const next = existing.filter((record) => record.id !== backupId);
  writeStoredBackups(next);

  if (deleted) {
    addActivity({
      entityType: 'backup',
      entityId: deleted.id,
      action: 'deleted',
      actor: 'System',
      summary: `Backup ${deleted.id} was deleted.`,
      timestamp: nowIsoLike(),
      metadata: {
        label: deleted.label,
      },
    });
  }
}

export function seedDemoData() {
  writeStoredBackups(fallbackBackups);
}

export function clearData() {
  writeStoredBackups([]);
}
