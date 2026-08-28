import React from 'react'
import DonutChart from '../DonutChart.jsx'
import { categoryDonut } from '../../data/inventoryData.js'

export default function TopCategoriesCard() {
  const total = categoryDonut.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-2">Top Categories</h3>
      <DonutChart data={categoryDonut} centerValue={total} centerLabel="Total Items" size={170} />
      <ul className="mt-3 space-y-1.5">
        {categoryDonut.map((d) => (
          <li key={d.name} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 text-navy-700">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
              {d.name}
            </span>
            <span className="text-slate-500">
              {d.value} ({((d.value / total) * 100).toFixed(1)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
