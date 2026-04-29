import { Router } from 'express';
import { z } from 'zod';

const loginSchema = z.object({
  companyId: z.string().min(1),
  password: z.string().min(1),
});

export const authRouter = Router();

authRouter.post('/auth/login', (request, response) => {
  const parsed = loginSchema.safeParse(request.body);

  if (!parsed.success) {
    return response.status(400).json({
      ok: false,
      message: 'Invalid login payload',
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  return response.status(501).json({
    ok: false,
    message: 'Company ID login is not implemented yet.',
  });
});

authRouter.get('/auth/me', (_request, response) => {
  return response.status(501).json({
    ok: false,
    message: 'Current-user lookup is not implemented yet.',
  });
});
