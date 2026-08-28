import React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import StockStatusBadge from './StockStatusBadge.jsx'
import CategoryBadge from '../CategoryBadge.jsx'

const COLUMNS = [
  'Item Code',
  'Item Name',
  'Category',
  'Unit',
  'Location',
  'Opening Stock',
  'Available Stock',
  'Unit Price (₹)',
  'Stock Value (₹)',
  'Status',
  'Action',
]

const formatINR = (value) =>
  value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function InventoryTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onView,
  onEdit,
  onDelete,
}) {
  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id))

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue/30"
                />
              </th>
              {COLUMNS.map((col) => (
                <th key={col} className="px-4 py-3 font-semibold whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 1} className="px-4 py-10 text-center text-slate-400 text-[13px]">
                  No inventory items match the current filters.
                </td>
              </tr>
            )}
            {items.map((item) => {
              const stockValue = item.availableStock * item.unitPrice
              return (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggleSelect(item.id)}
                      className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue/30"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-navy-900 whitespace-nowrap">
                    {item.itemCode}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-navy-800 font-medium whitespace-nowrap">
                    {item.itemName}
                  </td>
                  <td className="px-4 py-3.5">
                    <CategoryBadge category={item.category} />
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-600">{item.unit}</td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-600 whitespace-nowrap">{item.location}</td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-600">{item.openingStock}</td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-navy-900">{item.availableStock}</td>
                  <td className="px-4 py-3.5 text-[13px] text-slate-600">{formatINR(item.unitPrice)}</td>
                  <td className="px-4 py-3.5 text-[13px] font-semibold text-navy-900">{formatINR(stockValue)}</td>
                  <td className="px-4 py-3.5">
                    <StockStatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <IconBtn onClick={() => onView(item)} label="View item">
                        <Eye size={14} />
                      </IconBtn>
                      <IconBtn onClick={() => onEdit(item)} label="Edit item">
                        <Pencil size={14} />
                      </IconBtn>
                      <IconBtn onClick={() => onDelete(item)} label="Delete item" danger>
                        <Trash2 size={14} />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function IconBtn({ children, onClick, label, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`w-7 h-7 flex items-center justify-center rounded-md border transition-colors ${
        danger
          ? 'border-red-200 text-red-500 hover:bg-red-50'
          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}
