import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

router.post(
  '/register',
  [
    body('username').isLength({ min: 3, max: 20 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
  ],
  authController.register
)
.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

export default router;