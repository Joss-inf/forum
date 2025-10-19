import { SignJWT, CompactEncrypt, jwtVerify, compactDecrypt } from 'jose';
import CONFIG from '../../../config/config.js';

const SIGNATURE_SECRET = new TextEncoder().encode(CONFIG.JWT_SECRET_HS256);
const ENCRYPTION_SECRET = new TextEncoder().encode(CONFIG.JWE_ENCRYPTION_KEY_256);
const expirationEnv = CONFIG.EXPIRATION || '2h';

export async function createSignedAndEncryptedToken(payload) {
  const jws = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expirationEnv)
    .sign(SIGNATURE_SECRET);

  const plaintextToEncrypt = new TextEncoder().encode(jws);

  const jwe = await new CompactEncrypt(plaintextToEncrypt)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(ENCRYPTION_SECRET);

  return jwe;
}

export async function verifySignedAndEncryptedToken(token) {

  const { plaintext } = await compactDecrypt(token, ENCRYPTION_SECRET);
  const jws = new TextDecoder().decode(plaintext);

  const { payload } = await jwtVerify(jws, SIGNATURE_SECRET);
  return payload;
}