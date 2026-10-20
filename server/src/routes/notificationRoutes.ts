import { Router, Response } from 'express';
import { db } from '../database/db.js';
import { verifyToken, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'No autorizado' });
      return;
    }
    const notifs = await db.notifications.getByUserId(req.user.id);
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener notificaciones.' });
  }
});

export default router;
