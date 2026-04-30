import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { listActivityForEntity, logActivity } from '../repositories/activityLog.js';
import {
  createIncident,
  getIncidentById,
  listIncidents,
  updateIncident,
} from '../repositories/incidents.js';

const incidentSchema = z.object({
  title: z.string().min(1),
  customerImpact: z.string().min(1),
  status: z.enum(['investigating', 'identified', 'monitoring', 'resolved', 'postmortem_needed']).default('investigating'),
  severity: z.enum(['minor', 'major', 'critical']).default('major'),
  environment: z.string().min(1),
  affectedAreas: z.array(z.string().min(1)).default([]),
  startedAt: z.string().min(1),
  resolvedAt: z.string().nullable().optional(),
  summary: z.string().min(1),
});

export const incidentsRouter = Router();

incidentsRouter.get('/api/incidents', requireAuth, asyncHandler(async (_request, response) => {
  const items = await listIncidents();

  return response.status(200).json({
    ok: true,
    items,
  });
}));

incidentsRouter.get('/api/incidents/:incidentId', requireAuth, asyncHandler(async (request, response) => {
  const incident = await getIncidentById(request.params.incidentId);

  if (!incident) {
    return response.status(404).json({
      ok: false,
      message: 'Incident not found.',
    });
  }

  const activity = await listActivityForEntity('incident', incident.id);

  return response.status(200).json({
    ok: true,
    item: incident,
    activity,
  });
}));

incidentsRouter.post('/api/incidents', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), asyncHandler(async (request, response) => {
  const parsed = incidentSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid incident payload.',
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

  const incident = await createIncident({
    ...parsed.data,
    createdByAccountId,
  });

  await logActivity({
    entityType: 'incident',
    entityId: incident.id,
    action: 'created',
    actorAccountId: createdByAccountId,
    summary: `Incident ${incident.title} was created.`,
    metadata: {
      status: incident.status,
      severity: incident.severity,
      environment: incident.environment,
    },
  });

  return response.status(201).json({
    ok: true,
    item: incident,
  });
}));

incidentsRouter.put('/api/incidents/:incidentId', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), asyncHandler(async (request, response) => {
  const parsed = incidentSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid incident payload.',
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

  const incident = await updateIncident({
    incidentId: request.params.incidentId,
    ...parsed.data,
  });

  if (!incident) {
    return response.status(404).json({
      ok: false,
      message: 'Incident not found.',
    });
  }

  await logActivity({
    entityType: 'incident',
    entityId: incident.id,
    action: 'updated',
    actorAccountId,
    summary: `Incident ${incident.title} was updated.`,
    metadata: {
      status: incident.status,
      severity: incident.severity,
      environment: incident.environment,
    },
  });

  return response.status(200).json({
    ok: true,
    item: incident,
  });
}));
