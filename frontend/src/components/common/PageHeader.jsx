import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  id,
}) {
  return (
    <div id={id} className="mb-6">
      {/* Breadcrumb */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium" aria-label="Breadcrumb">
          <span className="flex items-center gap-1 text-slate-400">
            <Home className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PEC Portal</span>
          </span>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <React.Fragment key={index}>
                <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" aria-hidden="true" />
                <span className={isLast ? 'text-slate-800 font-semibold' : 'text-slate-500'}>
                  {crumb}
                </span>
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
