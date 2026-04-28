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

export function getKnowledgeArticles() {
  return readStoredKnowledge().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getKnowledgeArticleById(articleId: string) {
  return getKnowledgeArticles().find((record) => record.id === articleId) || null;
}

export function createKnowledgeArticle(input: CreateKnowledgeArticleInput) {
  const existing = readStoredKnowledge();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: KnowledgeArticleRecord = { id: nextArticleId(existing), createdAt: timestamp, updatedAt: timestamp, ...input };
  const next = [record, ...existing];
  writeStoredKnowledge(next);
  return record;
}

export function updateKnowledgeArticle(articleId: string, updates: Partial<KnowledgeArticleRecord>) {
  const next = readStoredKnowledge().map((record) => record.id === articleId ? { ...record, ...updates, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : record);
  writeStoredKnowledge(next);
  return next.find((record) => record.id === articleId) || null;
}

export function seedDemoData() {
  writeStoredKnowledge(mockKnowledgeArticles);
}

export function clearData() {
  writeStoredKnowledge([]);
}
