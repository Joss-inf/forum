import { Router } from 'ultimate-express';
import * as  TagController  from './tags.controller.js';
import { authMiddleware,csrfMiddleware } from '../../middleware/index.js';

const router = Router();

router

.get('/', TagController.getAllTags)
.get('/:id', TagController.getTagById)
.post('/', authMiddleware, csrfMiddleware, TagController.createTag)
.put('/:id', authMiddleware, csrfMiddleware, TagController.updateTag)
.delete('/:id', authMiddleware, csrfMiddleware, TagController.deleteTag);

export default router;