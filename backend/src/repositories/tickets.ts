import { getDbPool } from '../db/client.js';

export type TicketRecord = {
  id: string;
  title: string;
  requester_name: string;
  requester_email: string;
  business_name: string | null;
  status: 'new' | 'in_progress' | 'waiting_on_user' | 'escalated' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  source: string;
  environment: string;
  app_area: string;
  assigned_account_id: string | null;
  details: string;
  created_by_account_id: string;
  created_at: string;
  updated_at: string;
};

export async function listTickets() {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<TicketRecord>(
    `select id, title, requester_name, requester_email, business_name, status, priority, category, source, environment, app_area,
            assigned_account_id, details, created_by_account_id, created_at, updated_at
     from tickets
     order by created_at desc`,
  );

  return result.rows;
}

export async function createTicket(input: {
  title: string;
  requesterName: string;
  requesterEmail: string;
  businessName?: string;
  status: TicketRecord['status'];
  priority: TicketRecord['priority'];
  category: string;
  source: string;
  environment: string;
  appArea: string;
  details: string;
  createdByAccountId: string;
  assignedAccountId?: string | null;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<TicketRecord>(
    `insert into tickets (
      title,
      requester_name,
      requester_email,
      business_name,
      status,
      priority,
      category,
      source,
      environment,
      app_area,
      assigned_account_id,
      details,
      created_by_account_id
    ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    returning id, title, requester_name, requester_email, business_name, status, priority, category, source, environment, app_area,
              assigned_account_id, details, created_by_account_id, created_at, updated_at`,
    [
      input.title,
      input.requesterName,
      input.requesterEmail.toLowerCase(),
      input.businessName ?? null,
      input.status,
      input.priority,
      input.category,
      input.source,
      input.environment,
      input.appArea,
      input.assignedAccountId ?? null,
      input.details,
      input.createdByAccountId,
    ],
  );

  return result.rows[0];
}
