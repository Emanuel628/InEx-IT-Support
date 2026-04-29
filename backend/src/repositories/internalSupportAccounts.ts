import { getDbPool } from '../db/client.js';

export type InternalSupportAccountRecord = {
  id: string;
  company_id: string;
  display_name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'support_manager' | 'support_agent' | 'viewer';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
};

export async function findInternalSupportAccountByCompanyId(companyId: string) {
  const db = getDbPool();

  if (!db) {
    return null;
  }

  const result = await db.query<InternalSupportAccountRecord>(
    `select id, company_id, display_name, email, password_hash, role, is_active, created_at, updated_at, last_login_at
     from internal_support_accounts
     where upper(company_id) = upper($1)
     limit 1`,
    [companyId],
  );

  return result.rows[0] ?? null;
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
