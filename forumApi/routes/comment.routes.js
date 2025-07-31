import { Router } from 'express';
import { body } from 'express-validator';
import * as commentController from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.put(
  '/:id',
  authMiddleware,
  [
    body('content').isLength({ min: 5, max: 1000 }),
  ],
  commentController.updateComment
);

router.delete('/:id', authMiddleware, commentController.deleteComment);

export default router;