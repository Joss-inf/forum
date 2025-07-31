import { Router } from 'express';
import { body } from 'express-validator';
import * as postController from '../controllers/post.controller.js';
import * as commentController from '../controllers/comment.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// Routes pour les posts
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

router.post(
  '/',
  authMiddleware,
  [
    body('title').isLength({ min: 5, max: 100 }),
    body('content').isLength({ min: 20, max: 5000 }),
  ],
  postController.createPost
);

router.put(
  '/:id',
  authMiddleware,
  [
    body('title').isLength({ min: 5, max: 100 }),
    body('content').isLength({ min: 20, max: 5000 }),
  ],
  postController.updatePost
);

router.delete('/:id', authMiddleware, postController.deletePost);

// Routes imbriquées pour les commentaires d'un post
router.get('/:postId/comments', commentController.getCommentsForPost);

router.post(
  '/:postId/comments',
  authMiddleware,
  [
    body('content').isLength({ min: 5, max: 1000 }),
  ],
  commentController.createComment
);

export default router;