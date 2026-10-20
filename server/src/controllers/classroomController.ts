import { Request, Response } from 'express';
import { db } from '../database/db.js';

export const getClassrooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { teacherId } = req.query;
    if (teacherId) {
      const classrooms = await db.classrooms.getByTeacherId(Number(teacherId));
      res.json(classrooms);
      return;
    }
    const classrooms = await db.classrooms.getAll();
    res.json(classrooms);
  } catch (error: any) {
    console.error('Error al obtener aulas:', error);
    res.status(500).json({ error: 'Error al consultar las aulas.' });
  }
};

export const getClassroomById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const classroom = await db.classrooms.getById(id);
    if (!classroom) {
      res.status(404).json({ error: 'Aula no encontrada.' });
      return;
    }

    const students = await db.students.getByClassroomId(id);

    // Calculate classroom metrics (average accuracy, WPM, total stars)
    let totalScore = 0;
    let totalAttempts = 0;
    let totalWpm = 0;
    let studentsEvaluated = 0;

    for (const student of students) {
      const attempts = await db.progress.getByStudentId(student.id);
      if (attempts.length > 0) {
        totalAttempts += attempts.length;
        const avgAcc = attempts.reduce((acc: number, cur: any) => acc + Number(cur.accuracy_percentage), 0) / attempts.length;
        const avgWpm = attempts.reduce((acc: number, cur: any) => acc + Number(cur.words_per_minute || 0), 0) / attempts.length;
        totalScore += avgAcc;
        totalWpm += avgWpm;
        studentsEvaluated++;
      }
    }

    const metrics = {
      totalStudents: students.length,
      averageAccuracy: studentsEvaluated > 0 ? Math.round(totalScore / studentsEvaluated) : 85,
      averageWpm: studentsEvaluated > 0 ? Math.round(totalWpm / studentsEvaluated) : 38,
      totalActivitiesDone: totalAttempts
    };

    res.json({
      classroom,
      students,
      metrics
    });
  } catch (error: any) {
    console.error('Error al obtener detalle del aula:', error);
    res.status(500).json({ error: 'Error al obtener datos del aula.' });
  }
};

export const createClassroom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, grade, section, teacher_id, academic_year } = req.body;
    if (!name || !grade || !section) {
      res.status(400).json({ error: 'Nombre, grado y sección son obligatorios.' });
      return;
    }

    const newClassroom = await db.classrooms.create({
      name,
      grade,
      section,
      teacher_id: Number(teacher_id) || 2,
      academic_year: academic_year || '2026'
    });

    res.status(201).json(newClassroom);
  } catch (error: any) {
    console.error('Error al crear aula:', error);
    res.status(500).json({ error: 'Error al registrar aula.' });
  }
};
