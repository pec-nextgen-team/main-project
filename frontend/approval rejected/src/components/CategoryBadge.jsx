import React from 'react'
import { Zap, Droplet, Wrench } from 'lucide-react'

const CONFIG = {
  Electrical: { icon: Zap, color: 'text-yellow-500' },
  Plumbing: { icon: Droplet, color: 'text-blue-400' },
  General: { icon: Wrench, color: 'text-slate-400' },
}

export default function CategoryBadge({ category }) {
  const cfg = CONFIG[category] || CONFIG.General
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-navy-800">
      <Icon size={14} className={cfg.color} />
      {category}
    </span>
  )
}
