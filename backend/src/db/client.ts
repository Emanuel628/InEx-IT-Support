import { Pool } from 'pg';
import { env } from '../config/env.js';

let pool: Pool | null = null;

export function getDbPool() {
  if (!env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  return pool;
}

export async function checkDatabaseConnection() {
  const db = getDbPool();

  if (!db) {
    return {
      configured: false,
      ok: false,
      message: 'DATABASE_URL not configured',
    };
  }

  try {
    await db.query('select 1');
    return {
      configured: true,
      ok: true,
      message: 'Database connection healthy',
    };
  } catch (error) {
    const rawMessage = error instanceof Error ? error.message : 'Database connection failed';
    console.error(rawMessage);

    return {
      configured: true,
      ok: false,
      message: env.NODE_ENV === 'production' ? 'Database connection failed' : rawMessage,
    };
  }
}
