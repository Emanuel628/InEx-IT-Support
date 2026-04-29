import { Router } from 'express';
import { z } from 'zod';
import { getDbPool } from '../db/client.js';
import { verifyPassword } from '../auth/password.js';
import {
  findInternalSupportAccountByCompanyId,
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

  return response.status(200).json({
    ok: true,
    message: 'Login scaffold is now connected to account lookup.',
    user: {
      id: account.id,
      companyId: account.company_id,
      displayName: account.display_name,
      email: account.email,
      role: account.role,
    },
  });
});

authRouter.get('/auth/me', (_request, response) => {
  return response.status(501).json({
    ok: false,
    message: 'Current-user lookup is not implemented yet.',
  });
});
