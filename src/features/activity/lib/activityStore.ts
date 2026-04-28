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

export function getActivity() {
  return readStoredActivity().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

export function seedDemoData() {
  writeStoredActivity(mockActivity);
}

export function clearData() {
  writeStoredActivity([]);
}
