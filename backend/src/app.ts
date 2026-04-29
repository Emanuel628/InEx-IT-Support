import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { authRouter } from './routes/auth.js';
import { systemRouter } from './routes/system.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  app.get('/', (_request, response) => {
    response.json({
      ok: true,
      service: 'inex-it-support-backend',
      message: 'API is running',
    });
  });

  app.use(systemRouter);
  app.use(authRouter);

  return app;
}
