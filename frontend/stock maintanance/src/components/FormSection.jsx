import React from 'react'

export default function FormSection({ title, children, divider = true }) {
  return (
    <div className={divider ? 'pt-6 mt-6 border-t border-slate-100' : ''}>
      <h3 className="text-[16px] font-bold text-brand-blue mb-4">{title}</h3>
      {children}
    </div>
  )
}
