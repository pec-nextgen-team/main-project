import React from 'react'
import { XCircle } from 'lucide-react'
import Breadcrumb from './Breadcrumb.jsx'

export default function PageHeader({ title, breadcrumbItems }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <XCircle size={20} className="text-red-600" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900">{title}</h2>
      </div>
      <Breadcrumb items={breadcrumbItems} />
    </div>
  )
}
