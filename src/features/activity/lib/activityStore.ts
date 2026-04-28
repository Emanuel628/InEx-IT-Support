import { mockActivity } from '@/features/activity/data/mockActivity';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { ActivityRecord } from '@/types/activity';

const STORAGE_KEY = 'inex-it-support:activity';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeActivity(raw: unknown): raw is ActivityRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as ActivityRecord).id === 'string');
}

function readStoredActivity() {
  return readLocalStore<ActivityRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockActivity,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeActivity,
  });
}

function writeStoredActivity(records: ActivityRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextActivityId(existing: ActivityRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 7000), 7000);
  return `ACT-${highest + 1}`;
}

export function getActivity() {
  return readStoredActivity().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function addActivity(input: Omit<ActivityRecord, 'id'>) {
  const existing = readStoredActivity();
  const record: ActivityRecord = {
    id: nextActivityId(existing),
    ...input,
  };
  const next = [record, ...existing];
  writeStoredActivity(next);
  return record;
}

export function seedDemoData() {
  writeStoredActivity(mockActivity);
}

export function clearData() {
  writeStoredActivity([]);
}
