import React from 'react'

export default function RejectionReasonBadge({ reason }) {
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium bg-red-50 text-red-700 whitespace-nowrap">
      {reason}
    </span>
  )
}
