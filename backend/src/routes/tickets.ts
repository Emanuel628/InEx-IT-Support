import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

export const ticketsRouter = Router();

ticketsRouter.get('/api/tickets', requireAuth, (request, response) => {
  response.status(200).json({
    ok: true,
    message: 'Protected tickets list route scaffold.',
    requestedBy: {
      userId: request.auth?.sub,
      companyId: request.auth?.companyId,
      role: request.auth?.role,
    },
    items: [],
  });
});

ticketsRouter.post('/api/tickets', requireAuth, requireRole(['admin', 'support_manager', 'support_agent']), (_request, response) => {
  response.status(501).json({
    ok: false,
    message: 'Ticket creation is not implemented yet.',
  });
});
