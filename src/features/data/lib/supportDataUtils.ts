import { addActivity } from '@/features/activity/lib/activityStore';
import { getActivity, seedDemoData as seedActivityData } from '@/features/activity/lib/activityStore';
import { getBackups, seedDemoData as seedBackupData } from '@/features/backups/lib/backupStore';
import { getBusinesses, seedDemoData as seedBusinessData } from '@/features/businesses/lib/businessStore';
import { getErrors, seedDemoData as seedErrorData } from '@/features/errors/lib/errorStore';
import { getIncidents, seedDemoData as seedIncidentData } from '@/features/incidents/lib/incidentStore';
import { getKnowledgeArticles, seedDemoData as seedKnowledgeData } from '@/features/knowledge/lib/knowledgeStore';
import { getReleases, seedDemoData as seedReleaseData } from '@/features/releases/lib/releaseStore';
import { getResolutions, seedDemoData as seedResolutionData } from '@/features/resolutions/lib/resolutionStore';
import { getSettings, resetSettings } from '@/features/settings/lib/settingsStore';
import { getTickets, seedDemoData as seedTicketData } from '@/features/tickets/lib/ticketStore';
import { getUsers, seedDemoData as seedUserData } from '@/features/users/lib/userStore';
import { writeLocalStore } from '@/lib/localStorageStore';

export const SUPPORT_SCHEMA_VERSION = '1';

export const SUPPORT_DATA_KEYS = {
  schemaVersion: 'inex-it-support:schema-version',
  tickets: 'inex-it-support:tickets',
  errors: 'inex-it-support:errors',
  incidents: 'inex-it-support:incidents',
  users: 'inex-it-support:users',
  businesses: 'inex-it-support:businesses',
  knowledgeArticles: 'inex-it-support:knowledge-articles',
  resolutions: 'inex-it-support:resolutions',
  releases: 'inex-it-support:releases',
  activity: 'inex-it-support:activity',
  backups: 'inex-it-support:backups',
  settings: 'inex-it-support:settings',
} as const;

export type SupportDataSnapshot = {
  schemaVersion: string;
  exportedAt: string;
  tickets: ReturnType<typeof getTickets>;
  errors: ReturnType<typeof getErrors>;
  incidents: ReturnType<typeof getIncidents>;
  users: ReturnType<typeof getUsers>;
  businesses: ReturnType<typeof getBusinesses>;
  knowledgeArticles: ReturnType<typeof getKnowledgeArticles>;
  resolutions: ReturnType<typeof getResolutions>;
  releases: ReturnType<typeof getReleases>;
  activity: ReturnType<typeof getActivity>;
  backups: ReturnType<typeof getBackups>;
  settings: ReturnType<typeof getSettings>;
};

function nowIsoLike() {
  return new Date().toISOString().slice(0, 16).replace('T', ' ');
}

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function buildSupportDataSnapshot(): SupportDataSnapshot {
  return {
    schemaVersion: SUPPORT_SCHEMA_VERSION,
    exportedAt: nowIsoLike(),
    tickets: getTickets(),
    errors: getErrors(),
    incidents: getIncidents(),
    users: getUsers(),
    businesses: getBusinesses(),
    knowledgeArticles: getKnowledgeArticles(),
    resolutions: getResolutions(),
    releases: getReleases(),
    activity: getActivity(),
    backups: getBackups(),
    settings: getSettings(),
  };
}

export function getSupportItemCounts(snapshot: SupportDataSnapshot = buildSupportDataSnapshot()) {
  return {
    tickets: snapshot.tickets.length,
    errors: snapshot.errors.length,
    incidents: snapshot.incidents.length,
    users: snapshot.users.length,
    businesses: snapshot.businesses.length,
    knowledgeArticles: snapshot.knowledgeArticles.length,
    resolutions: snapshot.resolutions.length,
    releases: snapshot.releases.length,
    activity: snapshot.activity.length,
    backups: snapshot.backups.length,
    settings: 1,
  };
}

export function exportSupportDataJson() {
  const snapshot = buildSupportDataSnapshot();
  addActivity({
    entityType: 'data',
    entityId: 'export',
    action: 'exported',
    actor: 'System',
    summary: 'Support data was exported to JSON.',
    timestamp: snapshot.exportedAt,
    metadata: getSupportItemCounts(snapshot),
  });
  return JSON.stringify(snapshot, null, 2);
}

export function isSupportDataSnapshot(raw: unknown): raw is SupportDataSnapshot {
  if (!raw || typeof raw !== 'object') {
    return false;
  }
  const value = raw as Record<string, unknown>;
  return typeof value.schemaVersion === 'string'
    && Array.isArray(value.tickets)
    && Array.isArray(value.errors)
    && Array.isArray(value.incidents)
    && Array.isArray(value.users)
    && Array.isArray(value.businesses)
    && Array.isArray(value.knowledgeArticles)
    && Array.isArray(value.resolutions)
    && Array.isArray(value.releases)
    && Array.isArray(value.activity)
    && Array.isArray(value.backups)
    && !!value.settings;
}

export function importSupportDataJson(jsonText: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false as const, error: 'Invalid JSON format.' };
  }

  if (!isSupportDataSnapshot(parsed)) {
    return { ok: false as const, error: 'Import shape is not valid for InEx IT Support.' };
  }

  applySupportDataSnapshot(parsed);
  addActivity({
    entityType: 'data',
    entityId: 'import',
    action: 'imported',
    actor: 'System',
    summary: 'Support data was imported from JSON.',
    timestamp: nowIsoLike(),
    metadata: getSupportItemCounts(parsed),
  });

  return { ok: true as const, snapshot: parsed };
}

export function applySupportDataSnapshot(snapshot: SupportDataSnapshot) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(SUPPORT_DATA_KEYS.schemaVersion, snapshot.schemaVersion);
  writeLocalStore(SUPPORT_DATA_KEYS.tickets, snapshot.tickets);
  writeLocalStore(SUPPORT_DATA_KEYS.errors, snapshot.errors);
  writeLocalStore(SUPPORT_DATA_KEYS.incidents, snapshot.incidents);
  writeLocalStore(SUPPORT_DATA_KEYS.users, snapshot.users);
  writeLocalStore(SUPPORT_DATA_KEYS.businesses, snapshot.businesses);
  writeLocalStore(SUPPORT_DATA_KEYS.knowledgeArticles, snapshot.knowledgeArticles);
  writeLocalStore(SUPPORT_DATA_KEYS.resolutions, snapshot.resolutions);
  writeLocalStore(SUPPORT_DATA_KEYS.releases, snapshot.releases);
  writeLocalStore(SUPPORT_DATA_KEYS.activity, snapshot.activity);
  writeLocalStore(SUPPORT_DATA_KEYS.backups, snapshot.backups);
  writeLocalStore(SUPPORT_DATA_KEYS.settings, snapshot.settings);
}

export function resetSupportDataToDemo() {
  seedTicketData();
  seedErrorData();
  seedIncidentData();
  seedUserData();
  seedBusinessData();
  seedKnowledgeData();
  seedResolutionData();
  seedReleaseData();
  seedActivityData();
  seedBackupData();
  resetSettings();
  addActivity({
    entityType: 'data',
    entityId: 'reset-demo',
    action: 'reset',
    actor: 'System',
    summary: 'Support data was reset to demo defaults.',
    timestamp: nowIsoLike(),
    metadata: getSupportItemCounts(),
  });
}

export function clearSupportData() {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(SUPPORT_DATA_KEYS.schemaVersion, SUPPORT_SCHEMA_VERSION);
  writeLocalStore(SUPPORT_DATA_KEYS.tickets, []);
  writeLocalStore(SUPPORT_DATA_KEYS.errors, []);
  writeLocalStore(SUPPORT_DATA_KEYS.incidents, []);
  writeLocalStore(SUPPORT_DATA_KEYS.users, []);
  writeLocalStore(SUPPORT_DATA_KEYS.businesses, []);
  writeLocalStore(SUPPORT_DATA_KEYS.knowledgeArticles, []);
  writeLocalStore(SUPPORT_DATA_KEYS.resolutions, []);
  writeLocalStore(SUPPORT_DATA_KEYS.releases, []);
  writeLocalStore(SUPPORT_DATA_KEYS.activity, []);
  writeLocalStore(SUPPORT_DATA_KEYS.backups, []);
  resetSettings();
  addActivity({
    entityType: 'data',
    entityId: 'clear-local',
    action: 'cleared',
    actor: 'System',
    summary: 'Local support data was cleared.',
    timestamp: nowIsoLike(),
    metadata: {
      tickets: 0,
      errors: 0,
      incidents: 0,
      users: 0,
      businesses: 0,
      knowledgeArticles: 0,
      resolutions: 0,
      releases: 0,
      backups: 0,
    },
  });
}
