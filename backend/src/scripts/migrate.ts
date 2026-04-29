import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../config/env.js';
import { getDbPool } from '../db/client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../db/migrations');

async function ensureMigrationsTable() {
  const db = getDbPool();

  if (!db) {
    throw new Error('DATABASE_URL is required to run migrations.');
  }

  await db.query(`
    create table if not exists schema_migrations (
      id bigserial primary key,
      filename text not null unique,
      applied_at timestamptz not null default now()
    )
  `);
}

async function getAppliedMigrationNames() {
  const db = getDbPool();

  if (!db) {
    throw new Error('DATABASE_URL is required to run migrations.');
  }

  const result = await db.query<{ filename: string }>(
    'select filename from schema_migrations order by filename asc',
  );

  return new Set(result.rows.map((row) => row.filename));
}

async function applyMigration(filename: string, sql: string) {
  const db = getDbPool();

  if (!db) {
    throw new Error('DATABASE_URL is required to run migrations.');
  }

  await db.query('begin');

  try {
    await db.query(sql);
    await db.query('insert into schema_migrations (filename) values ($1)', [filename]);
    await db.query('commit');
  } catch (error) {
    await db.query('rollback');
    throw error;
  }
}

async function main() {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run migrations.');
  }

  await ensureMigrationsTable();
  const applied = await getAppliedMigrationNames();
  const allFiles = await readdir(migrationsDir);
  const migrationFiles = allFiles.filter((name) => name.endsWith('.sql')).sort();

  if (migrationFiles.length === 0) {
    console.log('No SQL migrations found.');
    return;
  }

  for (const filename of migrationFiles) {
    if (applied.has(filename)) {
      console.log(`Skipping already applied migration: ${filename}`);
      continue;
    }

    const fullPath = path.join(migrationsDir, filename);
    const sql = await readFile(fullPath, 'utf8');
    console.log(`Applying migration: ${filename}`);
    await applyMigration(filename, sql);
    console.log(`Applied migration: ${filename}`);
  }

  console.log('Migration run completed successfully.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Migration run failed.');
  process.exit(1);
});
