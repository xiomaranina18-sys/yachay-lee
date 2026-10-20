import { Router } from 'express';
import { getGamificationProfile, purchaseStoreItem, claimWeeklyGoal } from '../controllers/gamificationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/profile', verifyToken, getGamificationProfile);
router.post('/purchase', verifyToken, purchaseStoreItem);
router.post('/claim-goal', verifyToken, claimWeeklyGoal);

export default router;
