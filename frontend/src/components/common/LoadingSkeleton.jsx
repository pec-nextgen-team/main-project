import React from 'react';

export function TableSkeleton({ rows = 4, cols = 5 }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-4 animate-pulse">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded-sm flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="p-4 flex gap-4 items-center animate-pulse">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className={`h-4 bg-slate-100 rounded-sm ${c === 0 ? 'w-24' : 'flex-1'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-200 rounded-md" />
            <div className="flex-1">
              <div className="h-4 bg-slate-200 rounded-sm w-1/3 mb-2" />
              <div className="h-3 bg-slate-100 rounded-sm w-1/2" />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-3.5 bg-slate-100 rounded-sm w-full" />
            <div className="h-3.5 bg-slate-100 rounded-sm w-4/5" />
          </div>
          <div className="h-9 bg-slate-200 rounded-md w-28" />
        </div>
      ))}
    </div>
  );
}

export default { TableSkeleton, CardSkeleton };
