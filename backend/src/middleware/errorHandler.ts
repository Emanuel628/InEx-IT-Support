import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  const rawMessage = error instanceof Error ? error.message : 'Unexpected server error.';
  console.error(rawMessage);

  response.status(500).json({
    ok: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error.' : rawMessage,
  });
}
