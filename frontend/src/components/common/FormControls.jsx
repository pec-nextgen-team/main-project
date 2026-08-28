import React from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

export function FormField({
  label,
  required = false,
  error,
  helperText,
  children,
  className = '',
  id,
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-600 font-bold">*</span>}
          </span>
        </label>
      )}
      {children}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

export function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  className = '',
  icon: Icon,
  autoComplete,
}) {
  return (
    <div className="relative flex items-center w-full">
      {Icon && (
        <div className="absolute left-3 text-slate-400 pointer-events-none">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className={`w-full h-10 rounded-md border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
          Icon ? 'pl-9' : ''
        } ${error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
        } ${className}`}
      />
    </div>
  );
}

export function Select({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  className = '',
}) {
  return (
    <div className="relative flex items-center w-full">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full h-10 rounded-md border bg-white pl-3 pr-9 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors appearance-none cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
        } ${className}`}
      >
        {placeholder && (
          <option value="" disabled className="text-slate-400">
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const val = typeof opt === 'string' ? opt : opt.value;
          const lbl = typeof opt === 'string' ? opt : opt.label;
          return (
            <option key={val} value={val} className="text-slate-800">
              {lbl}
            </option>
          );
        })}
      </select>
      <ChevronDown className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

export function Textarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  required = false,
  error,
  className = '',
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      required={required}
      className={`w-full rounded-md border bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed ${
        error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'
      } ${className}`}
    />
  );
}

export default { FormField, Input, Select, Textarea };
