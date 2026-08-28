import React from 'react'
import { Info } from 'lucide-react'

export default function ElectricianInfoCard() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Info size={16} className="text-blue-600" />
        <h3 className="text-[13.5px] font-bold text-navy-900">Electrician Information</h3>
      </div>
      <p className="text-[12.5px] text-slate-600 leading-relaxed">
        Fill in all the mandatory details to add a new electrician to the system.
      </p>
    </div>
  )
}
