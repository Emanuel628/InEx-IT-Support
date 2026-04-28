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

export function getErrors() {
  return readStoredErrors().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getErrorById(errorId: string) {
  return getErrors().find((record) => record.id === errorId) || null;
}

export function createError(input: CreateErrorLogInput) {
  const existing = readStoredErrors();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: ErrorLogRecord = { id: nextErrorId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredErrors(next);
  return record;
}

export function updateError(errorId: string, updates: Partial<ErrorLogRecord>) {
  const next = readStoredErrors().map((record) => record.id === errorId ? { ...record, ...updates, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : record);
  writeStoredErrors(next);
  return next.find((record) => record.id === errorId) || null;
}

export function seedDemoData() {
  writeStoredErrors(mockErrors);
}

export function clearData() {
  writeStoredErrors([]);
}
