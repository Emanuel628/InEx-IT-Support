import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { listActivityForEntity, logActivity } from '../repositories/activityLog.js';
import {
  createErrorRecord,
  getErrorById,
  listErrors,
  updateErrorRecord,
} from '../repositories/errors.js';

const errorSchema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  status: z.enum(['new', 'triaged', 'linked_to_ticket', 'investigating', 'fixed', 'ignored', 'recurring']).default('new'),
  severity: z.enum(['minor', 'major', 'critical']).default('major'),
  source: z.string().min(1),
  appArea: z.string().min(1),
  environment: z.string().min(1),
  occurrenceCount: z.coerce.number().int().min(1).default(1),
  firstSeenAt: z.string().min(1),
  lastSeenAt: z.string().min(1),
  notes: z.string().min(1),
});

export const errorsRouter = Router();

errorsRouter.get('/api/errors', requireAuth, asyncHandler(async (_request, response) => {
  const items = await listErrors();

  return response.status(200).json({
    ok: true,
    items,
  });
}));

errorsRouter.get('/api/errors/:errorId', requireAuth, asyncHandler(async (request, response) => {
  const record = await getErrorById(request.params.errorId);

  if (!record) {
    return response.status(404).json({
      ok: false,
      message: 'Error record not found.',
    });
  }

  const activity = await listActivityForEntity('error', record.id);

  return response.status(200).json({
    ok: true,
    item: record,
    activity,
  });
}));

errorsRouter.post('/api/errors', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), asyncHandler(async (request, response) => {
  const parsed = errorSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid error payload.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const createdByAccountId = request.auth?.sub;

  if (!createdByAccountId) {
    return response.status(401).json({
      ok: false,
      message: 'Authentication required.',
    });
  }

  const record = await createErrorRecord({
    ...parsed.data,
    createdByAccountId,
  });

  await logActivity({
    entityType: 'error',
    entityId: record.id,
    action: 'created',
    actorAccountId: createdByAccountId,
    summary: `Error ${record.title} was logged.`,
    metadata: {
      status: record.status,
      severity: record.severity,
      source: record.source,
    },
  });

  return response.status(201).json({
    ok: true,
    item: record,
  });
}));

errorsRouter.put('/api/errors/:errorId', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), asyncHandler(async (request, response) => {
  const parsed = errorSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid error payload.',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const actorAccountId = request.auth?.sub;

  if (!actorAccountId) {
    return response.status(401).json({
      ok: false,
      message: 'Authentication required.',
    });
  }

  const record = await updateErrorRecord({
    errorId: request.params.errorId,
    ...parsed.data,
  });

  if (!record) {
    return response.status(404).json({
      ok: false,
      message: 'Error record not found.',
    });
  }

  await logActivity({
    entityType: 'error',
    entityId: record.id,
    action: 'updated',
    actorAccountId,
    summary: `Error ${record.title} was updated.`,
    metadata: {
      status: record.status,
      severity: record.severity,
      source: record.source,
    },
  });

  return response.status(200).json({
    ok: true,
    item: record,
  });
}));
