import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await api.auth.recoverPassword(email);
      setMessage(res.message);
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Error al solicitar recuperación.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.auth.resetPassword({
        email,
        token: resetToken || undefined,
        newPassword
      });
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error al restablecer contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.svg" alt="Yachay Lee" className="w-10 h-10" />
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white">
              Recuperar Contraseña
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sistema Yachay Lee
            </p>
          </div>
        </div>

        {resetSuccess ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-14 h-14 text-secondary-500 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              ¡Contraseña Restablecida!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
              Tu contraseña ha sido actualizada con éxito. Ya puedes iniciar sesión con tu nueva clave.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-primary-500 text-white font-bold text-xs hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        ) : !resetToken ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ingresa el correo electrónico asociado a tu cuenta institucional. Te enviaremos un código de validación para crear una nueva clave.
            </p>

            {message && (
              <div className="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-950/40 border border-secondary-200 dark:border-secondary-800 text-xs text-secondary-700 dark:text-secondary-300">
                {message}
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
                {error}
              </div>
            )}

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
                  placeholder="ejemplo@yachaylee.edu.pe"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25"
            >
              {loading ? 'Verificando...' : 'Enviar Solicitud'}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Regresar al inicio de sesión
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCompleteReset} className="space-y-4">
            <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-xs text-primary-700 dark:text-primary-300">
              Ingresa la nueva contraseña para la cuenta <strong>{email}</strong>.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-secondary-500 hover:bg-secondary-600 transition-colors shadow-lg shadow-secondary-500/25"
            >
              {loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
