import { Router } from 'ultimate-express';
import * as authController from './auth.controller.js';
import { authMiddleware, csrfMiddleware} from '../../middleware/index.js';
import { validateChangePassword, validateLogin, validateRegister} from '../../validators/index.js';
const router = Router();

router

.post('/register',validateRegister,authController.register)
.post('/login',validateLogin, authController.login)
.post('/logout',authMiddleware,csrfMiddleware, authController.logout)
.put('/change-password',authMiddleware,csrfMiddleware,validateChangePassword, authController.changePassword );

export default router;