import { readLocalStore, writeLocalStore } from '@/lib/localStorageStore';
import type { SettingsRecord } from '@/types/settings';

const STORAGE_KEY = 'inex-it-support:settings';
const SCHEMA_VERSION_KEY = 'inex-it-support:schema-version';
const SCHEMA_VERSION_VALUE = '1';

const defaultSettings: SettingsRecord = {
  defaultAssignee: 'Unassigned',
  technicians: ['Evelyn', 'Marcus', 'Priya'],
  categories: ['bug', 'billing', 'exports', 'receipts', 'authentication', 'data_integrity', 'ui_ux', 'feature_request', 'infrastructure', 'account_access', 'business_context', 'deployment'],
  appAreas: ['auth', 'transactions', 'accounts', 'categories', 'receipts', 'exports', 'billing', 'settings', 'dashboard', 'onboarding', 'email', 'database', 'api', 'frontend', 'deployment', 'unknown'],
  environments: ['production', 'staging', 'local', 'development'],
  sources: ['manual', 'email', 'contact_form', 'error_log', 'incident'],
  statuses: ['new', 'in_progress', 'waiting_on_user', 'escalated', 'resolved', 'archived'],
  priorities: ['low', 'medium', 'high', 'critical'],
  localPreferences: {
    compactTables: false,
    showResolvedByDefault: false,
    dateFormat: 'YYYY-MM-DD HH:mm',
  },
  updatedAt: '2026-04-11 08:00',
};

function normalizeSettings(raw: unknown): raw is SettingsRecord {
  return Boolean(raw) && typeof raw === 'object' && typeof (raw as SettingsRecord).defaultAssignee === 'string';
}

function readStoredSettings() {
  return readLocalStore<SettingsRecord>({
    storageKey: STORAGE_KEY,
    fallbackValue: defaultSettings,
    schemaVersionKey: SCHEMA_VERSION_KEY,
    schemaVersionValue: SCHEMA_VERSION_VALUE,
    validate: normalizeSettings,
  });
}

function writeStoredSettings(record: SettingsRecord) {
  writeLocalStore(STORAGE_KEY, record);
}

export function getSettings() {
  return readStoredSettings();
}

export function updateSettings(updates: Partial<SettingsRecord>) {
  const existing = readStoredSettings();
  const next: SettingsRecord = {
    ...existing,
    ...updates,
    localPreferences: {
      ...existing.localPreferences,
      ...(updates.localPreferences || {}),
    },
    updatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };
  writeStoredSettings(next);
  return next;
}

export function resetSettings() {
  writeStoredSettings(defaultSettings);
}
