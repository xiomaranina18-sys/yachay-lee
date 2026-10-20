import React, { useEffect, useState } from 'react';
import { StatsCard } from '../../components/common/StatsCard';
import { api } from '../../services/api';
import { DashboardStats, Classroom } from '../../types';
import { Users, School, BookOpen, Trophy, ArrowUpRight, TrendingUp, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.progress.getDashboardStats(),
      api.classrooms.getAll()
    ]).then(([statsData, classData]) => {
      setStats(statsData);
      setClassrooms(classData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const levelData = [
    { name: 'Inicial', cantidad: stats.levelDistribution.Inicial, color: '#3B82F6' },
    { name: 'Básico', cantidad: stats.levelDistribution.Básico, color: '#10B981' },
    { name: 'Intermedio', cantidad: stats.levelDistribution.Intermedio, color: '#F97316' },
    { name: 'Avanzado', cantidad: stats.levelDistribution.Avanzado, color: '#8B5CF6' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 p-6 sm:p-8 text-white shadow-xl shadow-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel de Administración Institucional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            I.E. Nuestra Señora de Fatima
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 mt-1 max-w-xl">
            Supervisión integral de rendimiento lector, cobertura de aulas, diagnósticos de IA y evolución académica 2026.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/reports"
            className="px-4 py-2.5 rounded-xl bg-white text-primary-600 font-bold text-xs hover:bg-primary-50 transition-all shadow-md flex items-center gap-2"
          >
            <span>Generar Reporte Oficial</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Total Estudiantes"
          value={stats.totalStudents}
          subtitle="En 2 aulas registradas"
          icon={<Users className="w-6 h-6" />}
          color="blue"
          trend={{ value: '12% este mes', positive: true }}
        />
        <StatsCard
          title="Fluidez Media (PPM)"
          value={`${stats.avgWpm} PPM`}
          subtitle="Palabras Por Minuto"
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={{ value: '+4 PPM semana', positive: true }}
        />
        <StatsCard
          title="Precisión Fonológica"
          value={`${stats.avgAccuracy}%`}
          subtitle="Meta institucional: 85%"
          icon={<Trophy className="w-6 h-6" />}
          color="orange"
          trend={{ value: '+2.5% vs inicial', positive: true }}
        />
        <StatsCard
          title="Aulas Activas"
          value={stats.totalClassrooms}
          subtitle="1° y 2° de Primaria"
          icon={<School className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Evolution Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Evolución de Fluidez Lectora Semanal
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                PPM promedio y minutos dedicados por los estudiantes
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400">
              Semana Actual
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyEvolution}>
                <defs>
                  <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
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
                <Area type="monotone" dataKey="wpm" name="Palabras/Min (PPM)" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                <Area type="monotone" dataKey="minutos" name="Minutos Lectura" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorMin)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Level Distribution Chart (1 Col) */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Distribución por Nivel Lector
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Categorización pedagógica del alumnado
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" tickLine={false} />
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
                <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            {levelData.map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }}></span>
                <span className="text-slate-600 dark:text-slate-300">{l.name}:</span>
                <span className="font-bold text-slate-800 dark:text-white">{l.cantidad}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Classroom Status Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Aulas Institucionales y Cobertura
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Desempeño general de docentes y grupos de lectura
            </p>
          </div>
          <Link
            to="/classrooms"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
          >
            Ver todas las aulas →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4 rounded-l-xl">Aula</th>
                <th className="py-3 px-4">Grado / Sección</th>
                <th className="py-3 px-4">Docente Responsable</th>
                <th className="py-3 px-4">Estudiantes</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {classrooms.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-white">
                    {c.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {c.grade} - {c.section}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    {c.teacher_name || 'Prof. María Valdivia'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                      {c.student_count || 3} estudiantes
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/classrooms/${c.id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-primary-500 hover:text-white transition-colors"
                    >
                      Ver Detalle
                    </Link>
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
