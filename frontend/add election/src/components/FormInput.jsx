import React from 'react'
import FormField from './FormField.jsx'

export default function FormInput({
  label,
  required,
  error,
  hint,
  icon: Icon,
  prefix,
  className = '',
  ...inputProps
}) {
  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      <div className="relative flex items-stretch">
        {prefix && (
          <span className="flex items-center px-3 border border-r-0 border-slate-200 rounded-l-md bg-slate-50 text-[13px] text-slate-500 font-medium">
            {prefix}
          </span>
        )}
        <input
          {...inputProps}
          className={`w-full px-3 py-2.5 text-[13.5px] border border-slate-200 bg-white placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue
            disabled:bg-slate-50 disabled:text-slate-400
            ${prefix ? 'rounded-r-md' : 'rounded-md'}
            ${Icon ? 'pr-10' : ''}
            ${error ? 'border-red-300' : ''}
            ${className}`}
        />
        {Icon && (
          <Icon size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        )}
      </div>
    </FormField>
  )
}
