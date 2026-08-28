import React from 'react'
import { PackagePlus, PackageMinus, SlidersHorizontal, FileBarChart2, Plus } from 'lucide-react'

export default function QuickActionsCard({ onAddItem, onStockIn, onStockOut, onAdjustment, onViewReport }) {
  const actions = [
    { label: 'Add New Item', icon: Plus, onClick: onAddItem },
    { label: 'Stock In (Receive)', icon: PackagePlus, onClick: onStockIn },
    { label: 'Stock Out (Issue)', icon: PackageMinus, onClick: onStockOut },
    { label: 'Stock Adjustment', icon: SlidersHorizontal, onClick: onAdjustment },
    { label: 'View Stock Report', icon: FileBarChart2, onClick: onViewReport },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="w-full flex items-center gap-2.5 text-[12.5px] font-medium text-navy-700 border border-slate-200 rounded-md px-3 py-2.5 hover:bg-slate-50 hover:border-brand-blue/40 transition-colors"
          >
            <Icon size={15} className="text-brand-blue" />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
