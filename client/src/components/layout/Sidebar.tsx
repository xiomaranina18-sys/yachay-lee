import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  School,
  HeartHandshake,
  BookOpen,
  BrainCircuit,
  FileSpreadsheet,
  Gamepad2,
  Sparkles,
  Award,
  BookMarked,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { role, studentProfile } = useAuth();
  const location = useLocation();

  const isStudent = role === 'student';

  interface NavItem {
    label: string;
    path: string;
    icon: any;
    color?: string;
  }

  const defaultNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Biblioteca Digital', path: '/library', icon: BookMarked, color: 'text-primary-500' },
    { label: 'Gamificación y Logros', path: '/gamification', icon: Award, color: 'text-amber-500' },
    { label: 'Estudiantes', path: '/students', icon: Users },
    { label: 'Aulas y Docentes', path: '/classrooms', icon: School },
    { label: 'Portal Padres', path: '/parents', icon: HeartHandshake },
    { label: 'Actividades Lectoras', path: '/activities', icon: BookOpen },
    { label: 'Inteligencia Artificial', path: '/ai', icon: BrainCircuit },
    { label: 'Reportes y Métricas', path: '/reports', icon: FileSpreadsheet },
  ];

  const studentNavItems: NavItem[] = [
    { label: 'Mi Aventura Lectora', path: '/dashboard', icon: Sparkles, color: 'text-accent-500' },
    { label: 'Biblioteca de Cuentos', path: '/library', icon: BookMarked, color: 'text-primary-500' },
    { label: 'Mis Medallas y Niveles', path: '/gamification', icon: Award, color: 'text-amber-500' },
    { label: '1. Letras y Sonidos', path: '/activities?category=letters', icon: BookOpen },
    { label: '2. Sílabas Mágicas', path: '/activities?category=syllables', icon: BookOpen },
    { label: '3. Palabras Frecuentes', path: '/activities?category=words', icon: BookOpen },
    { label: '4. Constructor de Oraciones', path: '/activities?category=sentences', icon: BookOpen },
    { label: '5. Cuentos y Comprensión', path: '/activities?category=comprehension', icon: BookOpen },
    { label: '6. Juegos Interactivos', path: '/activities?category=games', icon: Gamepad2, color: 'text-secondary-500' },
  ];

  const items = isStudent ? studentNavItems : defaultNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header with Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 lg:hidden">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Yachay Lee" className="w-8 h-8" />
            <span className="font-extrabold text-primary-600 dark:text-primary-400">YACHAY LEE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Info Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent border border-primary-100 dark:border-primary-900/50">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            I.E. Nuestra Señora de Fatima
          </p>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5">
            Programa Yachay Lee 2026
          </p>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse"></span>
            <span>Plataforma Activa</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isStudent ? 'Aventura de Aprendizaje' : 'Módulos Principales'}
          </div>

          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname + location.search === item.path || (location.pathname === item.path && !item.path.includes('?'));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/25 dark:bg-primary-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color || 'text-slate-500 dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer Paleta Institucional Badge */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-2">
            <span>Identidad Institucional</span>
            <span className="font-mono">v1.0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex-1 h-2 rounded-full bg-primary-500" title="Azul Institucional #2563EB"></div>
            <div className="flex-1 h-2 rounded-full bg-secondary-500" title="Verde Institucional #10B981"></div>
            <div className="flex-1 h-2 rounded-full bg-accent-500" title="Naranja Institucional #F97316"></div>
            <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700" title="Blanco #FFFFFF"></div>
          </div>
        </div>

      </aside>
    </>
  );
};
