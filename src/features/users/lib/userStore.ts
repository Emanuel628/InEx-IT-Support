import { addActivity } from '@/features/activity/lib/activityStore';
import { mockUsers } from '@/features/users/data/mockUsers';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { CreateSupportUserInput, SupportUserRecord } from '@/types/users';

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

function writeStoredUsers(records: SupportUserRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextUserId(existing: SupportUserRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 1000), 1000);
  return `USR-${highest + 1}`;
}

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getUsers() {
  return readStoredUsers().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getUserById(userId: string) {
  return getUsers().find((record) => record.id === userId) || null;
}

export function createUser(input: CreateSupportUserInput) {
  const existing = readStoredUsers();
  const timestamp = nowIsoLike();
  const record: SupportUserRecord = {
    id: nextUserId(existing),
    updatedAt: timestamp,
    ...input,
  };
  const next = [record, ...existing];
  writeStoredUsers(next);

  addActivity({
    entityType: 'user',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Support user ${record.id} was created for ${record.email}.`,
    timestamp,
    metadata: {
      plan: record.plan,
      subscriptionStatus: record.subscriptionStatus,
      region: record.region,
    },
  });

  return record;
}

export function updateUser(userId: string, updates: Partial<SupportUserRecord>) {
  const timestamp = nowIsoLike();
  const previous = getUserById(userId);
  const next = readStoredUsers().map((record) => (
    record.id === userId ? { ...record, ...updates, updatedAt: timestamp } : record
  ));
  writeStoredUsers(next);
  const updated = next.find((record) => record.id === userId) || null;

  if (updated) {
    const action = previous && previous.notes !== updated.notes ? 'note_updated' : 'updated';
    const summary = action === 'note_updated'
      ? `Support notes were updated for user ${updated.id}.`
      : `User ${updated.id} was updated.`;

    addActivity({
      entityType: 'user',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        plan: updated.plan,
        subscriptionStatus: updated.subscriptionStatus,
        relatedBusinessIds: updated.relatedBusinessIds.length,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredUsers(mockUsers);
}

export function clearData() {
  writeStoredUsers([]);
}
