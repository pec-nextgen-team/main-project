import React from 'react'
import {
  XCircle,
  FileWarning,
  Copy,
  HelpCircle,
  Package,
  Wallet,
  AlertTriangle,
  PackageX,
  CalendarClock,
  Users,
  IndianRupee,
  Truck,
} from 'lucide-react'

const ICONS = {
  XCircle,
  FileWarning,
  Copy,
  HelpCircle,
  Package,
  Wallet,
  AlertTriangle,
  PackageX,
  CalendarClock,
  Users,
  IndianRupee,
  Truck,
}

const COLOR_MAP = {
  red: { bg: 'bg-red-50', text: 'text-red-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
  green: { bg: 'bg-green-50', text: 'text-green-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
}

export default function SummaryCard({ icon, number, title, subtitle, color }) {
  const Icon = ICONS[icon] || HelpCircle
  const c = COLOR_MAP[color] || COLOR_MAP.blue

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-card p-4 flex items-start gap-3.5">
      <div className={`w-11 h-11 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
        <Icon size={22} className={c.text} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold text-navy-900 leading-none">{number}</p>
        <p className="text-[13px] font-semibold text-navy-800 mt-1.5 truncate">{title}</p>
        <p className="text-[11.5px] text-slate-400">{subtitle}</p>
      </div>
    </div>
  )
}
