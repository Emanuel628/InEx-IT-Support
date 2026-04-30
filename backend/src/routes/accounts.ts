import { Router } from 'express';
import { z } from 'zod';
import { hashPassword } from '../auth/password.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import {
  createInternalSupportAccount,
  findInternalSupportAccountByEmail,
  listInternalSupportAccounts,
} from '../repositories/internalSupportAccounts.js';

const createAccountSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'support_manager', 'support_agent', 'viewer']),
});

export const accountsRouter = Router();

accountsRouter.get('/api/accounts', requireAuth, requireRole(['admin']), asyncHandler(async (_request, response) => {
  const accounts = await listInternalSupportAccounts();

  return response.status(200).json({
    ok: true,
    items: accounts.map((account) => ({
      id: account.id,
      companyId: account.company_id,
      displayName: account.display_name,
      email: account.email,
      role: account.role,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
      lastLoginAt: account.last_login_at,
    })),
  });
}));

accountsRouter.post('/api/accounts', requireAuth, requireRole(['admin']), asyncHandler(async (request, response) => {
  const parsed = createAccountSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid account payload.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const existingAccount = await findInternalSupportAccountByEmail(parsed.data.email);

  if (existingAccount) {
    return response.status(409).json({
      ok: false,
      message: 'An account with that email already exists.',
    });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const account = await createInternalSupportAccount({
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    passwordHash,
    role: parsed.data.role,
  });

  return response.status(201).json({
    ok: true,
    item: {
      id: account.id,
      companyId: account.company_id,
      displayName: account.display_name,
      email: account.email,
      role: account.role,
      isActive: account.is_active,
      createdAt: account.created_at,
      updatedAt: account.updated_at,
      lastLoginAt: account.last_login_at,
    },
  });
}));
