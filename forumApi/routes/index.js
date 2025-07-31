// src/routes/index.js
import { Router } from 'ultimate-express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import postRoutes from './post.routes.js';
import commentRoutes from './comment.routes.js';
import pingRoutes from  './ping.routes.js'
const router = Router();

// Association de chaque routeur à son chemin de base
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/ping',pingRoutes)
export default router;