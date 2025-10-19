import bcrypt from 'bcryptjs';
import * as AuthModel from './auth.model.js';
import { ConflictError, AuthenticationError, NotFoundError } from '../../utils/errors.js';
import { generateCsrfToken } from './utils/csrf.js';
import { setAuthCookie, setCsrfCookie,clearAccessTokenCookie } from './utils/cookie.js';
import { createSignedAndEncryptedToken } from './utils/token.js';

export async function registerUser(userData) {
  const { username, email, password } = userData;
  const hashedPassword = await bcrypt.hash(password,10);

  try {
    const newUser = await AuthModel.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    return newUser;

  } catch {
    throw new ConflictError('Mot de passe ou identifiant incorrect.');
  }
}

export async function loginUser(credentials, res) {
  const { email, password } = credentials;

  const user = await AuthModel.findByEmail(email);
  if (!user) {
    const dummyHash = '$2b$10$abcdefghijklmnopqrstuv';
    await bcrypt.compare(password, dummyHash);
    throw new AuthenticationError('Identifiants invalides.');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new AuthenticationError('Identifiants invalides.');

  const payload = {
    user: { id: user.id },
    sub: user.id,
  };

  const jwtToken = await createSignedAndEncryptedToken(payload);
  const csrf = generateCsrfToken();

  setAuthCookie(res,jwtToken)
  setCsrfCookie(res,csrf.signed)

}

export async function logoutUser(userId, res){
 if (!userId) throw new AuthenticationError('Identifiants invalides.')
  clearAccessTokenCookie(res);
}

export async function changeUserPasswordWithVerification(userId, currentPassword, newPassword) {
  const password = await AuthModel.getUserPasswordHash(userId);

  if (!password) throw new NotFoundError('Utilisateur non trouvé.');

  const isPasswordValid = await bcrypt.compare(currentPassword, password.password_hash);
  if (!isPasswordValid) throw new AuthenticationError('Mot de passe actuel incorrect.');

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await AuthModel.changeUserPassword(userId, newPasswordHash);

  return true;
}