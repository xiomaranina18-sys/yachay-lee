import React from 'react';
import { Role } from '../../types';
import { ShieldCheck, GraduationCap, Users, Sparkles } from 'lucide-react';

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const configs: Record<Role, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    admin: {
      label: 'Administrador',
      bg: 'bg-primary-100 dark:bg-primary-900/40 border border-primary-300 dark:border-primary-700',
      text: 'text-primary-700 dark:text-primary-300',
      icon: <ShieldCheck className="w-3.5 h-3.5 mr-1" />
    },
    teacher: {
      label: 'Docente',
      bg: 'bg-secondary-100 dark:bg-secondary-900/40 border border-secondary-300 dark:border-secondary-700',
      text: 'text-secondary-700 dark:text-secondary-300',
      icon: <GraduationCap className="w-3.5 h-3.5 mr-1" />
    },
    parent: {
      label: 'Padre de Familia',
      bg: 'bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700',
      text: 'text-blue-700 dark:text-blue-300',
      icon: <Users className="w-3.5 h-3.5 mr-1" />
    },
    student: {
      label: 'Estudiante',
      bg: 'bg-accent-100 dark:bg-accent-900/40 border border-accent-300 dark:border-accent-700',
      text: 'text-accent-700 dark:text-accent-300',
      icon: <Sparkles className="w-3.5 h-3.5 mr-1" />
    }
  };

  const current = configs[role] || configs.student;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${current.bg} ${current.text} ${className}`}>
      {current.icon}
      {current.label}
    </span>
  );
};
