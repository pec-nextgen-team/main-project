import React from 'react'
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

export default function Pagination({
  totalRecords,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) {
  const start = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const end = Math.min(currentPage * pageSize, totalRecords)

  const isFirst = currentPage <= 1
  const isLast = currentPage >= totalPages

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-4">
      <p className="text-[12.5px] text-slate-500">
        Showing {start} to {end} of {totalRecords} records
      </p>

      <div className="flex items-center gap-3">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="text-[12.5px] border border-slate-200 rounded-md px-2 py-1.5 text-slate-600 bg-white"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>

        <div className="flex items-center gap-1">
          <PagBtn disabled={isFirst} onClick={() => onPageChange(1)}>
            <ChevronsLeft size={14} />
          </PagBtn>
          <PagBtn disabled={isFirst} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeft size={14} />
          </PagBtn>
          <span className="w-7 h-7 flex items-center justify-center rounded-md bg-brand-blue text-white text-[12.5px] font-semibold">
            {currentPage}
          </span>
          <PagBtn disabled={isLast} onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRight size={14} />
          </PagBtn>
          <PagBtn disabled={isLast} onClick={() => onPageChange(totalPages)}>
            <ChevronsRight size={14} />
          </PagBtn>
        </div>
      </div>
    </div>
  )
}

function PagBtn({ children, disabled, onClick }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-7 h-7 flex items-center justify-center rounded-md border text-slate-500 transition-colors ${
        disabled
          ? 'border-slate-100 text-slate-300 cursor-not-allowed'
          : 'border-slate-200 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  )
}
