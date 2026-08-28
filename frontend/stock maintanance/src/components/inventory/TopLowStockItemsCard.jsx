import React from 'react'
import { ShoppingCart } from 'lucide-react'
import { topLowStockItems } from '../../data/inventoryData.js'

export default function TopLowStockItemsCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden">
      <div className="px-4 sm:px-5 py-4 border-b border-slate-100">
        <h3 className="text-[15px] font-bold text-orange-600">Top Low Stock Items</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <thead>
            <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5 font-semibold">Item Code</th>
              <th className="px-4 py-2.5 font-semibold">Item Name</th>
              <th className="px-4 py-2.5 font-semibold">Available Stock</th>
              <th className="px-4 py-2.5 font-semibold">Reorder Level</th>
              <th className="px-4 py-2.5 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {topLowStockItems.map((item) => (
              <tr key={item.itemCode} className="border-t border-slate-100">
                <td className="px-4 py-3 text-[13px] font-semibold text-navy-900 whitespace-nowrap">
                  {item.itemCode}
                </td>
                <td className="px-4 py-3 text-[13px] text-navy-800">{item.itemName}</td>
                <td className="px-4 py-3 text-[13px] font-semibold text-orange-600">{item.availableStock}</td>
                <td className="px-4 py-3 text-[13px] text-slate-600">{item.reorderLevel}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-brand-blue text-brand-blue hover:bg-blue-50"
                    aria-label={`Raise purchase request for ${item.itemName}`}
                  >
                    <ShoppingCart size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
