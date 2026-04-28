import { mockBusinesses } from '@/features/businesses/data/mockBusinesses';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { BusinessSupportRecord, CreateBusinessSupportInput } from '@/types/businesses';

const STORAGE_KEY = 'inex-it-support:businesses';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeBusinesses(raw: unknown): raw is BusinessSupportRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as BusinessSupportRecord).id === 'string');
}

function readStoredBusinesses() {
  return readLocalStore<BusinessSupportRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockBusinesses,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeBusinesses,
  });
}

function writeStoredBusinesses(records: BusinessSupportRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextBusinessId(existing: BusinessSupportRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 2000), 2000);
  return `BIZ-${highest + 1}`;
}

export function getBusinesses() {
  return readStoredBusinesses().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getBusinessById(businessId: string) {
  return getBusinesses().find((record) => record.id === businessId) || null;
}

export function createBusiness(input: CreateBusinessSupportInput) {
  const existing = readStoredBusinesses();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: BusinessSupportRecord = { id: nextBusinessId(existing), updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredBusinesses(next);
  return record;
}

export function updateBusiness(businessId: string, updates: Partial<BusinessSupportRecord>) {
  const next = readStoredBusinesses().map((record) => record.id === businessId ? { ...record, ...updates, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : record);
  writeStoredBusinesses(next);
  return next.find((record) => record.id === businessId) || null;
}

export function seedDemoData() {
  writeStoredBusinesses(mockBusinesses);
}

export function clearData() {
  writeStoredBusinesses([]);
}
