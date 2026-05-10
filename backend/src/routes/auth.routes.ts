import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
 
const router = Router();
 
// Routes publiques
router.post('/register', register);
router.post('/login', login);
 
// Routes protégées
router.get('/profile', authMiddleware, getProfile);
 
export default router;