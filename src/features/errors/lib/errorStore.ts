import { addActivity } from '@/features/activity/lib/activityStore';
import { mockErrors } from '@/features/errors/data/mockErrors';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { CreateErrorLogInput, ErrorLogRecord } from '@/types/errors';

const STORAGE_KEY = 'inex-it-support:errors';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeErrors(raw: unknown): raw is ErrorLogRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as ErrorLogRecord).id === 'string');
}

function readStoredErrors() {
  return readLocalStore<ErrorLogRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockErrors,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeErrors,
  });
}

function writeStoredErrors(records: ErrorLogRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextErrorId(existing: ErrorLogRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 5000), 5000);
  return `ERR-${highest + 1}`;
}

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getErrors() {
  return readStoredErrors().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getErrorById(errorId: string) {
  return getErrors().find((record) => record.id === errorId) || null;
}

export function createError(input: CreateErrorLogInput) {
  const existing = readStoredErrors();
  const timestamp = nowIsoLike();
  const record: ErrorLogRecord = { id: nextErrorId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredErrors(next);

  addActivity({
    entityType: 'error',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Error ${record.id} was logged for ${record.appArea} in ${record.environment}.`,
    timestamp,
    metadata: {
      severity: record.severity,
      status: record.status,
      source: record.source,
    },
  });

  return record;
}

export function updateError(errorId: string, updates: Partial<ErrorLogRecord>) {
  const existing = readStoredErrors();
  const previous = existing.find((record) => record.id === errorId) || null;
  const timestamp = nowIsoLike();
  const next = existing.map((record) => record.id === errorId ? { ...record, ...updates, updatedAt: timestamp } : record);
  writeStoredErrors(next);
  const updated = next.find((record) => record.id === errorId) || null;

  if (updated) {
    const action = previous && previous.status !== updated.status ? 'status_changed' : 'updated';
    const summary = previous && previous.status !== updated.status
      ? `Error ${updated.id} status changed from ${previous.status} to ${updated.status}.`
      : `Error ${updated.id} was updated.`;

    addActivity({
      entityType: 'error',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        severity: updated.severity,
        status: updated.status,
        source: updated.source,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredErrors(mockErrors);
}

export function clearData() {
  writeStoredErrors([]);
}
