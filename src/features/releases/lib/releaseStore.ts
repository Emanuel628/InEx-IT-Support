import { addActivity } from '@/features/activity/lib/activityStore';
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

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getReleases() {
  return readStoredReleases().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getReleaseById(releaseId: string) {
  return getReleases().find((record) => record.id === releaseId) || null;
}

export function createRelease(input: CreateReleaseInput) {
  const existing = readStoredReleases();
  const timestamp = nowIsoLike();
  const record: ReleaseRecord = { id: nextReleaseId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredReleases(next);

  addActivity({
    entityType: 'release',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Release ${record.id} was recorded for ${record.environment}.`,
    timestamp,
    metadata: {
      version: record.version,
      commitSha: record.commitSha,
      migrationsIncluded: record.migrationsIncluded,
    },
  });

  return record;
}

export function updateRelease(releaseId: string, updates: Partial<ReleaseRecord>) {
  const timestamp = nowIsoLike();
  const previous = getReleaseById(releaseId);
  const next = readStoredReleases().map((record) => record.id === releaseId ? { ...record, ...updates, updatedAt: timestamp } : record);
  writeStoredReleases(next);
  const updated = next.find((record) => record.id === releaseId) || null;

  if (updated) {
    const action = previous && previous.rollbackNotes !== updated.rollbackNotes ? 'note_updated' : 'updated';
    const summary = action === 'note_updated'
      ? `Rollback notes were updated for release ${updated.id}.`
      : `Release ${updated.id} was updated.`;

    addActivity({
      entityType: 'release',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        version: updated.version,
        environment: updated.environment,
        relatedIncidentIds: updated.relatedIncidentIds.length,
        relatedResolutionIds: updated.relatedResolutionIds.length,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredReleases(mockReleases);
}

export function clearData() {
  writeStoredReleases([]);
}
