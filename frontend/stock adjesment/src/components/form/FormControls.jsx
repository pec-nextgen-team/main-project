export function Field({ label, required, className = '', children, hint }) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="mb-1.5 block text-[12.5px] font-semibold text-ink-600">
          {label}
          {required && <span className="ml-0.5 text-danger-600">*</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-[11.5px] text-ink-400">{hint}</span>}
    </label>
  )
}

const baseControl =
  'w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-[13.5px] text-ink-800 placeholder:text-ink-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100'

export function TextInput({ className = '', ...props }) {
  return <input className={`${baseControl} ${className}`} {...props} />
}

export function SelectInput({ className = '', children, ...props }) {
  return (
    <select className={`${baseControl} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="%2394a0b8" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>')] bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat pr-9 ${className}`} {...props}>
      {children}
    </select>
  )
}

export function TextArea({ className = '', rows = 3, ...props }) {
  return <textarea rows={rows} className={`${baseControl} resize-none ${className}`} {...props} />
}

export function CardHeading({ number, title }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-[15px] font-bold text-ink-900">
      {number && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
          {number}
        </span>
      )}
      {title}
    </h3>
  )
}
