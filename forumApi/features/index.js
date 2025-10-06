// src/routes/index.js
import { Router } from 'ultimate-express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/user.routes.js';
import postRoutes from './posts/post.routes.js';
import tagRoutes from './tags/tags.routes.js';
import commentRoutes from './comments/comment.routes.js';
import pingRoutes from  './ping/ping.routes.js'

const router = Router();

router
.use('/auth', authRoutes)
.use('/users', userRoutes)
.use('/posts', postRoutes)
.use('/comments', commentRoutes)
.use('/ping', pingRoutes)
.use('/tags', tagRoutes);
export default router;