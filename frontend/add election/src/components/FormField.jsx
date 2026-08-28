import React from 'react'

export default function FormField({ label, required, error, children, hint }) {
  return (
    <div>
      <label className="block text-[13.5px] font-medium text-navy-800 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-[11.5px] text-red-600 mt-1">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-slate-400 mt-1">{hint}</p>
      ) : null}
    </div>
  )
}
