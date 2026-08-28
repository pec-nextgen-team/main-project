import React from 'react'
import { rejectionReasonsList } from '../data/mockData.js'

export default function RejectionReasons() {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <h3 className="text-[13.5px] font-bold text-navy-900 mb-2.5">Rejection Reasons</h3>
      <ul className="space-y-1.5">
        {rejectionReasonsList.map((reason) => (
          <li key={reason} className="flex items-start gap-2 text-[12.5px] text-navy-800">
            <span className="text-red-500 mt-0.5">•</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  )
}
