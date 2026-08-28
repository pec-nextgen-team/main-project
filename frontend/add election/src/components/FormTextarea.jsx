import React from 'react'
import FormField from './FormField.jsx'

export default function FormTextarea({
  label,
  required,
  error,
  maxLength,
  value,
  rows = 3,
  ...textareaProps
}) {
  return (
    <FormField label={label} required={required} error={error}>
      <textarea
        {...textareaProps}
        value={value}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-3 py-2.5 text-[13.5px] border rounded-md bg-white placeholder:text-slate-400 resize-none
          focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue
          ${error ? 'border-red-300' : 'border-slate-200'}`}
      />
      {typeof maxLength === 'number' && (
        <p className="text-[11px] text-slate-400 mt-1 text-right">
          {(value || '').length} / {maxLength}
        </p>
      )}
    </FormField>
  )
}
