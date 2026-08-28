import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react'

export default function Pagination({ page, totalPages, pageSize, totalItems, onPageChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, Math.min(page - 1, totalPages - 3)),
    Math.max(0, Math.min(page - 1, totalPages - 3)) + 3,
  )

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle px-4 py-3.5 sm:flex-row sm:px-5">
      <p className="text-[13px] text-ink-500">
        Showing <span className="font-semibold text-ink-700">{start}</span> to{' '}
        <span className="font-semibold text-ink-700">{end}</span> of{' '}
        <span className="font-semibold text-ink-700">{totalItems}</span> notifications
      </p>

      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(1)}
          className="rounded-md p-1.5 text-ink-500 hover:bg-app disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md p-1.5 text-ink-500 hover:bg-app disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`h-8 w-8 rounded-md text-[13px] font-semibold transition-colors ${
              p === page ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-app'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md p-1.5 text-ink-500 hover:bg-app disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="rounded-md p-1.5 text-ink-500 hover:bg-app disabled:opacity-30 disabled:hover:bg-transparent"
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
