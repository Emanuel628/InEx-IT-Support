import { addActivity } from '@/features/activity/lib/activityStore';
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

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getBusinesses() {
  return readStoredBusinesses().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getBusinessById(businessId: string) {
  return getBusinesses().find((record) => record.id === businessId) || null;
}

export function createBusiness(input: CreateBusinessSupportInput) {
  const existing = readStoredBusinesses();
  const timestamp = nowIsoLike();
  const record: BusinessSupportRecord = { id: nextBusinessId(existing), updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredBusinesses(next);

  addActivity({
    entityType: 'business',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Business support record ${record.id} was created for ${record.businessName}.`,
    timestamp,
    metadata: {
      plan: record.plan,
      subscriptionStatus: record.subscriptionStatus,
      businessLimit: record.businessLimit,
    },
  });

  return record;
}

export function updateBusiness(businessId: string, updates: Partial<BusinessSupportRecord>) {
  const timestamp = nowIsoLike();
  const previous = getBusinessById(businessId);
  const next = readStoredBusinesses().map((record) => record.id === businessId ? { ...record, ...updates, updatedAt: timestamp } : record);
  writeStoredBusinesses(next);
  const updated = next.find((record) => record.id === businessId) || null;

  if (updated) {
    const action = previous && previous.notes !== updated.notes ? 'note_updated' : 'updated';
    const summary = action === 'note_updated'
      ? `Support notes were updated for business ${updated.id}.`
      : `Business ${updated.id} was updated.`;

    addActivity({
      entityType: 'business',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        subscriptionStatus: updated.subscriptionStatus,
        additionalBusinessSlots: updated.additionalBusinessSlots,
        linkedIncidentIds: updated.linkedIncidentIds.length,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredBusinesses(mockBusinesses);
}

export function clearData() {
  writeStoredBusinesses([]);
}
