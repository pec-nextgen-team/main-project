import React from 'react'

const STYLES = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-orange-50 text-orange-600',
  Low: 'bg-green-50 text-green-600',
}

export default function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold ${
        STYLES[priority] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {priority}
    </span>
  )
}
