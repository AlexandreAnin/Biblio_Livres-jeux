import { Router } from 'express';
import { getPassage, createPassage } from '../controllers/passages.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Routes publiques
router.get('/:bookSlug/passages/:number', getPassage);

// Routes protégées (admin)
router.post('/:bookId/passages', authMiddleware, createPassage);

export default router;