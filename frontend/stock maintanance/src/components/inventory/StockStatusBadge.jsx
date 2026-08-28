import React from 'react'

const STYLES = {
  'In Stock': 'bg-green-50 text-green-600',
  'Low Stock': 'bg-orange-50 text-orange-600',
  'Out of Stock': 'bg-red-50 text-red-600',
}

export default function StockStatusBadge({ status }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
        STYLES[status] || 'bg-slate-100 text-slate-600'
      }`}
    >
      {status}
    </span>
  )
}
