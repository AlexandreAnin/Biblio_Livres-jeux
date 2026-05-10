import { Router } from 'express';
import {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from '../controllers/characters.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Toutes les routes sont protégées
router.use(authMiddleware);

router.get('/', getCharacters);
router.get('/:id', getCharacter);
router.post('/', createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;