import { compactDecrypt, jwtVerify } from 'jose';
import { AuthenticationError } from '../utils/errors.js'; 
import dotenv from 'dotenv';
dotenv.config();

const ENCRYPTION_SECRET = new TextEncoder().encode(process.env.JWE_ENCRYPTION_KEY_256);
const SIGNATURE_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_HS256);

if (!process.env.JWE_ENCRYPTION_KEY_256 || !process.env.JWT_SECRET_HS256) {
  console.error('ERREUR FATALE : Les variables d\'environnement JWE_ENCRYPTION_KEY_256 et/ou JWT_SECRET_HS256 sont manquantes.');
  process.exit(1);
}

const ERROR_MESSAGES = new Map([
  ['ERR_JWE_DECRYPTION_FAILED', 'Token corrompu ou clé de chiffrement incorrecte.'],
  ['ERR_JWS_INVALID', 'Signature du token invalide.'],
  ['JWTExpired', 'Token expiré.'], 
  ['JWSSignatureVerificationFailed', 'Signature du token invalide.'], 
  ['JWEInvalid', 'Format de token JWE invalide.'], 
]);

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.signedCookies.auth_token;
  
    if (!token) throw new AuthenticationError('Token d\'authentification manquant.');

    const { plaintext } = await compactDecrypt(token, ENCRYPTION_SECRET);

    const signedJwt = new TextDecoder().decode(plaintext);

    const { payload } = await jwtVerify(
      signedJwt,
      SIGNATURE_SECRET,
      { algorithms: ['HS256'] }
    );
    req.user = payload.user; 
    next(); 

  }  catch (error) {

    let errorMessage = 'Token invalide ou expiré.'; 
    const statusCode = 401; 

    if (ERROR_MESSAGES.has(error.code)) {
      errorMessage = ERROR_MESSAGES.get(error.code);
    } else if (ERROR_MESSAGES.has(error.name)) {
      errorMessage = ERROR_MESSAGES.get(error.name);
    } else if (error instanceof AuthenticationError) {
      errorMessage = error.message; 
    }

    res.status(statusCode).json({ message: errorMessage });
  }
};

export default authMiddleware;