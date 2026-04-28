import { mockReleases } from '@/features/releases/data/mockReleases';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { CreateReleaseInput, ReleaseRecord } from '@/types/releases';

const STORAGE_KEY = 'inex-it-support:releases';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeReleases(raw: unknown): raw is ReleaseRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as ReleaseRecord).id === 'string');
}

function readStoredReleases() {
  return readLocalStore<ReleaseRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockReleases,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeReleases,
  });
}

function writeStoredReleases(records: ReleaseRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextReleaseId(existing: ReleaseRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 3000), 3000);
  return `REL-${highest + 1}`;
}

export function getReleases() {
  return readStoredReleases().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getReleaseById(releaseId: string) {
  return getReleases().find((record) => record.id === releaseId) || null;
}

export function createRelease(input: CreateReleaseInput) {
  const existing = readStoredReleases();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: ReleaseRecord = { id: nextReleaseId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredReleases(next);
  return record;
}

export function updateRelease(releaseId: string, updates: Partial<ReleaseRecord>) {
  const next = readStoredReleases().map((record) => record.id === releaseId ? { ...record, ...updates, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : record);
  writeStoredReleases(next);
  return next.find((record) => record.id === releaseId) || null;
}

export function seedDemoData() {
  writeStoredReleases(mockReleases);
}

export function clearData() {
  writeStoredReleases([]);
}
