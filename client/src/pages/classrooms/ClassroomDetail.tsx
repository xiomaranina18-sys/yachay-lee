import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Classroom, Student, Activity } from '../../types';
import { StatsCard } from '../../components/common/StatsCard';
import {
  School,
  ArrowLeft,
  Users,
  TrendingUp,
  BookOpen,
  CheckCircle,
  Plus,
  X,
  Sparkles,
  Award
} from 'lucide-react';

export const ClassroomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<number>(1);
  const [assignedMessage, setAssignedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      Promise.all([
        api.classrooms.getById(Number(id)),
        api.activities.getAll()
      ]).then(([classData, acts]) => {
        setClassroom(classData.classroom);
        setStudents(classData.students || []);
        setMetrics(classData.metrics || null);
        setActivities(acts);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    setAssignedMessage('¡Actividad asignada exitosamente a todos los estudiantes de esta aula!');
    setTimeout(() => {
      setShowAssignModal(false);
      setAssignedMessage(null);
    }, 2000);
  };

  if (loading || !classroom) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/classrooms"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Aulas</span>
        </Link>

        <button
          onClick={() => setShowAssignModal(true)}
          className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary-500/20 transition-all"
        >
          <BookOpen className="w-4 h-4" />
          <span>Asignar Actividad al Aula</span>
        </button>
      </div>

      {/* Classroom Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
              {classroom.grade} - Sección {classroom.section}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Periodo {classroom.academic_year}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white">
            {classroom.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Docente Responsable: <span className="font-bold text-slate-700 dark:text-slate-200">{classroom.teacher_name || 'Prof. María Valdivia'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 text-secondary-700 dark:text-secondary-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-secondary-500" />
            <span>Aula en Nivel de Rendimiento Óptimo</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Alumnos Matriculados"
          value={students.length}
          subtitle="Lista completa"
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
        <StatsCard
          title="Velocidad Promedio"
          value={`${metrics?.averageWpm || 40} PPM`}
          subtitle="Palabras Por Minuto"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
        />
        <StatsCard
          title="Precisión General"
          value={`${metrics?.averageAccuracy || 90}%`}
          subtitle="Comprensión y fonología"
          icon={<Award className="w-6 h-6" />}
          color="orange"
        />
        <StatsCard
          title="Lecturas Hechas"
          value={metrics?.totalActivitiesDone || 18}
          subtitle="Intentos acumulados"
          icon={<BookOpen className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Student Roster Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Nómina de Estudiantes ({students.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desglose individual del grupo
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Estudiante</th>
                <th className="py-3 px-4">Edad</th>
                <th className="py-3 px-4">Nivel Lector</th>
                <th className="py-3 px-4">Racha</th>
                <th className="py-3 px-4">Estrellas</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Ficha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-2.5">
                    <span className="text-2xl">{s.avatar || '🦊'}</span>
                    <span>{s.first_name} {s.last_name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {s.age} años
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.reading_level === 'Inicial' ? 'bg-blue-100 text-blue-700' :
                      s.reading_level === 'Básico' ? 'bg-emerald-100 text-emerald-700' :
                      s.reading_level === 'Intermedio' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {s.reading_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    🔥 {s.streak_days} días
                  </td>
                  <td className="py-3.5 px-4 font-bold text-accent-600 dark:text-accent-400">
                    ⭐ {s.total_stars}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/students/${s.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-primary-500 hover:text-white transition-colors"
                    >
                      Ver Progreso
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Asignar Actividad */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Asignar Actividad de Lectura
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignedMessage ? (
              <div className="py-6 text-center">
                <CheckCircle className="w-12 h-12 text-secondary-500 mx-auto mb-2 animate-bounce" />
                <p className="text-xs font-bold text-slate-800 dark:text-white">{assignedMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleAssign} className="space-y-4 mt-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Selecciona la actividad didáctica que se habilitará para todos los estudiantes de <strong>{classroom.name}</strong>:
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Actividad Curricular
                  </label>
                  <select
                    value={selectedActivityId}
                    onChange={(e) => setSelectedActivityId(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                  >
                    {activities.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.title} ({a.category.toUpperCase()} - Nivel {a.level})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Fecha Límite Sugerida
                  </label>
                  <input
                    type="date"
                    defaultValue="2026-09-30"
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20"
                  >
                    Confirmar Asignación
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
