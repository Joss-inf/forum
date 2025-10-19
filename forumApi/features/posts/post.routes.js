import { Router } from 'ultimate-express';
import * as postController from './post.controller.js';
import * as commentController from '../comments/comment.controller.js';
import { authMiddleware,csrfMiddleware } from '../../middleware/index.js';
import { validatePost, validateComment } from '../../validators/index.js';

const router = Router();

router

.get('/', postController.getAllPosts)
.get('/:id', postController.getPostById)
.post('/',authMiddleware,csrfMiddleware,validatePost,postController.createPost)
.put('/:id',authMiddleware,csrfMiddleware,validatePost,postController.updatePost)
.delete('/:id', authMiddleware,csrfMiddleware, postController.deletePost)

// Routes imbriquées pour les commentaires d'un post
.get('/:postId/comments', commentController.getCommentsForPost)
.post('/:postId/comments',authMiddleware,validateComment,commentController.createComment);

export default router;