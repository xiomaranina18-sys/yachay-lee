import React from 'react';

interface DuoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'green' | 'orange' | 'white' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const DuoButton: React.FC<DuoButtonProps> = ({
  variant = 'blue',
  size = 'md',
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "relative inline-flex items-center justify-center font-black tracking-wide transition-all transform active:translate-y-1 select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-0";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl border-b-2 active:border-b-0 gap-1.5",
    md: "px-5 py-2.5 text-xs sm:text-sm rounded-2xl border-b-4 active:border-b-0 gap-2",
    lg: "px-7 py-3.5 text-sm sm:text-base rounded-2xl border-b-[5px] active:border-b-0 gap-2.5"
  }[size];

  const variantStyles = {
    blue: "bg-primary-500 text-white border-primary-700 hover:bg-primary-600 shadow-md shadow-primary-500/20",
    green: "bg-secondary-500 text-white border-secondary-700 hover:bg-secondary-600 shadow-md shadow-secondary-500/20",
    orange: "bg-accent-500 text-white border-accent-700 hover:bg-accent-600 shadow-md shadow-accent-500/20",
    white: "bg-white text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 shadow-sm",
    ghost: "bg-transparent text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
