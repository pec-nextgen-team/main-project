import React from 'react'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteConfirmModal({ item, onCancel, onConfirm }) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-5">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-3">
          <AlertTriangle size={20} className="text-red-600" />
        </div>
        <h3 className="text-[15px] font-bold text-navy-900 mb-1.5">Delete this item?</h3>
        <p className="text-[13px] text-slate-500 mb-5">
          <span className="font-medium text-navy-800">{item.itemName}</span> ({item.itemCode})
          will be permanently removed from inventory. This cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(item)}
            className="px-4 py-2 text-[13px] font-semibold rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
