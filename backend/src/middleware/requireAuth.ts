import type { NextFunction, Request, Response } from 'express';
import { verifyAuthToken, type AuthTokenPayload } from '../auth/token.js';

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthTokenPayload;
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
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

  request.auth = payload;
  next();
}
