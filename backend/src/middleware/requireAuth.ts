import type { NextFunction, Request, Response } from 'express';
import { verifyAuthToken, type AuthTokenPayload } from '../auth/token.js';
import {
  findInternalSupportAccountById,
  type InternalSupportAccountRecord,
} from '../repositories/internalSupportAccounts.js';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthTokenPayload;
    authAccount?: InternalSupportAccountRecord;
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  void (async () => {
    const authHeader = request.header('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return response.status(401).json({
        ok: false,
        message: 'Authentication required.',
      });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const payload = verifyAuthToken(token);

    if (!payload) {
      return response.status(401).json({
        ok: false,
        message: 'Invalid or expired token.',
      });
    }

    const account = await findInternalSupportAccountById(payload.sub);

    if (!account || !account.is_active) {
      return response.status(401).json({
        ok: false,
        message: 'Authenticated account is not available.',
      });
    }

    request.auth = {
      ...payload,
      role: account.role,
      companyId: account.company_id,
    };
    request.authAccount = account;
    next();
  })().catch(next);
}
