import { getDbPool } from '../db/client.js';

export async function logActivity(input: {
  entityType: string;
  entityId: string;
  action: string;
  actorAccountId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  await db.query(
    `insert into activity_log (entity_type, entity_id, action, actor_account_id, summary, metadata)
     values ($1, $2, $3, $4, $5, $6::jsonb)`,
    [
      input.entityType,
      input.entityId,
      input.action,
      input.actorAccountId ?? null,
      input.summary,
      JSON.stringify(input.metadata ?? {}),
    ],
  );
}

export async function listActivityForEntity(entityType: string, entityId: string) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<{
    id: string;
    entity_type: string;
    entity_id: string;
    action: string;
    actor_account_id: string | null;
    summary: string;
    metadata: Record<string, unknown>;
    created_at: string;
  }>(
    `select id, entity_type, entity_id, action, actor_account_id, summary, metadata, created_at
     from activity_log
     where entity_type = $1 and entity_id = $2
     order by created_at desc`,
    [entityType, entityId],
  );

  return result.rows;
}
