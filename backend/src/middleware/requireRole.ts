import type { NextFunction, Request, Response } from 'express';
import type { InternalSupportAccountRole } from '../repositories/internalSupportAccounts.js';

export function requireRole(allowedRoles: InternalSupportAccountRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const role = request.auth?.role as InternalSupportAccountRole | undefined;

    if (!role) {
      return response.status(401).json({
        ok: false,
        message: 'Authentication required.',
      });
    }

    if (!allowedRoles.includes(role)) {
      return response.status(403).json({
        ok: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    next();
  };
}
