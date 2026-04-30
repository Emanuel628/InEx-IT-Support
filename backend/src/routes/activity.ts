import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { listActivity } from '../repositories/activityLog.js';

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(250).optional(),
});

export const activityRouter = Router();

activityRouter.get('/api/activity', requireAuth, asyncHandler(async (request, response) => {
  const parsed = querySchema.safeParse(request.query);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid activity query.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const items = await listActivity(parsed.data.limit ?? 100);

  return response.status(200).json({
    ok: true,
    items,
  });
}));
