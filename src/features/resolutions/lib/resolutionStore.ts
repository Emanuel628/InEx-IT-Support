import { mockResolutions } from '@/features/resolutions/data/mockResolutions';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { CreateResolutionInput, ResolutionRecord } from '@/types/resolutions';

const STORAGE_KEY = 'inex-it-support:resolutions';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeResolutions(raw: unknown): raw is ResolutionRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as ResolutionRecord).id === 'string');
}

function readStoredResolutions() {
  return readLocalStore<ResolutionRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockResolutions,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeResolutions,
  });
}

function writeStoredResolutions(records: ResolutionRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextResolutionId(existing: ResolutionRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 4000), 4000);
  return `RES-${highest + 1}`;
}

export function getResolutions() {
  return readStoredResolutions().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getResolutionById(resolutionId: string) {
  return getResolutions().find((record) => record.id === resolutionId) || null;
}

export function createResolution(input: CreateResolutionInput) {
  const existing = readStoredResolutions();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: ResolutionRecord = { id: nextResolutionId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredResolutions(next);
  return record;
}

export function updateResolution(resolutionId: string, updates: Partial<ResolutionRecord>) {
  const next = readStoredResolutions().map((record) => record.id === resolutionId ? { ...record, ...updates, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : record);
  writeStoredResolutions(next);
  return next.find((record) => record.id === resolutionId) || null;
}

export function seedDemoData() {
  writeStoredResolutions(mockResolutions);
}

export function clearData() {
  writeStoredResolutions([]);
}
