import { Router } from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  getStudentHistory
} from '../controllers/studentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getStudents);
router.get('/:id', verifyToken, getStudentById);
router.get('/:id/history', verifyToken, getStudentHistory);
router.post('/', verifyToken, createStudent);
router.put('/:id', verifyToken, updateStudent);

export default router;
