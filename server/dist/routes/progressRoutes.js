import { Router } from 'express';
import { recordAttempt, getStudentProgress, getDashboardStats } from '../controllers/progressController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/attempt', verifyToken, recordAttempt);
router.get('/student/:studentId', verifyToken, getStudentProgress);
router.get('/stats/dashboard', verifyToken, getDashboardStats);
export default router;
