import { Router } from 'ultimate-express';
import * as authController from './auth.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js'; 
import csrfMiddleware from '../../middleware/auth.middleware.js'; 
const router = Router({ catchAsyncErrors: true });

router

.post('/register',authController.register)
.post('/login', authController.login)
.post('/logout',authMiddleware,csrfMiddleware, authController.logout)
.put('/change-password',authMiddleware,csrfMiddleware, authController.changePassword );

export default router;