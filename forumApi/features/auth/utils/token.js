import { SignJWT, CompactEncrypt, jwtVerify, compactDecrypt } from 'jose';
import dotenv from 'dotenv';

dotenv.config();

const SIGNATURE_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_HS256);
const ENCRYPTION_SECRET = new TextEncoder().encode(process.env.JWE_ENCRYPTION_KEY_256);
const expirationEnv = process.env.EXPIRATION || '2h';

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