import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { exportService } from '../../services/exportService';
import { Student, Classroom } from '../../types';
import {
  FileSpreadsheet,
  Download,
  FileText,
  TrendingUp,
  Award,
  Users,
  School,
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    Promise.all([
      api.students.getAll(),
      api.classrooms.getAll()
    ]).then(([studs, cls]) => {
      setStudents(studs);
      setClassrooms(cls);
      if (studs.length > 0) setSelectedStudentId(studs[0].id);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleExportExcel = async () => {
    setExportingExcel(true);
    try {
      const data = await api.reports.getExportData();
      exportService.generateExcelReport(data.rows, `YachayLee_Reporte_General_${new Date().getFullYear()}.xlsx`);
    } catch (e) {
      alert('Error al exportar Excel');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleExportIndividualPDF = async () => {
    setExportingPDF(true);
    try {
      const studentData = await api.students.getById(selectedStudentId);
      exportService.generateStudentPDF(
        studentData.student,
        studentData.recentAttempts,
        studentData.aiEvaluation
      );
    } catch (e) {
      alert('Error al exportar PDF');
    } finally {
      setExportingPDF(false);
    }
  };

  const chartData = [
    { grado: '1° Primaria', wpm: 38, precision: 88, color: '#2563EB' },
    { grado: '2° Primaria', wpm: 56, precision: 94, color: '#10B981' },
    { grado: 'Promedio Inst.', wpm: 47, precision: 91, color: '#F97316' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 p-6 sm:p-8 text-white shadow-xl shadow-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Módulo de Reportes Oficiales e Inteligencia de Datos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Generación y Exportación de Reportes
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 mt-1 max-w-xl">
            Descarga certificados de rendimiento, fichas evaluativas en PDF y hojas de cálculo para la administración escolar.
          </p>
        </div>

        {/* Global Export Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="px-4 py-2.5 rounded-xl bg-white text-secondary-600 font-bold text-xs hover:bg-secondary-50 transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{exportingExcel ? 'Generando...' : 'Exportar Excel (.xlsx)'}</span>
          </button>
        </div>
      </div>

      {/* Two Column Grid: Individual PDF Generator & Comparative Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* PDF Individual Generator */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-primary-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Reporte Académico Individual (PDF Membretado)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Genera la cartilla oficial con membrete de YACHAY LEE, diagnóstico de IA, desglose de competencias y firma pedagógica.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Seleccionar Estudiante:
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.first_name} {s.last_name} • {s.grade} ({s.reading_level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Formato:</span>
                  <span className="font-bold text-slate-800 dark:text-white">PDF Estándar A4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Incluye:</span>
                  <span className="font-bold text-secondary-600">Diagnóstico IA + Tabla de Intentos</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Membrete:</span>
                  <span className="font-bold text-primary-600">Institucional Yachay Lee</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportIndividualPDF}
            disabled={exportingPDF}
            className="mt-6 w-full py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-extrabold text-xs shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{exportingPDF ? 'Creando Documento...' : 'Descargar Informe del Estudiante (PDF)'}</span>
          </button>
        </div>

        {/* Comparative Evolution Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-secondary-500" />
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Comparativo Institucional de Velocidad (PPM)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Fluidez media por grado en relación con la meta anual 2026
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis dataKey="grado" fontSize={11} stroke="#94A3B8" tickLine={false} />
                  <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                  <Bar dataKey="wpm" name="Palabras/Minuto" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-slate-100 dark:border-slate-700 text-xs">
            {chartData.map((d) => (
              <div key={d.grado}>
                <p className="text-[10px] text-slate-400 font-bold">{d.grado}</p>
                <p className="font-extrabold mt-0.5" style={{ color: d.color }}>{d.wpm} PPM</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Classroom Academic Ledger Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Libro Matriz de Rendimiento Lector 2026
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Datos oficiales listos para el registro técnico pedagógico
            </p>
          </div>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-1.5 rounded-xl bg-secondary-500 hover:bg-secondary-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Tabla en Excel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">#</th>
                <th className="py-3 px-4">Estudiante</th>
                <th className="py-3 px-4">Aula</th>
                <th className="py-3 px-4">Nivel Lector</th>
                <th className="py-3 px-4">Estrellas</th>
                <th className="py-3 px-4">Racha</th>
                <th className="py-3 px-4">Estado Pedagógico</th>
                <th className="py-3 px-4 rounded-r-xl text-right">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {students.map((s, idx) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span>{s.avatar || '🦊'}</span>
                    <span>{s.first_name} {s.last_name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {s.classroom_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
                      {s.reading_level}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-accent-600">
                    ⭐ {s.total_stars}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                    🔥 {s.streak_days} d
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-secondary-600 dark:text-secondary-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Logro Esperado
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedStudentId(s.id);
                        handleExportIndividualPDF();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-primary-500 hover:text-white transition-colors"
                      title="Descargar PDF"
                    >
                      PDF
                    </button>
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
