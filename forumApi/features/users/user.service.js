import * as UserModel from './user.model.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { maskEmail } from '../../utils/maskEmail.js'; 

function toPublicProfile(user) {
  if (!user) return null;
  const {email, ...publicData } = user;
  publicData.email = maskEmail(email); 
  return publicData;
}

export async function getUserProfile(userId) {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError('Utilisateur non trouvé.');
  return user;
}

export async function getPublicUserProfile(userId) {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError('Utilisateur non trouvé.');
  const publicProfile = toPublicProfile(user); 
  return publicProfile;
}

export async function updateUserProfile(userId, profileData) {
  const { username, email } = profileData;
  if (!username || !email) throw new Error('Le nom d\'utilisateur et l\'email sont requis.');
  try {
    return await UserModel.updateProfile(userId, profileData);

  } catch (error) {
    // Gestion d’erreur de duplication
    if (error.code === '23505') {
      if (error.constraint === 'users_email_key') {
        throw new ConflictError('Cet email est déjà utilisé.');
      }
      if (error.constraint === 'users_username_key') {
        throw new ConflictError('Ce nom d’utilisateur est déjà pris.');
      }
    }

    throw error; 
  }
}
