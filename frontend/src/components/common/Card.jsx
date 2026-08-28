import React from 'react';

export function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  bodyClassName = 'p-6',
  headerClassName = 'px-6 py-4 border-b border-slate-200 bg-slate-50/50',
  id,
}) {
  return (
    <div
      id={id}
      className={`bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden ${className}`}
    >
      {(title || subtitle || action || Icon) && (
        <div className={`flex items-center justify-between ${headerClassName}`}>
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
                <Icon className="w-4 h-4" aria-hidden="true" />
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-slate-900 leading-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

export default Card;
