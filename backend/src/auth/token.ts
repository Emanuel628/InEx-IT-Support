import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';

export type AuthTokenPayload = {
  sub: string;
  companyId: string;
  role: string;
  exp: number;
};

function encodeBase64Url(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function decodeBase64Url<T>(value: string): T | null {
  try {
    return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as T;
  } catch {
    return null;
  }
}

function sign(value: string) {
  return createHmac('sha256', env.AUTH_TOKEN_SECRET).update(value).digest('base64url');
}

export function createAuthToken(payload: Omit<AuthTokenPayload, 'exp'>, expiresInSeconds = 60 * 60 * 12) {
  const fullPayload: AuthTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(fullPayload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAuthToken(token: string) {
  const [encodedPayload, providedSignature] = token.split('.');

  if (!encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const providedBuffer = Buffer.from(providedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  const payload = decodeBase64Url<AuthTokenPayload>(encodedPayload);

  if (!payload || payload.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
}
