import { Router } from 'express';
import { getClassrooms, getClassroomById, createClassroom } from '../controllers/classroomController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', verifyToken, getClassrooms);
router.get('/:id', verifyToken, getClassroomById);
router.post('/', verifyToken, createClassroom);
export default router;
