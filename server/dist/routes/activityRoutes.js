import { Router } from 'express';
import { getActivities, getActivityById, createActivity } from '../controllers/activityController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', verifyToken, getActivities);
router.get('/:id', verifyToken, getActivityById);
router.post('/', verifyToken, createActivity);
export default router;
