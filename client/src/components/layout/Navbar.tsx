import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { RoleBadge } from '../common/RoleBadge';
import { Role } from '../../types';
import {
  Sun,
  Moon,
  Bell,
  LogOut,
  ChevronDown,
  User as UserIcon,
  Sparkles,
  BookOpen,
  Menu
} from 'lucide-react';
import { api } from '../../services/api';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, role, logout, switchRoleQuick } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      api.notifications.getAll()
        .then(setNotifications)
        .catch(() => setNotifications([]));
    }
  }, [user]);

  const handleRoleChange = async (targetRole: Role) => {
    setShowRoleMenu(false);
    await switchRoleQuick(targetRole);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Mobile hamburger & Logo Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="Yachay Lee Logo" className="w-9 h-9 object-contain" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  YACHAY LEE
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-500 text-white shadow-sm">
                  PRO
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Fortalecimiento Lector Infantil
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions: Role Switcher, Theme Toggle, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Role Switcher (Elegante & Profesional) */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors text-xs font-medium text-slate-700 dark:text-slate-200"
              title="Cambiar perspectiva de rol"
            >
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Rol:</span>
              {role && <RoleBadge role={role} />}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Cambiar perspectiva
                </div>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-primary-50 dark:hover:bg-slate-700 ${role === 'admin' ? 'font-bold text-primary-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>🛡️ Administrador</span>
                  {role === 'admin' && <span className="w-2 h-2 rounded-full bg-primary-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleChange('teacher')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-slate-700 ${role === 'teacher' ? 'font-bold text-secondary-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>🎓 Docente de Aula</span>
                  {role === 'teacher' && <span className="w-2 h-2 rounded-full bg-secondary-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleChange('parent')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-blue-50 dark:hover:bg-slate-700 ${role === 'parent' ? 'font-bold text-blue-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>👨‍👩‍👦 Padre de Familia</span>
                  {role === 'parent' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleChange('student')}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-accent-50 dark:hover:bg-slate-700 ${role === 'student' ? 'font-bold text-accent-600' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  <span>🦊 Estudiante Infantil</span>
                  {role === 'student' && <span className="w-2 h-2 rounded-full bg-accent-500"></span>}
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Cambiar tema"
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
              title="Notificaciones"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 py-3 z-50 animate-in fade-in">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Notificaciones</span>
                  <span className="text-[10px] font-semibold text-primary-600 dark:text-primary-400">
                    {unreadCount} nuevas
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/40">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Sin notificaciones recientes
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{n.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar / Logout */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
                {user?.avatar && user.avatar.length <= 4 ? (
                  <span>{user.avatar}</span>
                ) : user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
