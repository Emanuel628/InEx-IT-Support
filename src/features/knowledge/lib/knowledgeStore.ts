import { addActivity } from '@/features/activity/lib/activityStore';
import { mockKnowledgeArticles } from '@/features/knowledge/data/mockKnowledgeArticles';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { CreateKnowledgeArticleInput, KnowledgeArticleRecord } from '@/types/knowledge';

const STORAGE_KEY = 'inex-it-support:knowledge-articles';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeKnowledge(raw: unknown): raw is KnowledgeArticleRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as KnowledgeArticleRecord).id === 'string');
}

function readStoredKnowledge() {
  return readLocalStore<KnowledgeArticleRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockKnowledgeArticles,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeKnowledge,
  });
}

function writeStoredKnowledge(records: KnowledgeArticleRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextArticleId(existing: KnowledgeArticleRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 6000), 6000);
  return `KB-${highest + 1}`;
}

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getKnowledgeArticles() {
  return readStoredKnowledge().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getKnowledgeArticleById(articleId: string) {
  return getKnowledgeArticles().find((record) => record.id === articleId) || null;
}

export function createKnowledgeArticle(input: CreateKnowledgeArticleInput) {
  const existing = readStoredKnowledge();
  const timestamp = nowIsoLike();
  const record: KnowledgeArticleRecord = { id: nextArticleId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredKnowledge(next);

  addActivity({
    entityType: 'knowledge_article',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Knowledge article ${record.id} was created for ${record.appArea}.`,
    timestamp,
    metadata: {
      articleType: record.articleType,
      category: record.category,
      appArea: record.appArea,
    },
  });

  return record;
}

export function updateKnowledgeArticle(articleId: string, updates: Partial<KnowledgeArticleRecord>) {
  const timestamp = nowIsoLike();
  const previous = getKnowledgeArticleById(articleId);
  const next = readStoredKnowledge().map((record) => record.id === articleId ? { ...record, ...updates, updatedAt: timestamp } : record);
  writeStoredKnowledge(next);
  const updated = next.find((record) => record.id === articleId) || null;

  if (updated) {
    const action = previous && previous.internalNotes !== updated.internalNotes ? 'note_updated' : 'updated';
    const summary = action === 'note_updated'
      ? `Internal notes were updated for knowledge article ${updated.id}.`
      : `Knowledge article ${updated.id} was updated.`;

    addActivity({
      entityType: 'knowledge_article',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        articleType: updated.articleType,
        category: updated.category,
        relatedResolutionIds: updated.relatedResolutionIds.length,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredKnowledge(mockKnowledgeArticles);
}

export function clearData() {
  writeStoredKnowledge([]);
}
