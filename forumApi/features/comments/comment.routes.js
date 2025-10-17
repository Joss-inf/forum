import { Router } from 'ultimate-express';
import { body } from 'express-validator';
import * as commentController from './comment.controller.js';
import authMiddleware from '../../middleware/auth.middleware.js';
import csrfMiddleware from '../../middleware/csrf.middleware.js';

const router = Router();

router.put(
  '/:id',
  authMiddleware,
  csrfMiddleware,
  [
    body('content').isLength({ min: 1, max: 1000 }),
  ],
  commentController.updateComment
);

router.delete('/:id', authMiddleware,csrfMiddleware, commentController.deleteComment);

export default router;