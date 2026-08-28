import React from 'react'
import { X } from 'lucide-react'
import StockStatusBadge from './StockStatusBadge.jsx'

const formatINR = (value) =>
  `₹ ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ViewItemModal({ item, onClose }) {
  if (!item) return null
  const stockValue = item.availableStock * item.unitPrice

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-[15px] font-bold text-navy-900">Item Details</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-bold text-navy-900">{item.itemName}</p>
              <p className="text-[12.5px] text-slate-500">{item.itemCode}</p>
            </div>
            <StockStatusBadge status={item.status} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Detail label="Category" value={item.category} />
            <Detail label="Unit" value={item.unit} />
            <Detail label="Location / Store" value={item.location} />
            <Detail label="Opening Stock" value={item.openingStock} />
            <Detail label="Available Stock" value={item.availableStock} />
            <Detail label="Unit Price" value={formatINR(item.unitPrice)} />
          </div>

          <div className="bg-slate-50 rounded-lg p-3.5 flex items-center justify-between">
            <p className="text-[12.5px] text-slate-500">Stock Value</p>
            <p className="text-[16px] font-bold text-navy-900">{formatINR(stockValue)}</p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase mb-0.5">{label}</p>
      <p className="text-[13px] text-navy-800 font-medium">{value}</p>
    </div>
  )
}
