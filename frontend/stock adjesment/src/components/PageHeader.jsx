import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function PageHeader({ title, crumbs }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">{title}</h2>
      <p className="mt-0.5 flex flex-wrap items-center gap-1 text-[13px] text-ink-400">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={crumb.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 text-ink-300" />}
              {crumb.path && !isLast ? (
                <Link to={crumb.path} className="text-ink-500 hover:text-brand-600">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-ink-700' : 'text-ink-500'}>{crumb.label}</span>
              )}
            </span>
          )
        })}
      </p>
    </div>
  )
}
