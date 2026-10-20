import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, ProgressAttempt, AIEvaluation } from '../../types';
import { exportService } from '../../services/exportService';
import {
  HeartHandshake,
  Flame,
  Star,
  Clock,
  Award,
  Download,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ParentDashboard: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [attempts, setAttempts] = useState<ProgressAttempt[]>([]);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load student 1 (Mateo Huamán) linked to parent Elena Morales
    api.students.getById(1).then(data => {
      setStudent(data.student);
      setAttempts(data.recentAttempts);
      setAiEvaluation(data.aiEvaluation);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleDownloadPDF = () => {
    if (student) {
      exportService.generateStudentPDF(student, attempts, aiEvaluation);
    }
  };

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Parent Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-primary-500 to-accent-500 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Portal de la Familia Lectora</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Acompañando a {student.first_name} en su lectura
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Descubre su avance diario, fortalezas, recomendaciones pedagógicas para el hogar y actividades compartidas.
          </p>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2.5 rounded-xl bg-white text-primary-600 font-bold text-xs hover:bg-blue-50 transition-all shadow-md flex items-center gap-2 self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Informe PDF</span>
        </button>
      </div>

      {/* Child Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent-100 dark:bg-accent-900/40 text-accent-600 flex items-center justify-center text-3xl">
            {student.avatar || '🦊'}
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Nivel Lector</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{student.reading_level}</h3>
            <span className="text-[11px] font-semibold text-secondary-600 dark:text-secondary-400">
              En progreso hacia Intermedio
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/40 text-orange-500 flex items-center justify-center">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Racha de Lectura</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{student.streak_days} Días Seguidos</h3>
            <span className="text-[11px] text-slate-400">¡Hábito lector constante!</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-500 flex items-center justify-center">
            <Star className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Estrellas Ganadas</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{student.total_stars} ⭐</h3>
            <span className="text-[11px] text-slate-400">Recompensas educativas</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Lectura Semanal</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">85 Minutos</h3>
            <span className="text-[11px] font-semibold text-secondary-600 dark:text-secondary-400">85% de la meta (100 min)</span>
          </div>
        </div>
      </div>

      {/* Recommendations & Reading Tips for Home */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Home Reading Tips Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-accent-100 dark:bg-accent-900/40 text-accent-600">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Recomendaciones Educativas para el Hogar
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sugerencias personalizadas generadas por el docente y la IA Yachay
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {aiEvaluation?.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 dark:text-secondary-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {rec}
                  </p>
                </div>
              </div>
            ))}

            <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 mt-4">
              <p className="text-xs font-bold text-primary-800 dark:text-primary-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary-500" />
                Consejo de la Semana: La Lectura en Pareja
              </p>
              <p className="text-xs text-primary-700 dark:text-primary-300 mt-1 leading-relaxed">
                Toma turnos para leer párrafos con tu hijo. Señalen las palabras con el dedo índice y festejen cada oración completada para reforzar su autoestima lectora.
              </p>
            </div>
          </div>
        </div>

        {/* Child's Strengths & Level Overview (1 Col) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">
                  Logros y Fortalezas
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Habilidades consolidadas
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {aiEvaluation?.strengths.map((str, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-secondary-500 flex-shrink-0 mt-0.5" />
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 mt-6">
            <Link
              to="/activities"
              className="w-full py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-primary-500/20 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Practicar Lectura Juntos</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Recent Reading Sessions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 dark:text-white mb-1">
          Últimas Lecturas Completadas por {student.first_name}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Registro detallado de aciertos y tiempo dedicado
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Actividad</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Puntuación</th>
                <th className="py-3 px-4">Precisión</th>
                <th className="py-3 px-4">Velocidad</th>
                <th className="py-3 px-4 rounded-r-xl">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">
                    {att.activity_title}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {att.activity_category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-accent-600 dark:text-accent-400">
                    {att.score} / {att.max_score} pts
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">
                    {Math.round(att.accuracy_percentage)}%
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {att.words_per_minute > 0 ? `${att.words_per_minute} PPM` : 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                    {new Date(att.completed_at).toLocaleDateString('es-PE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
