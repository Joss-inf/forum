import * as UserModel from '../models/user.model.js';
import { NotFoundError } from '../utils/errors.js';

// Fonction privée pour ne pas exposer les données sensibles
function toPublicProfile(user) {
  if (!user) return null;
  const { password_hash, email, ...publicData } = user;
  return publicData;
}

/**
 * Récupère le profil complet d'un utilisateur (pour lui-même).
 */
export async function getUserProfile(userId) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError('Utilisateur non trouvé.');
  }
  // On peut choisir d'exclure le hash du mot de passe même ici
  const { password_hash, ...profileData } = user;
  return profileData;
}

/**
 * Récupère le profil public d'un utilisateur.
 */
export async function getPublicUserProfile(userId) {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundError('Utilisateur non trouvé.');
  }
  return toPublicProfile(user);
}