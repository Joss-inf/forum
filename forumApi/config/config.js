import dotenv from 'dotenv';
import env from 'env-var';
import crypto from 'crypto';

dotenv.config();

const CONFIG = {
  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  URL: env.get('URL').default('').asString(),

  JWT_SECRET_HS256: env.get('JWT_SECRET_HS256').required().asString(),
  JWE_ENCRYPTION_KEY_256: env.get('JWE_ENCRYPTION_KEY_256').required().asString(),
  EXPIRATION: env.get('EXPIRATION').default('2h').asString(),

  COOKIE_SECRET: env.get('COOKIE_SECRET').required().asString(),
  
  CSRF_SECRET: env.get('CSRF_SECRET').default(crypto.randomBytes(32).toString('hex')).asString(),

  NODE_ENV: env.get('NODE_ENV').default('development').asString(),
  PORT: env.get('PORT').default(3100).asPortNumber(),
};
export default CONFIG