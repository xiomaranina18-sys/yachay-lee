import { Request, Response } from 'express';
import { db } from '../database/db.js';

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classroomId } = req.query;
    if (classroomId) {
      const students = await db.students.getByClassroomId(Number(classroomId));
      res.json(students);
      return;
    }
    const students = await db.students.getAll();
    res.json(students);
  } catch (error: any) {
    console.error('Error al obtener estudiantes:', error);
    res.status(500).json({ error: 'Error al obtener lista de estudiantes.' });
  }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const student = await db.students.getById(id);
    if (!student) {
      res.status(404).json({ error: 'Estudiante no encontrado.' });
      return;
    }

    // Include recent history & AI diagnostic
    const attempts = await db.progress.getByStudentId(id);
    const aiEvaluation = await db.ai.getLatestByStudentId(id);

    res.json({
      student,
      recentAttempts: attempts.slice(0, 10),
      totalAttempts: attempts.length,
      aiEvaluation
    });
  } catch (error: any) {
    console.error('Error al obtener estudiante:', error);
    res.status(500).json({ error: 'Error al consultar la ficha del estudiante.' });
  }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { classroom_id, first_name, last_name, age, grade, reading_level, avatar } = req.body;

    if (!first_name || !last_name || !classroom_id) {
      res.status(400).json({ error: 'Nombres, apellidos y aula son requeridos.' });
      return;
    }

    const newStudent = await db.students.create({
      classroom_id: Number(classroom_id),
      first_name,
      last_name,
      age: Number(age) || 7,
      grade: grade || '1° Primaria',
      reading_level: reading_level || 'Inicial',
      avatar: avatar || '🦊'
    });

    res.status(201).json(newStudent);
  } catch (error: any) {
    console.error('Error al registrar estudiante:', error);
    res.status(500).json({ error: 'Error al crear estudiante.' });
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const updated = await db.students.update(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Estudiante no encontrado para actualizar.' });
      return;
    }
    res.json(updated);
  } catch (error: any) {
    console.error('Error al actualizar estudiante:', error);
    res.status(500).json({ error: 'Error al actualizar estudiante.' });
  }
};

export const getStudentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const attempts = await db.progress.getByStudentId(id);
    res.json(attempts);
  } catch (error: any) {
    console.error('Error al obtener historial lector:', error);
    res.status(500).json({ error: 'Error al obtener historial del estudiante.' });
  }
};
