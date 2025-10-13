// routes/user.routes.js
import { Router } from 'ultimate-express';
import * as userController from './user.controller.js'; // Assurez-vous que ce chemin est correct
import authMiddleware from '../../middleware/auth.middleware.js'; // Ton middleware d'authentification
import csrfMiddleware from '../../middleware/csrf.middleware.js'
const router = Router();

router
.get('/me', authMiddleware, userController.getMe)
.get('/:id', authMiddleware,csrfMiddleware, userController.getUserById)
.put('/profile', authMiddleware,csrfMiddleware, userController.updateProfile)

export default router;