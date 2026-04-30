import { getDbPool } from '../db/client.js';

export type InternalSupportAccountRole = 'admin' | 'support_manager' | 'support_agent' | 'viewer';

export type InternalSupportAccountRecord = {
  id: string;
  company_id: string;
  display_name: string;
  email: string;
  password_hash: string;
  role: InternalSupportAccountRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

const accountSelect = `select id, company_id, display_name, email, password_hash, role, is_active, created_at, updated_at, last_login_at
     from internal_support_accounts`;

export async function countInternalSupportAccounts() {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<{ count: string }>('select count(*)::text as count from internal_support_accounts');
  return Number(result.rows[0]?.count ?? '0');
}

export async function listInternalSupportAccounts() {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<InternalSupportAccountRecord>(`${accountSelect} order by created_at asc`);
  return result.rows;
}

export async function findInternalSupportAccountByCompanyId(companyId: string) {
  const db = getDbPool();

  if (!db) {
    return null;
  }

  const result = await db.query<InternalSupportAccountRecord>(
    `${accountSelect}
     where upper(company_id) = upper($1)
     limit 1`,
    [companyId],
  );

  return result.rows[0] ?? null;
}

export async function findInternalSupportAccountByEmail(email: string) {
  const db = getDbPool();

  if (!db) {
    return null;
  }

  const result = await db.query<InternalSupportAccountRecord>(
    `${accountSelect}
     where lower(email) = lower($1)
     limit 1`,
    [email],
  );

  return result.rows[0] ?? null;
}

export async function findInternalSupportAccountById(accountId: string) {
  const db = getDbPool();

  if (!db) {
    return null;
  }

  const result = await db.query<InternalSupportAccountRecord>(
    `${accountSelect}
     where id = $1
     limit 1`,
    [accountId],
  );

  return result.rows[0] ?? null;
}

export async function createInternalSupportAccount(input: {
  displayName: string;
  email: string;
  passwordHash: string;
  role: InternalSupportAccountRole;
}) {
  const db = getDbPool();

  if (!db) {
    throw new Error('Database is not configured.');
  }

  const result = await db.query<InternalSupportAccountRecord>(
    `insert into internal_support_accounts (display_name, email, password_hash, role)
     values ($1, $2, $3, $4)
     returning id, company_id, display_name, email, password_hash, role, is_active, created_at, updated_at, last_login_at`,
    [input.displayName, input.email.toLowerCase(), input.passwordHash, input.role],
  );

  return result.rows[0];
}

export async function touchInternalSupportAccountLastLogin(accountId: string) {
  const db = getDbPool();

  if (!db) {
    return;
  }

  await db.query(
    `update internal_support_accounts
     set last_login_at = now(), updated_at = now()
     where id = $1`,
    [accountId],
  );
}
