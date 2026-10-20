import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Activity } from '../../types';
import {
  BookOpen,
  Sparkles,
  Gamepad2,
  Play,
  Filter,
  Star,
  CheckCircle2,
  Layers,
  Search
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [activities, setActivities] = useState<Activity[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategoryFilter(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setLoading(true);
    const cat = categoryFilter === 'all' ? undefined : categoryFilter;
    const lvl = levelFilter === 'all' ? undefined : levelFilter;

    api.activities.getAll(cat, lvl)
      .then(data => {
        setActivities(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [categoryFilter, levelFilter]);

  const categories = [
    { id: 'all', label: 'Todas las Actividades', icon: Layers },
    { id: 'letters', label: '1. Reconocimiento de Letras', icon: BookOpen },
    { id: 'syllables', label: '2. Sílabas Mágicas', icon: Sparkles },
    { id: 'words', label: '3. Palabras en Acción', icon: BookOpen },
    { id: 'sentences', label: '4. Oraciones Divertidas', icon: BookOpen },
    { id: 'comprehension', label: '5. Comprensión Lectora', icon: BookOpen },
    { id: 'games', label: '6. Juegos Interactivos', icon: Gamepad2 }
  ];

  const handleCategoryClick = (catId: string) => {
    setCategoryFilter(catId);
    if (catId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: catId });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 p-6 sm:p-8 text-white shadow-xl shadow-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biblioteca Pedagógica Interactiva</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Actividades de Fortalecimiento Lector
          </h1>
          <p className="text-xs sm:text-sm text-primary-100 mt-1 max-w-xl">
            Ejercicios estructurados desde la conciencia fonológica hasta la comprensión inferencial profunda.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
          <span className="text-xs font-bold text-white px-2">Filtrar Nivel:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow-sm outline-none cursor-pointer"
          >
            <option value="all">Todos los Niveles</option>
            <option value="Inicial">Inicial</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25 scale-100'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Cargando actividades...</div>
      ) : activities.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          No se encontraron actividades para la categoría o nivel seleccionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => {
            const categoryColors: Record<string, { bg: string; badge: string; icon: string }> = {
              letters: { bg: 'from-blue-500 to-indigo-600', badge: 'bg-blue-100 text-blue-700', icon: '🔤' },
              syllables: { bg: 'from-emerald-500 to-teal-600', badge: 'bg-emerald-100 text-emerald-700', icon: '🧩' },
              words: { bg: 'from-amber-500 to-orange-500', badge: 'bg-amber-100 text-amber-700', icon: '⚡' },
              sentences: { bg: 'from-purple-500 to-pink-500', badge: 'bg-purple-100 text-purple-700', icon: '✍️' },
              comprehension: { bg: 'from-rose-500 to-red-500', badge: 'bg-rose-100 text-rose-700', icon: '📖' },
              games: { bg: 'from-cyan-500 to-blue-600', badge: 'bg-cyan-100 text-cyan-700', icon: '🎮' }
            };

            const conf = categoryColors[act.category] || categoryColors.letters;

            return (
              <div
                key={act.id}
                className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-2xl shadow-inner">
                      {conf.icon}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${conf.badge}`}>
                        Nivel {act.level}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                        +{act.points} ⭐
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Módulo de {act.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white mt-1">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <Link
                    to={`/activities/${act.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-primary-500/25 transition-all"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Iniciar Actividad Interactiva</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
