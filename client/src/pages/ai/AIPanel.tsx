import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Student, AIEvaluation, Activity } from '../../types';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cpu,
  RefreshCw
} from 'lucide-react';

export const AIPanel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialStudentId = Number(searchParams.get('studentId')) || 1;

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(initialStudentId);
  const [evaluation, setEvaluation] = useState<AIEvaluation | null>(null);
  const [suggestedLevel, setSuggestedLevel] = useState<string>('Básico');
  const [adaptiveActivity, setAdaptiveActivity] = useState<Activity | null>(null);
  const [aiEngine, setAiEngine] = useState<string>('Motor Pedagógico Heurístico Yachay IA');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.students.getAll().then(setStudents);
  }, []);

  const runAnalysis = async (studentId: number) => {
    setLoading(true);
    try {
      const [diagRes, recRes] = await Promise.all([
        api.ai.diagnose(studentId),
        api.ai.getRecommendation(studentId)
      ]);
      setEvaluation(diagRes.evaluation);
      setSuggestedLevel(diagRes.suggestedLevel);
      setAiEngine(diagRes.aiEngine);
      setAdaptiveActivity(recRes.recommendedActivity);
    } catch (err) {
      console.error('Error al ejecutar diagnóstico IA:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudentId) {
      runAnalysis(selectedStudentId);
    }
  }, [selectedStudentId]);

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6">
      
      {/* AI Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-700 via-indigo-600 to-secondary-600 p-6 sm:p-8 text-white shadow-xl shadow-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Módulo de Inteligencia Artificial Pedagógica</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Diagnóstico Lector y Adaptabilidad IA
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 mt-1 max-w-xl">
            Análisis profundo de velocidad lectora (WPM), precisión fonológica, detección temprana de dificultades y plan de intervención individual.
          </p>
        </div>

        {/* Student Selector */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(Number(e.target.value))}
            className="px-4 py-2.5 rounded-xl bg-white text-slate-800 font-bold text-xs shadow-md border-0 focus:ring-2 focus:ring-primary-300 outline-none cursor-pointer"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.first_name} {s.last_name} ({s.reading_level})
              </option>
            ))}
          </select>

          <button
            onClick={() => runAnalysis(selectedStudentId)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Volver a analizar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
            Analizando patrones de decodificación y comprensión con IA...
          </p>
        </div>
      ) : evaluation ? (
        <div className="space-y-6">
          
          {/* AI Metrics Overview Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center text-xl font-black">
                ⚡
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Velocidad Evaluada</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
                  {evaluation.words_per_minute} PPM
                </h3>
                <span className="text-[11px] text-primary-600 font-semibold">Palabras Por Minuto</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 flex items-center justify-center text-xl font-black">
                🎯
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Precisión Fonológica</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
                  {evaluation.accuracy}%
                </h3>
                <span className="text-[11px] text-secondary-600 font-semibold">Tasa de acierto de lectura</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/40 text-accent-600 flex items-center justify-center text-xl font-black">
                🧠
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Comprensión Global</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">
                  {evaluation.comprehension_score}%
                </h3>
                <span className="text-[11px] text-accent-600 font-semibold">Nivel Literal e Inferencial</span>
              </div>
            </div>
          </div>

          {/* Detailed Diagnosis: Strengths & Difficulties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Fortalezas Detectadas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Competencias consolidadas por el estudiante
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {evaluation.strengths.map((str, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-secondary-50/70 dark:bg-secondary-950/30 border border-secondary-100 dark:border-secondary-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="text-secondary-600 font-bold">✓</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulties */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Dificultades y Alertas Tempranas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aspectos fonológicos y de velocidad a reforzar
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {evaluation.difficulties.map((dif, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="text-rose-600 font-bold">!</span>
                    <span>{dif}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recommendations & Action Plan */}
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Plan de Intervención y Recomendaciones Personalizadas
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estrategias didácticas sugeridas para el docente en el aula y la familia en casa
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              <span className="font-bold text-primary-600 dark:text-primary-400 block mb-1">
                Resumen Ejecutivo Pedagógico:
              </span>
              {evaluation.pedagogical_action_plan}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {evaluation.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-primary-100 dark:border-primary-900 bg-primary-50/40 dark:bg-primary-950/20 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed"
                >
                  <span className="inline-block px-2 py-0.5 rounded-md bg-primary-500 text-white font-bold text-[10px] mb-2">
                    Paso {i + 1}
                  </span>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Next Activity Card */}
          {adaptiveActivity && (
            <div className="rounded-3xl bg-gradient-to-r from-accent-500 to-orange-600 p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                  🎯 Zona de Desarrollo Próximo (ZDP)
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2">
                  Actividad Adaptada Sugerida: {adaptiveActivity.title}
                </h3>
                <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl">
                  {adaptiveActivity.description}
                </p>
              </div>

              <Link
                to={`/activities/${adaptiveActivity.id}`}
                className="px-6 py-3 rounded-2xl bg-white text-orange-600 font-extrabold text-xs sm:text-sm hover:bg-orange-50 active:scale-95 transition-all shadow-md flex items-center gap-2 whitespace-nowrap self-start md:self-auto"
              >
                <BookOpen className="w-4 h-4" />
                <span>Ejecutar Actividad Recomendada</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Engine attribution */}
          <div className="text-center text-[11px] text-slate-400">
            Motor de Inteligencia Artificial activo: <span className="font-semibold text-slate-600 dark:text-slate-300">{aiEngine}</span>
          </div>

        </div>
      ) : (
        <div className="py-16 text-center text-xs text-slate-400">
          No hay datos disponibles para el estudiante seleccionado.
        </div>
      )}

    </div>
  );
};
