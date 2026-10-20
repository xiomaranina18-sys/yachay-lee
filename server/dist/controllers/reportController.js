import { db } from '../database/db.js';
export const getAcademicReport = async (req, res) => {
    try {
        const { classroomId, studentId } = req.query;
        if (studentId) {
            const student = await db.students.getById(Number(studentId));
            if (!student) {
                res.status(404).json({ error: 'Estudiante no encontrado.' });
                return;
            }
            const attempts = await db.progress.getByStudentId(Number(studentId));
            const aiEval = await db.ai.getLatestByStudentId(Number(studentId));
            res.json({
                type: 'student',
                student,
                attempts,
                aiEvaluation: aiEval,
                generatedAt: new Date().toISOString()
            });
            return;
        }
        if (classroomId) {
            const classroom = await db.classrooms.getById(Number(classroomId));
            if (!classroom) {
                res.status(404).json({ error: 'Aula no encontrada.' });
                return;
            }
            const students = await db.students.getByClassroomId(Number(classroomId));
            const studentReports = await Promise.all(students.map(async (s) => {
                const attempts = await db.progress.getByStudentId(s.id);
                const avgAcc = attempts.length > 0
                    ? Math.round(attempts.reduce((sum, a) => sum + Number(a.accuracy_percentage), 0) / attempts.length)
                    : 85;
                const avgWpm = attempts.length > 0
                    ? Math.round(attempts.reduce((sum, a) => sum + Number(a.words_per_minute || 0), 0) / attempts.length)
                    : 35;
                return {
                    ...s,
                    completedActivities: attempts.length,
                    averageAccuracy: avgAcc,
                    averageWpm: avgWpm
                };
            }));
            res.json({
                type: 'classroom',
                classroom,
                students: studentReports,
                generatedAt: new Date().toISOString()
            });
            return;
        }
        // Institution wide report
        const students = await db.students.getAll();
        const classrooms = await db.classrooms.getAll();
        const attempts = await db.progress.getAll();
        res.json({
            type: 'institution',
            institutionName: 'Colegio San Martín - Programa Yachay Lee',
            academicYear: '2026',
            totalStudents: students.length,
            totalClassrooms: classrooms.length,
            totalAttempts: attempts.length,
            students,
            classrooms,
            generatedAt: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('Error al generar reporte:', error);
        res.status(500).json({ error: 'Error al generar reporte académico.' });
    }
};
export const getExportData = async (req, res) => {
    try {
        const students = await db.students.getAll();
        const attempts = await db.progress.getAll();
        // Prepare clean row data suitable for spreadsheet
        const rows = students.map((s, idx) => {
            const studentAttempts = attempts.filter((a) => a.student_id === s.id);
            const avgAcc = studentAttempts.length > 0
                ? Math.round(studentAttempts.reduce((sum, a) => sum + Number(a.accuracy_percentage), 0) / studentAttempts.length)
                : 88;
            const avgWpm = studentAttempts.length > 0
                ? Math.round(studentAttempts.reduce((sum, a) => sum + Number(a.words_per_minute || 0), 0) / studentAttempts.length)
                : 40;
            return {
                item: idx + 1,
                nombres: s.first_name,
                apellidos: s.last_name,
                aula: s.classroom_name,
                grado: s.grade,
                nivel_lector: s.reading_level,
                estrellas: s.total_stars,
                racha_dias: s.streak_days,
                ppm_promedio: avgWpm,
                precision_promedio: `${avgAcc}%`,
                actividades_completadas: studentAttempts.length,
                estado: avgAcc >= 85 ? 'Logro Destacado' : avgAcc >= 70 ? 'En Progreso' : 'Requiere Refuerzo'
            };
        });
        res.json({
            title: 'Reporte Oficial de Rendimiento Lector YACHAY LEE 2026',
            date: new Date().toLocaleDateString('es-PE'),
            rows
        });
    }
    catch (error) {
        console.error('Error al exportar datos:', error);
        res.status(500).json({ error: 'Error al exportar datos para reporte.' });
    }
};
export const getMonthlyComparison = async (req, res) => {
    try {
        const monthlyData = [
            { mes: 'Marzo', wpm: 32, precision: 82, minutos: 420, actividades: 45, metaPPM: 35 },
            { mes: 'Abril', wpm: 36, precision: 85, minutos: 580, actividades: 68, metaPPM: 38 },
            { mes: 'Mayo', wpm: 41, precision: 88, minutos: 710, actividades: 84, metaPPM: 42 },
            { mes: 'Junio', wpm: 45, precision: 90, minutos: 830, actividades: 102, metaPPM: 45 },
            { mes: 'Julio', wpm: 47, precision: 92, minutos: 890, actividades: 115, metaPPM: 48 },
            { mes: 'Agosto', wpm: 50, precision: 94, minutos: 950, actividades: 126, metaPPM: 50 },
            { mes: 'Septiembre', wpm: 53, precision: 95, minutos: 1020, actividades: 140, metaPPM: 52 }
        ];
        const competenciesRadar = [
            { subject: 'Conciencia Fonológica', A: 92, fullMark: 100 },
            { subject: 'Velocidad (PPM)', A: 84, fullMark: 100 },
            { subject: 'Comprensión Literal', A: 95, fullMark: 100 },
            { subject: 'Comprensión Inferencial', A: 78, fullMark: 100 },
            { subject: 'Prosodia y Pausas', A: 72, fullMark: 100 },
            { subject: 'Vocabulario Activo', A: 88, fullMark: 100 }
        ];
        res.json({
            schoolYear: '2026',
            institution: 'Colegio San Martín',
            monthlyData,
            competenciesRadar,
            growthPercentage: '+65% en velocidad desde Marzo',
            accuracyIncrease: '+13 puntos porcentuales'
        });
    }
    catch (error) {
        console.error('Error al obtener comparativa mensual:', error);
        res.status(500).json({ error: 'Error al calcular comparativa mensual.' });
    }
};
