import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Student, ProgressAttempt, AIEvaluation } from '../../types';
import { exportService } from '../../services/exportService';
import {
  HeartHandshake,
  Download,
  BookOpen,
  Sparkles,
  Flame,
  Star,
  Clock,
  CheckCircle2,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ParentPortal: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [attempts, setAttempts] = useState<ProgressAttempt[]>([]);
  const [aiEvaluation, setAiEvaluation] = useState<AIEvaluation | null>(null);
  const [loading, setLoading] = useState(true);

  // Home reading logger state
  const [loggedMinutes, setLoggedMinutes] = useState(15);
  const [loggedBook, setLoggedBook] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);

  useEffect(() => {
    // Parent Elena Morales -> Mateo Huamán (ID: 1)
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

  const handleLogReading = (e: React.FormEvent) => {
    e.preventDefault();
    setLogSuccess(true);
    setTimeout(() => {
      setLogSuccess(false);
      setLoggedBook('');
    }, 3000);
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
      
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-primary-600 to-secondary-500 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Portal de Padres de Familia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Seguimiento de {student.first_name} {student.last_name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Grado: {student.grade} • Aula: {student.classroom_name} • Nivel actual: {student.reading_level}
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

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center text-xl">
            ⭐
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Estrellas</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{student.total_stars}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 flex items-center justify-center text-xl">
            🔥
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Racha</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{student.streak_days} días</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center text-xl">
            ⚡
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Velocidad</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">48 PPM</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/40 text-secondary-600 flex items-center justify-center text-xl">
            🎯
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Precisión</p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">93%</p>
          </div>
        </div>
      </div>

      {/* Two Columns: Recommendations & Reading Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recommendations */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Guía de Apoyo Lector para Padres
            </h3>
          </div>

          <div className="space-y-3">
            {aiEvaluation?.recommendations.map((rec, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 text-xs text-secondary-800 dark:text-secondary-200">
            <span className="font-bold block mb-1">Nota de la Profesora María:</span>
            "Mateo está respondiendo de manera entusiasta a las historias andinas. Les animo a continuar leyendo juntos antes de dormir."
          </div>
        </div>

        {/* Log Home Reading Session */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary-500" />
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">
                Bitácora de Lectura en Casa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registra los minutos leídos en familia para sumar a su racha
              </p>
            </div>
          </div>

          {logSuccess ? (
            <div className="p-6 text-center bg-secondary-50 dark:bg-secondary-950/40 rounded-2xl border border-secondary-200 dark:border-secondary-800 animate-in zoom-in-95">
              <CheckCircle2 className="w-10 h-10 text-secondary-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-secondary-800 dark:text-secondary-200">
                ¡Lectura registrada con éxito!
              </p>
              <p className="text-[11px] text-secondary-600 dark:text-secondary-300 mt-1">
                Se han añadido {loggedMinutes} minutos y +10 ⭐ al perfil de Mateo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogReading} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título del Libro o Cuento Leído
                </label>
                <input
                  type="text"
                  required
                  value={loggedBook}
                  onChange={(e) => setLoggedBook(e.target.value)}
                  placeholder="Ej. El Principito / Paco Yunque"
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minutos Dedicados
                </label>
                <select
                  value={loggedMinutes}
                  onChange={(e) => setLoggedMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
                >
                  <option value={10}>10 Minutos</option>
                  <option value={15}>15 Minutos (Recomendado)</option>
                  <option value={20}>20 Minutos</option>
                  <option value={30}>30 Minutos</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20 transition-all"
              >
                Guardar Lectura Compartida
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Link
              to="/activities"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Abrir Biblioteca de Cuentos</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
