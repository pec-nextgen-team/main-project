import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export default function Pagination({ page, limit, total, onPageChange, onLimitChange }) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(total, page * limit);

  const pageNumbers = getPageWindow(page, totalPages);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-1 pt-4 sm:flex-row">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>
          Showing {start} to {end} of {total} records
        </span>
        <label className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Per page</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1">
        <PageButton onClick={() => onPageChange(1)} disabled={page === 1} label="First page">
          <ChevronsLeft className="h-4 w-4" />
        </PageButton>
        <PageButton onClick={() => onPageChange(page - 1)} disabled={page === 1} label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </PageButton>

        {pageNumbers.map((n, i) =>
          n === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={`h-8 w-8 rounded-lg text-sm font-semibold transition-colors ${
                n === page ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {n}
            </button>
          )
        )}

        <PageButton onClick={() => onPageChange(page + 1)} disabled={page === totalPages} label="Next page">
          <ChevronRight className="h-4 w-4" />
        </PageButton>
        <PageButton onClick={() => onPageChange(totalPages)} disabled={page === totalPages} label="Last page">
          <ChevronsRight className="h-4 w-4" />
        </PageButton>
      </div>
    </div>
  );
}

function PageButton({ onClick, disabled, label, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function getPageWindow(page, totalPages, windowSize = 5) {
  if (totalPages <= windowSize + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
    result.push(sorted[i]);
  }
  return result;
}
