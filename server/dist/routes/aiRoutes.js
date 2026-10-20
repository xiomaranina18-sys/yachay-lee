import { Router } from 'express';
import { diagnoseStudent, getAdaptiveRecommendation } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/diagnose/:studentId', verifyToken, diagnoseStudent);
router.get('/recommend/:studentId', verifyToken, getAdaptiveRecommendation);
export default router;
