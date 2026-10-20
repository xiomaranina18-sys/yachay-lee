import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Student, ProgressAttempt, AIEvaluation } from '../../types';
import { exportService } from '../../services/exportService';
import {
  ArrowLeft,
  Download,
  BrainCircuit,
  Star,
  Flame,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [attempts, setAttempts] = useState<ProgressAttempt[]>([]);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.students.getById(Number(id))
        .then(data => {
          setStudent(data.student);
          setAttempts(data.recentAttempts || []);
          setAiEvaluation(data.aiEvaluation || null);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

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

  // Chart data from attempts
  const evolutionData = attempts
    .slice()
    .reverse()
    .map((att, idx) => ({
      index: `#${idx + 1}`,
      wpm: att.words_per_minute || 30,
      precision: Math.round(att.accuracy_percentage),
      actividad: att.activity_title
    }));

  const avgWpm = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.words_per_minute || 0), 0) / attempts.length)
    : 45;

  const avgAcc = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + Number(a.accuracy_percentage), 0) / attempts.length)
    : 90;

  return (
    <div className="space-y-6">
      
      {/* Back button & top bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la lista de estudiantes</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={`/ai?studentId=${student.id}`}
            className="px-3.5 py-2 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-300 font-bold text-xs flex items-center gap-1.5 hover:bg-primary-100 transition-colors border border-primary-200 dark:border-primary-800"
          >
            <BrainCircuit className="w-4 h-4 text-primary-500" />
            <span>Diagnóstico IA</span>
          </Link>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-primary-500/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Student Dossier Header Card */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 flex items-center justify-center text-5xl shadow-inner border border-accent-200 dark:border-accent-700/50">
            {student.avatar || '🦊'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">
                {student.first_name} {student.last_name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                student.reading_level === 'Inicial' ? 'bg-blue-100 text-blue-700' :
                student.reading_level === 'Básico' ? 'bg-emerald-100 text-emerald-700' :
                student.reading_level === 'Intermedio' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
              }`}>
                Nivel {student.reading_level}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Aula: <span className="font-semibold text-slate-700 dark:text-slate-300">{student.classroom_name}</span> • Grado: {student.grade} • Edad: {student.age} años
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 pt-4 md:pt-0 md:pl-6">
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Estrellas</p>
            <p className="text-xl font-extrabold text-accent-500 mt-0.5">⭐ {student.total_stars}</p>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Racha</p>
            <p className="text-xl font-extrabold text-orange-500 mt-0.5">🔥 {student.streak_days} d</p>
          </div>
          <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Lecturas</p>
            <p className="text-xl font-extrabold text-secondary-500 mt-0.5">📚 {attempts.length}</p>
          </div>
        </div>
      </div>

      {/* Metrics & Evolution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Evolución de Fluidez (PPM) y Precisión
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Progreso por cada intento realizado en el sistema
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                <span className="text-slate-600 dark:text-slate-300">PPM: {avgWpm}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary-500"></span>
                <span className="text-slate-600 dark:text-slate-300">Precisión: {avgAcc}%</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData.length > 0 ? evolutionData : [{ index: '#1', wpm: 35, precision: 88 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="index" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    border: 'none'
                  }}
                />
                <Line type="monotone" dataKey="wpm" name="Palabras/Min" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="precision" name="Precisión (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Diagnostic Snapshot (1 Col) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-primary-500" />
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Diagnóstico de IA
              </h3>
            </div>

            {aiEvaluation ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-800 dark:text-primary-200">
                  <p className="font-bold">Plan de Acción Pedagógico:</p>
                  <p className="mt-1 leading-relaxed">{aiEvaluation.pedagogical_action_plan}</p>
                </div>

                <div>
                  <p className="font-bold text-secondary-600 dark:text-secondary-400 mb-1">Fortalezas:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {aiEvaluation.strengths.slice(0, 2).map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-secondary-500 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-accent-600 dark:text-accent-400 mb-1">Áreas de Refuerzo:</p>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {aiEvaluation.difficulties.slice(0, 2).map((d, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-accent-500 flex-shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Aún no se ha generado diagnóstico de IA para este estudiante.
              </div>
            )}
          </div>

          <Link
            to={`/ai?studentId=${student.id}`}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-center font-bold text-xs transition-colors"
          >
            Ver Análisis Pedagógico Completo →
          </Link>
        </div>

      </div>

      {/* Reading Attempt History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">
          Historial Lector Completo
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Actividad</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Puntuación</th>
                <th className="py-3 px-4">Precisión</th>
                <th className="py-3 px-4">Velocidad</th>
                <th className="py-3 px-4">Duración</th>
                <th className="py-3 px-4 rounded-r-xl">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">
                    {att.activity_title}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {att.activity_category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-accent-600 dark:text-accent-400">
                    {att.score} / {att.max_score} pts
                  </td>
                  <td className="py-3 px-4 font-semibold text-secondary-600 dark:text-secondary-400">
                    {Math.round(att.accuracy_percentage)}%
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {att.words_per_minute > 0 ? `${att.words_per_minute} PPM` : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {att.time_spent_seconds} seg
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
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
