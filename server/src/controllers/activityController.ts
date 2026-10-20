import { Request, Response } from 'express';
import { db } from '../database/db.js';

export const getActivities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, level } = req.query;
    const activities = await db.activities.getAll(category as string, level as string);
    res.json(activities);
  } catch (error: any) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ error: 'Error al consultar actividades de lectura.' });
  }
};

export const getActivityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const activity = await db.activities.getById(id);
    if (!activity) {
      res.status(404).json({ error: 'Actividad no encontrada.' });
      return;
    }
    res.json(activity);
  } catch (error: any) {
    console.error('Error al obtener actividad:', error);
    res.status(500).json({ error: 'Error al consultar la actividad.' });
  }
};

export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, level, description, content_json, points } = req.body;
    if (!title || !category || !level || !content_json) {
      res.status(400).json({ error: 'Título, categoría, nivel y contenido son obligatorios.' });
      return;
    }

    const newActivity = await db.activities.create({
      title,
      category,
      level,
      description: description || '',
      content_json,
      points: Number(points) || 20
    });

    res.status(201).json(newActivity);
  } catch (error: any) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ error: 'Error al registrar actividad.' });
  }
};
