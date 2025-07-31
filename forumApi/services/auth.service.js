import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.model.js';
import { ConflictError, AuthenticationError } from '../utils/errors.js';

/**
 * Enregistre un nouvel utilisateur.
 * @param {object} userData - Données de l'utilisateur { username, email, password }
 */
export async function registerUser(userData) {
  const { username, email, password } = userData;

  // Vérifier si l'email ou le pseudo n'est pas déjà pris
  const existingUser = await UserModel.findByEmailOrUsername(email, username);
  if (existingUser) {
    throw new ConflictError('Cet email ou ce nom d\'utilisateur est déjà utilisé.');
  }

  // Hasher le mot de passe
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Créer l'utilisateur en base de données
  await UserModel.create({
    username,
    email,
    password_hash: hashedPassword,
  });
}

/**
 * Connecte un utilisateur et retourne un token JWT.
 * @param {object} credentials - { email, password }
 * @returns {Promise<{token: string, user: object}>}
 */
export async function loginUser(credentials) {
  const { email, password } = credentials;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new AuthenticationError('Identifiants invalides.');
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AuthenticationError('Identifiants invalides.');
  }

  // Créer le payload du token
  const payload = {
    user: {
      id: user.id,
      // Vous pouvez ajouter d'autres infos comme le rôle ici
    },
  };

  // Signer le token
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // Pensez à configurer les variables d'environnement
  });

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  };
}