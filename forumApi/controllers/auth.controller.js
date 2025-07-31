import { validationResult } from 'express-validator';
import * as AuthService from '../services/auth.service.js';

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  await AuthService.registerUser(req.body);
  res.status(201).json({ message: 'Utilisateur créé avec succès.' });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const result = await AuthService.loginUser(req.body);
  res.status(200).json(result);
}