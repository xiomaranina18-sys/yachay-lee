import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: Role | null;
  studentProfile: Student | null;
  childrenProfiles: Student[];
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchRoleQuick: (targetRole: Role) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('yachay_token'));
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [childrenProfiles, setChildrenProfiles] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const savedToken = localStorage.getItem('yachay_token');
    if (savedToken) {
      try {
        const data = await api.auth.getMe();
        setUser(data.user);
        setStudentProfile(data.studentProfile || null);
        setChildrenProfiles(data.childrenProfiles || []);
      } catch (err) {
        console.warn('Sesión caducada o inválida, cerrando sesión.');
        localStorage.removeItem('yachay_token');
        setUser(null);
        setToken(null);
      }
    } else {
      // Auto login as Teacher or Admin by default if first visit for instant rich experience
      try {
        const res = await api.auth.login({
          email: 'docente@yachaylee.edu.pe',
          password: 'docente123'
        });
        localStorage.setItem('yachay_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setStudentProfile(res.studentProfile || null);
        setChildrenProfiles(res.childrenProfiles || []);
      } catch (e) {
        console.warn('Esperando inicio de sesión manual.');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password: pass });
      localStorage.setItem('yachay_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setStudentProfile(res.studentProfile || null);
      setChildrenProfiles(res.childrenProfiles || []);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('yachay_token');
    setUser(null);
    setToken(null);
    setStudentProfile(null);
    setChildrenProfiles([]);
  };

  const switchRoleQuick = async (targetRole: Role) => {
    const roleCredentials: Record<Role, { email: string; pass: string }> = {
      admin: { email: 'admin@yachaylee.edu.pe', pass: 'admin123' },
      teacher: { email: 'docente@yachaylee.edu.pe', pass: 'docente123' },
      parent: { email: 'padre@yachaylee.edu.pe', pass: 'padre123' },
      student: { email: 'estudiante@yachaylee.edu.pe', pass: 'estudiante123' }
    };
    const creds = roleCredentials[targetRole];
    if (creds) {
      await login(creds.email, creds.pass);
    }
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const data = await api.auth.getMe();
        setUser(data.user);
        setStudentProfile(data.studentProfile || null);
        setChildrenProfiles(data.childrenProfiles || []);
      } catch (e) {
        console.error('Error al refrescar perfil:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user ? user.role : null,
        studentProfile,
        childrenProfiles,
        loading,
        login,
        logout,
        switchRoleQuick,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
