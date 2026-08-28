import React from 'react'
import { XCircle, UserPlus } from 'lucide-react'
import Breadcrumb from './Breadcrumb.jsx'

const ICON_CONFIG = {
  reject: { icon: XCircle, bg: 'bg-red-100', color: 'text-red-600' },
  add: { icon: UserPlus, bg: 'bg-blue-100', color: 'text-brand-blue' },
}

export default function PageHeader({ title, breadcrumbItems, icon = 'reject' }) {
  const cfg = ICON_CONFIG[icon] || ICON_CONFIG.reject
  const Icon = cfg.icon

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon size={20} className={cfg.color} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900">{title}</h2>
      </div>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}
