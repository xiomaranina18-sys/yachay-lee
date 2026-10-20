import { Request, Response } from 'express';
import { db } from '../database/db.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getGamificationProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = Number(req.query.studentId) || 1;
    const student = await db.students.getById(studentId);

    const badges = await db.badges.getAll();
    const weeklyGoals = await db.weeklyGoals.getAll();
    const storeItems = await db.rewards.getAll();

    // XP calculation: each star is 10 XP
    const totalXP = (student ? student.total_stars : 160) * 10;
    const currentLevel = Math.floor(totalXP / 300) + 1;
    const xpInLevel = totalXP % 300;
    const nextLevelXP = 300;

    const titlesByLevel: Record<number, string> = {
      1: "Explorador de Vocales",
      2: "Cazador de Sílabas",
      3: "Aventurero de Palabras",
      4: "Maestro de Oraciones",
      5: "Lector Estrella",
      6: "Sabio de la Montaña"
    };

    const rankTitle = titlesByLevel[Math.min(currentLevel, 6)] || "Gran Maestro Lector";

    res.json({
      studentId,
      studentName: student ? `${student.first_name} ${student.last_name}` : 'Mateo Huamán',
      level: currentLevel,
      rankTitle,
      totalXP,
      xpInLevel,
      nextLevelXP,
      totalStars: student ? student.total_stars : 160,
      streakDays: student ? student.streak_days : 6,
      badges,
      weeklyGoals,
      storeItems
    });
  } catch (err: any) {
    console.error('Error al obtener perfil de gamificación:', err);
    res.status(500).json({ error: 'Error al consultar datos de gamificación.' });
  }
};

export const purchaseStoreItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemId, studentId } = req.body;
    if (!itemId || !studentId) {
      res.status(400).json({ error: 'Faltan parámetros de compra.' });
      return;
    }

    const result = await db.rewards.purchase(Number(itemId), Number(studentId));
    res.json({
      message: '¡Recompensa desbloqueada exitosamente!',
      ...result
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error al canjear recompensa.' });
  }
};

export const claimWeeklyGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { goalId, studentId } = req.body;
    const student = await db.students.getById(Number(studentId) || 1);
    if (!student) {
      res.status(404).json({ error: 'Estudiante no encontrado.' });
      return;
    }

    const goals = await db.weeklyGoals.getAll();
    const goal = goals.find(g => g.id === Number(goalId));
    if (!goal || !goal.completed) {
      res.status(400).json({ error: 'La meta aún no ha sido completada.' });
      return;
    }

    await db.students.update(student.id, {
      total_stars: (student.total_stars || 0) + goal.rewardStars
    });

    res.json({
      message: `¡Felicidades! Has reclamado +${goal.rewardStars} ⭐`,
      rewardStars: goal.rewardStars
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Error al reclamar recompensa de meta.' });
  }
};
