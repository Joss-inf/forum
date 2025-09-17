import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config()

const CSRF_SECRET = process.env.CSRF_SECRET;

export function generateCsrfToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(token)
    .digest('hex');
  return { token, signed: `${token}.${signature}` };
}

export function verifyCsrfToken(headerToken, cookieToken) {
  if (!headerToken || !cookieToken) return false;

  const [cookieTokenValue, signature] = cookieToken.split('.');
  if (!cookieTokenValue || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(cookieTokenValue)
    .digest('hex');

  return headerToken === cookieTokenValue && signature === expectedSignature;
}