import { addActivity } from '@/features/activity/lib/activityStore';
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

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getResolutions() {
  return readStoredResolutions().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getResolutionById(resolutionId: string) {
  return getResolutions().find((record) => record.id === resolutionId) || null;
}

export function createResolution(input: CreateResolutionInput) {
  const existing = readStoredResolutions();
  const timestamp = nowIsoLike();
  const record: ResolutionRecord = { id: nextResolutionId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredResolutions(next);

  addActivity({
    entityType: 'resolution',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Resolution ${record.id} was created for ${record.title}.`,
    timestamp,
    metadata: {
      relatedTicketIds: record.relatedTicketIds.length,
      relatedErrorIds: record.relatedErrorIds.length,
      relatedKnowledgeArticleIds: record.relatedKnowledgeArticleIds.length,
    },
  });

  return record;
}

export function updateResolution(resolutionId: string, updates: Partial<ResolutionRecord>) {
  const timestamp = nowIsoLike();
  const previous = getResolutionById(resolutionId);
  const next = readStoredResolutions().map((record) => record.id === resolutionId ? { ...record, ...updates, updatedAt: timestamp } : record);
  writeStoredResolutions(next);
  const updated = next.find((record) => record.id === resolutionId) || null;

  if (updated) {
    const action = previous && previous.rollbackNotes !== updated.rollbackNotes ? 'note_updated' : 'updated';
    const summary = action === 'note_updated'
      ? `Rollback or verification notes were updated for resolution ${updated.id}.`
      : `Resolution ${updated.id} was updated.`;

    addActivity({
      entityType: 'resolution',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        relatedIncidentId: updated.relatedIncidentId || '',
        relatedReleaseId: updated.relatedReleaseId || '',
        relatedKnowledgeArticleIds: updated.relatedKnowledgeArticleIds.length,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredResolutions(mockResolutions);
}

export function clearData() {
  writeStoredResolutions([]);
}
