import React from 'react'
import { StickyNote } from 'lucide-react'

const NOTES = [
  'Low Stock: Below Reorder Level',
  'Expiring Soon: Within 90 days',
  'Always update stock after use',
]

export default function NotesCard() {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <StickyNote size={16} className="text-orange-500" />
        <h3 className="text-[13.5px] font-bold text-navy-900">Notes</h3>
      </div>
      <ul className="space-y-1.5">
        {NOTES.map((note) => (
          <li key={note} className="flex items-start gap-2 text-[12.5px] text-navy-800">
            <span className="text-orange-500 mt-0.5">•</span>
            {note}
          </li>
        ))}
      </ul>
    </div>
  )
}
