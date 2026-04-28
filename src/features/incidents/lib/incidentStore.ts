import { mockIncidents } from '@/features/incidents/data/mockIncidents';
import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { CreateIncidentInput, IncidentRecord } from '@/types/incidents';

const STORAGE_KEY = 'inex-it-support:incidents';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

function normalizeIncidents(raw: unknown): raw is IncidentRecord[] {
  return Array.isArray(raw) && raw.every((item) => Boolean(item) && typeof item === 'object' && typeof (item as IncidentRecord).id === 'string');
}

function readStoredIncidents() {
  return readLocalStore<IncidentRecord[]>({
    storageKey: STORAGE_KEY,
    fallbackValue: mockIncidents,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeIncidents,
  });
}

function writeStoredIncidents(records: IncidentRecord[]) {
  writeLocalStore(STORAGE_KEY, records);
}

function nextIncidentId(existing: IncidentRecord[]) {
  const highest = existing.reduce((max, record) => Math.max(max, Number(record.id.replace(/[^0-9]/g, '')) || 2000), 2000);
  return `INCIDENT-${highest + 1}`;
}

export function getIncidents() {
  return readStoredIncidents().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getIncidentById(incidentId: string) {
  return getIncidents().find((record) => record.id === incidentId) || null;
}

export function createIncident(input: CreateIncidentInput) {
  const existing = readStoredIncidents();
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const record: IncidentRecord = { id: nextIncidentId(existing), createdAt: timestamp, updatedAt: timestamp, timeline: [], ...input };
  const next = [record, ...existing];
  writeStoredIncidents(next);
  return record;
}

export function updateIncident(incidentId: string, updates: Partial<IncidentRecord>) {
  const next = readStoredIncidents().map((record) => record.id === incidentId ? { ...record, ...updates, updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : record);
  writeStoredIncidents(next);
  return next.find((record) => record.id === incidentId) || null;
}

export function seedDemoData() {
  writeStoredIncidents(mockIncidents);
}

export function clearData() {
  writeStoredIncidents([]);
}
