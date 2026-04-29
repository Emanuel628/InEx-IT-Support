import { env } from '../config/env.js';
import { hashPassword } from '../auth/password.js';
import {
  countInternalSupportAccounts,
  createInternalSupportAccount,
} from '../repositories/internalSupportAccounts.js';

async function main() {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to bootstrap an admin account.');
  }

  const existingCount = await countInternalSupportAccounts();

  if (existingCount > 0) {
    throw new Error('Bootstrap blocked because internal support accounts already exist.');
  }

  const displayName = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || 'Initial Admin';
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required.');
  }

  const passwordHash = await hashPassword(password);
  const account = await createInternalSupportAccount({
    displayName,
    email,
    passwordHash,
    role: 'admin',
  });

  console.log('Initial admin account created successfully.');
  console.log(`Company ID: ${account.company_id}`);
  console.log(`Email: ${account.email}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Bootstrap failed.');
  process.exit(1);
});
