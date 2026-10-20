import { Router } from 'express';
import { getAcademicReport, getExportData, getMonthlyComparison } from '../controllers/reportController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/academic', verifyToken, getAcademicReport);
router.get('/export-data', verifyToken, getExportData);
router.get('/monthly-comparison', verifyToken, getMonthlyComparison);
export default router;
