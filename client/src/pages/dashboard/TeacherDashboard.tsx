import React, { useState, useEffect } from 'react';
import { StatsCard } from '../../components/common/StatsCard';
import { api } from '../../services/api';
import { Student, Classroom } from '../../types';
import { Users, TrendingUp, CheckCircle, AlertTriangle, Plus, BrainCircuit, Sparkles, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState<number>(1);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.classrooms.getAll().then(cls => {
      setClassrooms(cls);
      if (cls.length > 0) {
        setSelectedClassroomId(cls[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedClassroomId) {
      setLoading(true);
      api.students.getAll(selectedClassroomId)
        .then(data => {
          setStudents(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [selectedClassroomId]);

  const currentClassroom = classrooms.find(c => c.id === selectedClassroomId) || classrooms[0];

  return (
    <div className="space-y-6">
      
      {/* Teacher Top Header */}
      <div className="rounded-3xl bg-gradient-to-r from-secondary-600 via-secondary-500 to-primary-600 p-6 sm:p-8 text-white shadow-xl shadow-secondary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal del Docente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gestión Pedagógica y Aulas
          </h1>
          <p className="text-xs sm:text-sm text-secondary-100 mt-1 max-w-xl">
            Seguimiento de fluidez, asignación de actividades fonológicas y diagnóstico individualizado con IA.
          </p>
        </div>

        {/* Classroom Filter Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedClassroomId}
            onChange={(e) => setSelectedClassroomId(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-800 font-bold text-xs shadow-md border-0 focus:ring-2 focus:ring-secondary-300 outline-none cursor-pointer"
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Classroom Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Estudiantes del Aula"
          value={students.length}
          subtitle="Matriculados en 2026"
          icon={<Users className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Fluidez Media Aula"
          value="42 PPM"
          subtitle="Palabras Por Minuto"
          icon={<TrendingUp className="w-6 h-6" />}
          color="blue"
          trend={{ value: '+5 PPM este mes', positive: true }}
        />
        <StatsCard
          title="Actividades Hechas"
          value="24"
          subtitle="Esta semana"
          icon={<CheckCircle className="w-6 h-6" />}
          color="orange"
        />
        <StatsCard
          title="Alertas Tempranas"
          value="1 Alumno"
          subtitle="Requiere refuerzo fonológico"
          icon={<AlertTriangle className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Early Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
            ⚠️
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              Alerta de Dificultad Fonológica Detectada por IA
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
              Thiago Flores muestra vacilación en sílabas trabadas y velocidad de 28 PPM. Se sugiere plan de refuerzo.
            </p>
          </div>
        </div>
        <Link
          to="/ai?studentId=3"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Ver Diagnóstico IA</span>
        </Link>
      </div>

      {/* Students List for Selected Classroom */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Lista de Estudiantes - {currentClassroom?.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monitoreo del nivel lector, velocidad y estrellas de recompensa
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/activities"
              className="px-3.5 py-2 rounded-xl bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-secondary-500/20"
            >
              <BookOpen className="w-4 h-4" />
              <span>Asignar Lecturas</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Cargando estudiantes...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Estudiante</th>
                  <th className="py-3 px-4">Edad</th>
                  <th className="py-3 px-4">Nivel Lector</th>
                  <th className="py-3 px-4">Racha</th>
                  <th className="py-3 px-4">Estrellas</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{s.avatar || '🦊'}</span>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">{s.first_name} {s.last_name}</p>
                          <p className="text-[11px] text-slate-400">{s.grade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                      {s.age} años
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.reading_level === 'Inicial'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                          : s.reading_level === 'Básico'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : s.reading_level === 'Intermedio'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                      }`}>
                        {s.reading_level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                      🔥 {s.streak_days} días
                    </td>
                    <td className="py-3.5 px-4 text-accent-600 dark:text-accent-400 font-bold">
                      ⭐ {s.total_stars}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/ai?studentId=${s.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-900/60 text-primary-600 dark:text-primary-300 font-semibold flex items-center gap-1"
                          title="Diagnóstico IA"
                        >
                          <BrainCircuit className="w-3.5 h-3.5" />
                          <span>IA</span>
                        </Link>
                        <Link
                          to={`/students/${s.id}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-secondary-500 hover:text-white transition-colors"
                        >
                          Ficha
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
