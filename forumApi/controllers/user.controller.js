import * as UserService from '../services/user.service.js';

export async function getMe(req, res) {
  const userId = req.user.id;
  const userProfile = await UserService.getUserProfile(userId);

  if (!userProfile) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }
  res.status(200).json(userProfile);
}

export async function getUserById(req, res) {
  const userId = req.params.id;
  const publicProfile = await UserService.getPublicUserProfile(userId);

  if (!publicProfile) {
    return res.status(404).json({ message: 'Utilisateur non trouvé.' });
  }
  res.status(200).json(publicProfile);
}