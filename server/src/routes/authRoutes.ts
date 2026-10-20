import { Router } from 'express';
import { login, register, getMe, recoverPassword, resetPassword } from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', verifyToken, getMe);
router.post('/recover-password', recoverPassword);
router.post('/reset-password', resetPassword);

export default router;
