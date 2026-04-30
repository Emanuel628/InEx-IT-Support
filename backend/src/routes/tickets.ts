import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';
import { listActivityForEntity, logActivity } from '../repositories/activityLog.js';
import { createTicket, getTicketById, listTickets, updateTicket } from '../repositories/tickets.js';

const ticketSchema = z.object({
  title: z.string().min(1),
  requesterName: z.string().min(1),
  requesterEmail: z.string().email(),
  businessName: z.string().optional(),
  status: z.enum(['new', 'in_progress', 'waiting_on_user', 'escalated', 'resolved', 'archived']).default('new'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  category: z.string().min(1),
  source: z.string().min(1),
  environment: z.string().min(1),
  appArea: z.string().min(1),
  details: z.string().min(1),
  assignedAccountId: z.string().uuid().nullable().optional(),
});

export const ticketsRouter = Router();

ticketsRouter.get('/api/tickets', requireAuth, async (_request, response) => {
  const items = await listTickets();

  response.status(200).json({
    ok: true,
    items,
  });
});

ticketsRouter.get('/api/tickets/:ticketId', requireAuth, async (request, response) => {
  const ticket = await getTicketById(request.params.ticketId);

  if (!ticket) {
    return response.status(404).json({
      ok: false,
      message: 'Ticket not found.',
    });
  }

  const activity = await listActivityForEntity('ticket', ticket.id);

  return response.status(200).json({
    ok: true,
    item: ticket,
    activity,
  });
});

ticketsRouter.post('/api/tickets', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), async (request, response) => {
  const parsed = ticketSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid ticket payload.',
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

  const ticket = await createTicket({
    ...parsed.data,
    createdByAccountId,
  });

  await logActivity({
    entityType: 'ticket',
    entityId: ticket.id,
    action: 'created',
    actorAccountId: createdByAccountId,
    summary: `Ticket ${ticket.title} was created.`,
    metadata: {
      status: ticket.status,
      priority: ticket.priority,
      category: ticket.category,
    },
  });

  return response.status(201).json({
    ok: true,
    item: ticket,
  });
});

ticketsRouter.put('/api/tickets/:ticketId', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), async (request, response) => {
  const parsed = ticketSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid ticket payload.',
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

  const ticket = await updateTicket({
    ticketId: request.params.ticketId,
    ...parsed.data,
  });

  if (!ticket) {
    return response.status(404).json({
      ok: false,
      message: 'Ticket not found.',
    });
  }

  await logActivity({
    entityType: 'ticket',
    entityId: ticket.id,
    action: 'updated',
    actorAccountId,
    summary: `Ticket ${ticket.title} was updated.`,
    metadata: {
      status: ticket.status,
      priority: ticket.priority,
      assignedAccountId: ticket.assigned_account_id,
    },
  });

  return response.status(200).json({
    ok: true,
    item: ticket,
  });
});
