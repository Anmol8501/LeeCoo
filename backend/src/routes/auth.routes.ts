import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh', AuthController.refresh);

// Protected routes
router.get('/profile', authenticateJWT, AuthController.profile);
router.patch('/profile', authenticateJWT, AuthController.updateProfile);
router.put('/password', authenticateJWT, AuthController.changePassword);
router.post('/logout', authenticateJWT, AuthController.logout);

export default router;
