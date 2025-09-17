import * as UserService from './user.service.js';
import { validationResult } from 'express-validator'; 

export async function getMe(req, res, next) {
  try {
    const userId = req.user.id; 
    const userProfile = await UserService.getUserProfile(userId);
    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const publicProfile = await UserService.getPublicUserProfile(userId);
    res.status(200).json(publicProfile);
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    const userId = req.user.id;
    const { username, email } = req.body;
    const updatedUser = await UserService.updateUserProfile(userId, { username, email });
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}
