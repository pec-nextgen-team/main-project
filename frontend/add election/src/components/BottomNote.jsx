import React from 'react'
import { Lightbulb } from 'lucide-react'

export default function BottomNote() {
  return (
    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
      <Lightbulb size={18} className="text-orange-500 shrink-0 mt-0.5" />
      <p className="text-[12.5px] text-navy-800 leading-relaxed">
        <span className="font-semibold">Note:</span> Rejected complaints are not forwarded for
        further action. Supervisor can modify the complaint as per the rejection reason and
        submit again if required.
      </p>
    </div>
  )
}
