import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireRole } from '../middleware/requireRole.js';

export const supportRouter = Router();

supportRouter.get('/api/support/session', requireAuth, (request, response) => {
  response.status(200).json({
    ok: true,
    session: {
      userId: request.auth?.sub,
      companyId: request.auth?.companyId,
      role: request.auth?.role,
    },
  });
});

supportRouter.get('/api/support/permissions', requireAuth, (request, response) => {
  const role = request.auth?.role;

  response.status(200).json({
    ok: true,
    role,
    permissions: {
      canManageSettings: role === 'admin',
      canManageAssignments: role === 'admin' || role === 'support_manager',
      canWorkTickets: role === 'admin' || role === 'support_manager' || role === 'support_agent',
      canViewOperationalData: ['admin', 'support_manager', 'support_agent', 'viewer'].includes(role || ''),
    },
  });
});

supportRouter.get('/api/support/admin-check', requireAuth, requireRole(['admin']), (_request, response) => {
  response.status(200).json({
    ok: true,
    message: 'Admin-only route is accessible.',
  });
});
