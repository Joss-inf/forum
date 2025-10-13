
import * as AuthService from './auth.service.js';

export async function register(req, res, next) {
  try {
    await AuthService.registerUser(req.body);
    res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    await AuthService.loginUser(req.body, res);
    res.status(200).json({ message: 'Connexion réussie.' });
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    await AuthService.changeUserPasswordWithVerification(userId, currentPassword, newPassword);
    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const userId = req.user?.id;
    await AuthService.logoutUser(userId, res);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

