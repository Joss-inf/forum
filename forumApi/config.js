import dotenv from 'dotenv';

dotenv.config();

const { 
    DATABASE_URL,
    URL,
    JWT_SECRET_HS256,
    JWE_ENCRYPTION_KEY_256,
    COOKIE_SECRET,
    CSRF_SECRET,
    EXPIRATION,
    NODE_ENV
 } = process.env;

export {  DATABASE_URL,
    URL,
    JWT_SECRET_HS256,
    JWE_ENCRYPTION_KEY_256,
    COOKIE_SECRET,
    CSRF_SECRET,
    EXPIRATION,
    NODE_ENV };

