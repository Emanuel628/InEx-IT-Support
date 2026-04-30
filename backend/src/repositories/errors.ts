import { getDbPool } from '../db/client.js';

export type ErrorRecord = {
  id: string;
  title: string;
  message: string;
  status: 'new' | 'triaged' | 'linked_to_ticket' | 'investigating' | 'fixed' | 'ignored' | 'recurring';
  severity: 'minor' | 'major' | 'critical';
  source: string;
  app_area: string;
  environment: string;
  occurrence_count: number;
  first_seen_at: string;
  last_seen_at: string;
  notes: string;
  created_by_account_id: string;
  created_at: string;
  updated_at: string;
};

const errorSelect = `select id, title, message, status, severity, source, app_area, environment, occurrence_count, first_seen_at, last_seen_at, notes, created_by_account_id, created_at, updated_at
from errors`;

export async function listErrors() {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<ErrorRecord>(`${errorSelect} order by created_at desc`);
  return result.rows;
}

export async function getErrorById(errorId: string) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<ErrorRecord>(`${errorSelect} where id = $1 limit 1`, [errorId]);
  return result.rows[0] ?? null;
}

export async function createErrorRecord(input: {
  title: string;
  message: string;
  status: ErrorRecord['status'];
  severity: ErrorRecord['severity'];
  source: string;
  appArea: string;
  environment: string;
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  notes: string;
  createdByAccountId: string;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<ErrorRecord>(
    `insert into errors (
      title,
      message,
      status,
      severity,
      source,
      app_area,
      environment,
      occurrence_count,
      first_seen_at,
      last_seen_at,
      notes,
      created_by_account_id
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    returning id, title, message, status, severity, source, app_area, environment, occurrence_count, first_seen_at, last_seen_at, notes, created_by_account_id, created_at, updated_at`,
    [
      input.title,
      input.message,
      input.status,
      input.severity,
      input.source,
      input.appArea,
      input.environment,
      input.occurrenceCount,
      input.firstSeenAt,
      input.lastSeenAt,
      input.notes,
      input.createdByAccountId,
    ],
  );

  return result.rows[0];
}

export async function updateErrorRecord(input: {
  errorId: string;
  title: string;
  message: string;
  status: ErrorRecord['status'];
  severity: ErrorRecord['severity'];
  source: string;
  appArea: string;
  environment: string;
  occurrenceCount: number;
  firstSeenAt: string;
  lastSeenAt: string;
  notes: string;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<ErrorRecord>(
    `update errors
     set title = $2,
         message = $3,
         status = $4,
         severity = $5,
         source = $6,
         app_area = $7,
         environment = $8,
         occurrence_count = $9,
         first_seen_at = $10,
         last_seen_at = $11,
         notes = $12,
         updated_at = now()
     where id = $1
     returning id, title, message, status, severity, source, app_area, environment, occurrence_count, first_seen_at, last_seen_at, notes, created_by_account_id, created_at, updated_at`,
    [
      input.errorId,
      input.title,
      input.message,
      input.status,
      input.severity,
      input.source,
      input.appArea,
      input.environment,
      input.occurrenceCount,
      input.firstSeenAt,
      input.lastSeenAt,
      input.notes,
    ],
  );

  return result.rows[0] ?? null;
}
