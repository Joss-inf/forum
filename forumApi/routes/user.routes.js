import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Important : la route statique 'me' doit être déclarée avant la route dynamique ':id'
router.get('/me', authMiddleware, userController.getMe);

router.get('/:id', userController.getUserById);

export default router;