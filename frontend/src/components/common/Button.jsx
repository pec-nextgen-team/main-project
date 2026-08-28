import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  className = '',
  id,
  title,
}) {
  const variantStyles = {
    primary:
      'bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-600 border border-blue-800 shadow-sm active:bg-blue-900',
    success:
      'bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-600 border border-emerald-800 shadow-sm active:bg-emerald-900',
    danger:
      'bg-rose-700 text-white hover:bg-rose-800 focus-visible:ring-rose-600 border border-rose-800 shadow-sm active:bg-rose-900',
    secondary:
      'bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 border border-slate-300 shadow-xs active:bg-slate-100',
    cancel:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 focus-visible:ring-slate-400 border border-slate-200 active:bg-slate-300',
    outline:
      'bg-transparent text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500 border border-blue-600 active:bg-blue-100',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-sm font-medium gap-2 min-h-[40px]',
    lg: 'px-5 py-2.5 text-base font-medium gap-2.5 min-h-[46px]',
  };

  return (
    <button
      id={id}
      type={type}
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none font-sans ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}

export default Button;
