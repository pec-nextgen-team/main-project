import React from 'react'
import { Headset, Phone, Mail } from 'lucide-react'

export default function HelpCard() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Headset size={16} className="text-green-600" />
        <h3 className="text-[13.5px] font-bold text-navy-900">Need Help?</h3>
      </div>
      <p className="text-[12px] text-slate-600 mb-2.5">For any assistance, contact</p>
      <div className="space-y-1.5">
        <p className="flex items-center gap-2 text-[12.5px] text-navy-800 font-medium">
          <Phone size={13} className="text-green-600" />
          044 - 2649 1113
        </p>
        <p className="flex items-center gap-2 text-[12.5px] text-navy-800 font-medium">
          <Mail size={13} className="text-green-600" />
          support@panimalar.ac.in
        </p>
      </div>
    </div>
  )
}
