import { Router } from 'express';
import {
  getSaves,
  createSave,
  updateSave,
} from '../controllers/saves.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

router.get('/', getSaves);
router.post('/', createSave);
router.put('/:id', updateSave);

export default router;