import React, { useState } from 'react'
import { X, PackagePlus, PackageMinus, SlidersHorizontal } from 'lucide-react'

const CONFIG = {
  in: { title: 'Stock In', icon: PackagePlus, color: 'text-green-600', bg: 'bg-green-50', btn: 'bg-green-600 hover:bg-green-700' },
  out: { title: 'Stock Out', icon: PackageMinus, color: 'text-orange-600', bg: 'bg-orange-50', btn: 'bg-orange-600 hover:bg-orange-700' },
  adjustment: { title: 'Stock Adjustment', icon: SlidersHorizontal, color: 'text-purple-600', bg: 'bg-purple-50', btn: 'bg-purple-600 hover:bg-purple-700' },
}

export default function StockMovementModal({ mode, item, items, onClose, onSubmit }) {
  const [selectedItemId, setSelectedItemId] = useState(item ? item.id : items?.[0]?.id || '')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  if (!mode) return null
  const cfg = CONFIG[mode]
  const Icon = cfg.icon

  const handleSubmit = (e) => {
    e.preventDefault()
    const qty = Number(quantity)
    if (!selectedItemId) {
      setError('Select an item.')
      return
    }
    if (!qty || qty <= 0) {
      setError('Enter a quantity greater than 0.')
      return
    }
    setError('')
    onSubmit({ itemId: selectedItemId, quantity: qty, note, mode })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center`}>
              <Icon size={18} className={cfg.color} />
            </span>
            <h3 className="text-[15px] font-bold text-navy-900">{cfg.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-[13.5px] font-medium text-navy-800 mb-1.5">
              Item<span className="text-red-500 ml-0.5">*</span>
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              disabled={!!item}
              className="w-full px-3 py-2.5 text-[13.5px] border border-slate-200 rounded-md bg-white disabled:bg-slate-50"
            >
              {(item ? [item] : items).map((i) => (
                <option key={i.id} value={i.id}>
                  {i.itemCode} — {i.itemName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-navy-800 mb-1.5">
              Quantity<span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="w-full px-3 py-2.5 text-[13.5px] border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-[13.5px] font-medium text-navy-800 mb-1.5">Note</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note (e.g. supplier, reason)"
              className="w-full px-3 py-2.5 text-[13.5px] border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>

          {error && <p className="text-[12px] text-red-600">{error}</p>}
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 text-[13px] font-semibold rounded-md text-white transition-colors ${cfg.btn}`}
          >
            Confirm {cfg.title}
          </button>
        </div>
      </form>
    </div>
  )
}
