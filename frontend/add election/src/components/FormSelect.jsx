import React from 'react'
import FormField from './FormField.jsx'

export default function FormSelect({ label, required, error, hint, options, placeholder, ...selectProps }) {
  return (
    <FormField label={label} required={required} error={error} hint={hint}>
      <select
        {...selectProps}
        className={`w-full px-3 py-2.5 text-[13.5px] border rounded-md bg-white text-navy-800
          focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue
          ${error ? 'border-red-300' : 'border-slate-200'}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </FormField>
  )
}
