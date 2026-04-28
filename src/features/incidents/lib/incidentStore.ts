import { addActivity } from '@/features/activity/lib/activityStore';
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

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

export function getIncidents() {
  return readStoredIncidents().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getIncidentById(incidentId: string) {
  return getIncidents().find((record) => record.id === incidentId) || null;
}

export function createIncident(input: CreateIncidentInput) {
  const existing = readStoredIncidents();
  const timestamp = nowIsoLike();
  const record: IncidentRecord = {
    id: nextIncidentId(existing),
    createdAt: timestamp,
    updatedAt: timestamp,
    timeline: [
      {
        id: `timeline-${timestamp}`,
        timestamp,
        actor: 'System',
        summary: `Incident created with status ${input.status.replace(/_/g, ' ')}.`,
      },
    ],
    ...input,
  };
  const next = [record, ...existing];
  writeStoredIncidents(next);

  addActivity({
    entityType: 'incident',
    entityId: record.id,
    action: 'created',
    actor: 'System',
    summary: `Incident ${record.id} was created for ${record.environment}.`,
    timestamp,
    metadata: {
      status: record.status,
      severity: record.severity,
      environment: record.environment,
    },
  });

  return record;
}

export function updateIncident(incidentId: string, updates: Partial<IncidentRecord>) {
  const previous = getIncidentById(incidentId);
  const timestamp = nowIsoLike();
  const next = readStoredIncidents().map((record) => {
    if (record.id !== incidentId) {
      return record;
    }

    const timeline = updates.timeline ?? (
      previous && previous.status !== (updates.status ?? previous.status)
        ? [
            {
              id: `${record.id}-timeline-${Date.now()}`,
              timestamp,
              actor: 'System',
              summary: `Incident status changed from ${previous.status.replace(/_/g, ' ')} to ${(updates.status ?? previous.status).replace(/_/g, ' ')}.`,
            },
            ...record.timeline,
          ]
        : record.timeline
    );

    return {
      ...record,
      ...updates,
      timeline,
      updatedAt: timestamp,
    };
  });
  writeStoredIncidents(next);
  const updated = next.find((record) => record.id === incidentId) || null;

  if (updated) {
    const action = previous && previous.status !== updated.status ? 'status_changed' : 'updated';
    const summary = previous && previous.status !== updated.status
      ? `Incident ${updated.id} status changed to ${updated.status.replace(/_/g, ' ')}.`
      : `Incident ${updated.id} was updated.`;

    addActivity({
      entityType: 'incident',
      entityId: updated.id,
      action,
      actor: 'System',
      summary,
      timestamp,
      metadata: {
        status: updated.status,
        severity: updated.severity,
        environment: updated.environment,
      },
    });
  }

  return updated;
}

export function seedDemoData() {
  writeStoredIncidents(mockIncidents);
}

export function clearData() {
  writeStoredIncidents([]);
}
