import { mockUsers } from '@/features/users/data/mockUsers';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { SupportUserRecord } from '@/types/users';

const STORAGE_KEY = 'inex-it-support:users';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeUsers(raw: unknown): raw is SupportUserRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as SupportUserRecord).id === 'string');
}

function readStoredUsers() {
  return readLocalStore<SupportUserRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockUsers,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeUsers,
  });
}

export function getUsers() {
  return readStoredUsers().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getUserById(userId: string) {
  return getUsers().find((record) => record.id === userId) || null;
}

export function seedDemoData() {
  writeLocalStore(STORAGE_KEY, mockUsers);
}

export function clearData() {
  writeLocalStore(STORAGE_KEY, []);
}
