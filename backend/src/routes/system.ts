import { Router } from 'express';
import { checkDatabaseConnection } from '../db/client.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const systemRouter = Router();

systemRouter.get('/health', asyncHandler(async (_request, response) => {
  const database = await checkDatabaseConnection();

  response.status(database.ok || !database.configured ? 200 : 503).json({
    ok: database.ok || !database.configured,
    service: 'inex-it-support-backend',
    database,
    timestamp: new Date().toISOString(),
  });
}));
