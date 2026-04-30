import { getDbPool } from '../db/client.js';

export type IncidentRecord = {
  id: string;
  title: string;
  customer_impact: string;
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'postmortem_needed';
  severity: 'minor' | 'major' | 'critical';
  environment: string;
  affected_areas: string[];
  started_at: string;
  resolved_at: string | null;
  summary: string;
  created_by_account_id: string;
  created_at: string;
  updated_at: string;
};

const incidentSelect = `select id, title, customer_impact, status, severity, environment, affected_areas, started_at, resolved_at, summary, created_by_account_id, created_at, updated_at
from incidents`;

export async function listIncidents() {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<IncidentRecord>(`${incidentSelect} order by created_at desc`);
  return result.rows;
}

export async function getIncidentById(incidentId: string) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<IncidentRecord>(`${incidentSelect} where id = $1 limit 1`, [incidentId]);
  return result.rows[0] ?? null;
}

export async function createIncident(input: {
  title: string;
  customerImpact: string;
  status: IncidentRecord['status'];
  severity: IncidentRecord['severity'];
  environment: string;
  affectedAreas: string[];
  startedAt: string;
  resolvedAt?: string | null;
  summary: string;
  createdByAccountId: string;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<IncidentRecord>(
    `insert into incidents (
      title,
      customer_impact,
      status,
      severity,
      environment,
      affected_areas,
      started_at,
      resolved_at,
      summary,
      created_by_account_id
    ) values ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10)
    returning id, title, customer_impact, status, severity, environment, affected_areas, started_at, resolved_at, summary, created_by_account_id, created_at, updated_at`,
    [
      input.title,
      input.customerImpact,
      input.status,
      input.severity,
      input.environment,
      JSON.stringify(input.affectedAreas),
      input.startedAt,
      input.resolvedAt ?? null,
      input.summary,
      input.createdByAccountId,
    ],
  );

  return result.rows[0];
}

export async function updateIncident(input: {
  incidentId: string;
  title: string;
  customerImpact: string;
  status: IncidentRecord['status'];
  severity: IncidentRecord['severity'];
  environment: string;
  affectedAreas: string[];
  startedAt: string;
  resolvedAt?: string | null;
  summary: string;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<IncidentRecord>(
    `update incidents
     set title = $2,
         customer_impact = $3,
         status = $4,
         severity = $5,
         environment = $6,
         affected_areas = $7::jsonb,
         started_at = $8,
         resolved_at = $9,
         summary = $10,
         updated_at = now()
     where id = $1
     returning id, title, customer_impact, status, severity, environment, affected_areas, started_at, resolved_at, summary, created_by_account_id, created_at, updated_at`,
    [
      input.incidentId,
      input.title,
      input.customerImpact,
      input.status,
      input.severity,
      input.environment,
      JSON.stringify(input.affectedAreas),
      input.startedAt,
      input.resolvedAt ?? null,
      input.summary,
    ],
  );

  return result.rows[0] ?? null;
}
