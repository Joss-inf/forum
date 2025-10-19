import { compactDecrypt, jwtVerify } from 'jose';
import { AuthenticationError } from '../utils/errors.js'; 
import  CONFIG from '../config/config.js';


const ENCRYPTION_SECRET = new TextEncoder().encode(CONFIG.JWE_ENCRYPTION_KEY_256);
const SIGNATURE_SECRET = new TextEncoder().encode(CONFIG.JWT_SECRET_HS256);

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