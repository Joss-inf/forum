import { Router } from 'ultimate-express';
import * as commentController from './comment.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import csrfMiddleware from '../../middleware/csrf.middleware.js';
import { validateComment } from '../../validators/index.js';

const router = Router();

router

.put('/:id',validateComment,authMiddleware,csrfMiddleware,commentController.updateComment)
.delete('/:id', authMiddleware,csrfMiddleware, commentController.deleteComment);

export default router;