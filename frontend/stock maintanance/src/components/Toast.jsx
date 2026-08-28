import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  const isSuccess = toast.type === 'success'

  return (
    <div className="fixed top-5 right-5 z-[60] w-full max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-lg border shadow-lg p-4 bg-white ${
          isSuccess ? 'border-green-200' : 'border-red-200'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={20} className="text-green-600 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-navy-900">{toast.title}</p>
          {toast.message && (
            <p className="text-[12.5px] text-slate-500 mt-0.5">{toast.message}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 shrink-0"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
