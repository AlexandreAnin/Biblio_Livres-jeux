import { Router } from 'express';
import { getBooks, getBookBySlug, createBook } from '../controllers/books.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Routes publiques
router.get('/', getBooks);
router.get('/:slug', getBookBySlug);

// Routes protégées (admin)
router.post('/', authMiddleware, createBook);

export default router;