import jwt from 'jsonwebtoken';
import { AuthenticationError } from '../utils/errors.js';

/**
 * Middleware pour vérifier l'authentification via un token JWT.
 * 
 * Il cherche un token dans l'en-tête 'Authorization: Bearer <token>'.
 * Si le token est valide, il attache le payload de l'utilisateur à `req.user`.
 * Sinon, il passe une erreur au gestionnaire d'erreurs global.
 */
const authMiddleware = (req, res, next) => {
  try {
    // 1. Récupérer l'en-tête d'autorisation
    const authHeader = req.headers.authorization;

    // 2. Vérifier si l'en-tête existe et s'il est au bon format ('Bearer ...')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Si le token est manquant, on passe une erreur d'authentification
      throw new AuthenticationError('Accès non autorisé. Token manquant ou mal formé.');
    }

    // 3. Isoler le token en retirant le préfixe 'Bearer '
    const token = authHeader.split(' ')[1];

    // 4. Vérifier et décoder le token.
    // jwt.verify lèvera une erreur si le token est invalide (expiré, signature incorrecte, etc.)
    // Cette erreur sera attrapée par le bloc catch.
    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Attacher les informations de l'utilisateur à l'objet de la requête.
    // Le payload que nous avons créé dans auth.service.js était { user: { id: ... } }
    // Nous rendons donc `req.user` disponible pour les prochains middlewares et contrôleurs.
    req.user = decodedPayload.user;

    // 6. Si tout est bon, passer à la suite (le contrôleur)
    next();
  } catch (error) {
    // Si jwt.verify échoue (ex: TokenExpiredError), il sera attrapé ici.
    // On crée une erreur standardisée pour ne pas fuiter de détails techniques.
    // On passe cette erreur à notre gestionnaire d'erreurs global via next().
    next(new AuthenticationError('Token invalide ou expiré.'));
  }
};

export default authMiddleware;