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

const ticketSelect = `select id, title, requester_name, requester_email, business_name, status, priority, category, source, environment, app_area,
            assigned_account_id, details, created_by_account_id, created_at, updated_at
     from tickets`;

export async function listTickets() {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<TicketRecord>(`${ticketSelect} order by created_at desc`);

  return result.rows;
}

export async function getTicketById(ticketId: string) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<TicketRecord>(`${ticketSelect} where id = $1 limit 1`, [ticketId]);
  return result.rows[0] ?? null;
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

export async function updateTicket(input: {
  ticketId: string;
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
  assignedAccountId?: string | null;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<TicketRecord>(
    `update tickets
     set title = $2,
         requester_name = $3,
         requester_email = $4,
         business_name = $5,
         status = $6,
         priority = $7,
         category = $8,
         source = $9,
         environment = $10,
         app_area = $11,
         assigned_account_id = $12,
         details = $13,
         updated_at = now()
     where id = $1
     returning id, title, requester_name, requester_email, business_name, status, priority, category, source, environment, app_area,
               assigned_account_id, details, created_by_account_id, created_at, updated_at`,
    [
      input.ticketId,
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
      ],
  );

  return result.rows[0] ?? null;
}
