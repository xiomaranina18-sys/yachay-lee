import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { BookOpen, Sparkles, ShieldCheck, GraduationCap, Users, ArrowRight, Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('docente@yachaylee.edu.pe');
  const [password, setPassword] = useState('docente123');
  const [selectedRole, setSelectedRole] = useState<Role>('teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions: { role: Role; label: string; icon: React.ReactNode; defaultEmail: string; defaultPass: string }[] = [
    { role: 'admin', label: 'Administrador', icon: <ShieldCheck className="w-4 h-4" />, defaultEmail: 'admin@yachaylee.edu.pe', defaultPass: 'admin123' },
    { role: 'teacher', label: 'Docente', icon: <GraduationCap className="w-4 h-4" />, defaultEmail: 'docente@yachaylee.edu.pe', defaultPass: 'docente123' },
    { role: 'parent', label: 'Padre / Madre', icon: <Users className="w-4 h-4" />, defaultEmail: 'padre@yachaylee.edu.pe', defaultPass: 'padre123' },
    { role: 'student', label: 'Estudiante', icon: <Sparkles className="w-4 h-4" />, defaultEmail: 'estudiante@yachaylee.edu.pe', defaultPass: 'estudiante123' }
  ];

  const handleSelectRole = (r: typeof roleOptions[0]) => {
    setSelectedRole(r.role);
    setEmail(r.defaultEmail);
    setPassword(r.defaultPass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Side: Brand & Educational Mission */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-accent-500/20 blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.svg" alt="Yachay Lee Logo" className="w-12 h-12 bg-white rounded-2xl p-1 shadow-md" />
              <div>
                <h1 className="text-2xl font-black tracking-tight">YACHAY LEE</h1>
                <p className="text-xs text-primary-100 font-medium">Plataforma Pedagógica Integral</p>
              </div>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight">
              Transformando la lectura infantil en una aventura inolvidable.
            </h2>
            <p className="mt-4 text-sm text-primary-100/90 leading-relaxed">
              Unimos a docentes, padres y estudiantes con actividades fonológicas lúdicas, cuentos interactivos y diagnósticos con Inteligencia Artificial.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
                <p className="text-lg font-bold">100%</p>
                <p className="text-[10px] text-primary-100">Interactivo</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
                <p className="text-lg font-bold">IA</p>
                <p className="text-[10px] text-primary-100">Diagnóstico</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
                <p className="text-lg font-bold">4 Roles</p>
                <p className="text-[10px] text-primary-100">Integrados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              Bienvenido al Sistema
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Selecciona tu rol institucional para ingresar:
            </p>
          </div>

          {/* Quick Role Select Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {roleOptions.map((r) => {
              const isSelected = selectedRole === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => handleSelectRole(r)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 ring-2 ring-primary-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span className={isSelected ? 'text-primary-500' : 'text-slate-400'}>
                    {r.icon}
                  </span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@yachaylee.edu.pe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Contraseña
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 active:bg-primary-700 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Iniciando sesión...</span>
              ) : (
                <>
                  <span>Ingresar a Yachay Lee</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-400">
            Plataforma Institucional YACHAY LEE © 2026. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </div>
  );
};
