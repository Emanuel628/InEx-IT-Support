import { Router } from 'express';
import { z } from 'zod';
import { createAuthToken } from '../auth/token.js';
import { getDbPool } from '../db/client.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { verifyPassword } from '../auth/password.js';
import {
  findInternalSupportAccountByCompanyId,
  findInternalSupportAccountById,
  touchInternalSupportAccountLastLogin,
} from '../repositories/internalSupportAccounts.js';

const loginSchema = z.object({
  companyId: z.string().min(1),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post('/auth/login', async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid login payload',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  if (!getDbPool()) {
    return response.status(503).json({
      ok: false,
      message: 'Database is not configured yet.',
    });
  }

  const account = await findInternalSupportAccountByCompanyId(parsed.data.companyId);

  if (!account || !account.is_active) {
    return response.status(401).json({
      ok: false,
      message: 'Invalid company ID or password.',
    });
  }

  const passwordOk = await verifyPassword(parsed.data.password, account.password_hash);

  if (!passwordOk) {
    return response.status(401).json({
      ok: false,
      message: 'Invalid company ID or password.',
    });
  }

  await touchInternalSupportAccountLastLogin(account.id);

  const token = createAuthToken({
    sub: account.id,
    companyId: account.company_id,
    role: account.role,
  });

  return response.status(200).json({
    ok: true,
    message: 'Login successful.',
    token,
    user: {
      id: account.id,
      companyId: account.company_id,
      displayName: account.display_name,
      email: account.email,
      role: account.role,
      isActive: account.is_active,
    },
  });
});

authRouter.get('/auth/me', requireAuth, async (request, response) => {
  const accountId = request.auth?.sub;

  if (!accountId) {
    return response.status(401).json({
      ok: false,
      message: 'Authentication required.',
    });
  }

  const account = await findInternalSupportAccountById(accountId);

  if (!account || !account.is_active) {
    return response.status(401).json({
      ok: false,
      message: 'Authenticated account is not available.',
    });
  }

  return response.status(200).json({
    ok: true,
    user: {
      id: account.id,
      companyId: account.company_id,
      displayName: account.display_name,
      email: account.email,
      role: account.role,
      isActive: account.is_active,
      lastLoginAt: account.last_login_at,
    },
  });
});

authRouter.post('/auth/logout', requireAuth, (_request, response) => {
  return response.status(200).json({
    ok: true,
    message: 'Logout is handled by discarding the client token for now.',
  });
});
