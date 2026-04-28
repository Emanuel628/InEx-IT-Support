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

export function getBackups() {
  return readStoredBackups().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createBackup(input: Omit<BackupRecord, 'id'>) {
  const existing = readStoredBackups();
  const record: BackupRecord = { id: nextBackupId(existing), ...input };
  const next = [record, ...existing];
  writeStoredBackups(next);
  return record;
}

export function deleteBackup(backupId: string) {
  const next = readStoredBackups().filter((record) => record.id !== backupId);
  writeStoredBackups(next);
}

export function clearData() {
  writeStoredBackups([]);
}
