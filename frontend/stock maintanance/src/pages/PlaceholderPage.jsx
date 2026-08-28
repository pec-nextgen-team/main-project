import React from 'react'

// Placeholder for sibling pages (Dashboard, Tickets, Pending Approvals, etc.)
// so the sidebar links resolve. Each of these would be its own page module,
// built the same way as ApprovalsRejected.jsx.
export default function PlaceholderPage({ title }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center">
        <h1 className="text-xl font-bold text-navy-900 mb-2">{title}</h1>
        <p className="text-sm text-slate-500">This page is not part of the current build.</p>
      </div>
    </div>
  )
}
