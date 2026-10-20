import { Router } from 'express';
import { getBooks, getBookById, toggleFavorite } from '../controllers/libraryController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, getBooks);
router.get('/:id', verifyToken, getBookById);
router.post('/:id/favorite', verifyToken, toggleFavorite);

export default router;
