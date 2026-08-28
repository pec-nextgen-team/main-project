import React from 'react'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-[12.5px] text-slate-500 mt-1">
      {items.map((item, idx) => (
        <React.Fragment key={item}>
          {idx > 0 && <ChevronRight size={12} className="text-slate-400" />}
          <span className={idx === items.length - 1 ? 'text-slate-700 font-medium' : ''}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  )
}
