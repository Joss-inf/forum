import { Router } from 'ultimate-express';
import { getPing}  from './ping.controller.js'

const router = Router();
router.get('/', getPing)
export default router;