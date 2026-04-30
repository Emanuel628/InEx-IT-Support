import { Router } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { hashPassword } from '../auth/password.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import {
  countInternalSupportAccounts,
  createInternalSupportAccount,
} from '../repositories/internalSupportAccounts.js';

const bootstrapSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  setupSecret: z.string().min(1),
});

export const setupRouter = Router();

setupRouter.post('/api/setup/bootstrap-admin', asyncHandler(async (request, response) => {
  const parsed = bootstrapSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid bootstrap payload.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  if (!env.BOOTSTRAP_SETUP_SECRET) {
    return response.status(503).json({
      ok: false,
      message: 'Bootstrap setup secret is not configured.',
    });
  }

  if (parsed.data.setupSecret !== env.BOOTSTRAP_SETUP_SECRET) {
    return response.status(403).json({
      ok: false,
      message: 'Invalid setup secret.',
    });
  }

  const existingCount = await countInternalSupportAccounts();

  if (existingCount > 0) {
    return response.status(409).json({
      ok: false,
      message: 'Bootstrap blocked because accounts already exist.',
    });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const account = await createInternalSupportAccount({
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    passwordHash,
    role: 'admin',
  });

  return response.status(201).json({
    ok: true,
    message: 'Initial admin created successfully.',
    user: {
      id: account.id,
      companyId: account.company_id,
      displayName: account.display_name,
      email: account.email,
      role: account.role,
    },
  });
}));
