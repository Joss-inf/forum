import { Router } from 'ultimate-express';
import * as  TagController  from './tags.controller.js';

const router = Router();

router
.post('/', TagController.createTag)
.get('/', TagController.getAllTags)
.get('/:id', TagController.getTagById)
.put('/:id', TagController.updateTag)
.delete('/:id', TagController.deleteTag);

export default router;