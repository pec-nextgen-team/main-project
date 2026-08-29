import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  title = 'No records found',
  description = 'There are no active records in this queue at the moment.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
  id,
}) {
  return (
    <div
      id={id}
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-lg border border-slate-200 shadow-xs ${className}`}
    >
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4 border border-slate-200/80">
        <Icon className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          onClick={onAction}
          icon={actionIcon}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
