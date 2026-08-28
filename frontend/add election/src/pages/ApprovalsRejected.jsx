import React, { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import FilterPanel from '../components/FilterPanel.jsx'
import RejectedComplaintsTable from '../components/RejectedComplaintsTable.jsx'
import Pagination from '../components/Pagination.jsx'
import BottomNote from '../components/BottomNote.jsx'
import SlaInformation from '../components/SlaInformation.jsx'
import RejectionReasons from '../components/RejectionReasons.jsx'
import WorkflowSummary from '../components/WorkflowSummary.jsx'
import HelpCard from '../components/HelpCard.jsx'
import ViewComplaintModal from '../components/ViewComplaintModal.jsx'
import { fetchRejectedApprovals } from '../services/rejectedApprovalsService.js'

const INITIAL_FILTERS = {
  search: '',
  category: 'All Categories',
  subCategory: 'All Sub Categories',
  priority: 'All Priorities',
  fromDate: '',
  toDate: '',
  location: 'All Locations',
}

function parseDDMMYYYY(str) {
  const [d, m, y] = str.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export default function ApprovalsRejected() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [summaryStats, setSummaryStats] = useState([])
  const [rejectedComplaints, setRejectedComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Load rejected complaints and summary counts from the live backend.
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        const data = await fetchRejectedApprovals()
        if (cancelled) return
        setSummaryStats(data.summaryStats)
        setRejectedComplaints(data.rejectedComplaints)
      } catch (error) {
        if (!cancelled) setLoadError(error.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    return rejectedComplaints.filter((c) => {
      const term = filters.search.trim().toLowerCase()
      if (
        term &&
        !(
          c.ticketId.toLowerCase().includes(term) ||
          c.problemTitle.toLowerCase().includes(term) ||
          c.location.toLowerCase().includes(term)
        )
      ) {
        return false
      }

      if (filters.category !== 'All Categories' && c.category !== filters.category) return false

      if (
        filters.subCategory !== 'All Sub Categories' &&
        c.subCategory !== filters.subCategory
      ) {
        return false
      }

      if (filters.priority !== 'All Priorities' && c.priority !== filters.priority) return false

      if (filters.location !== 'All Locations' && c.location !== filters.location) return false

      const recordDate = parseDDMMYYYY(c.rejectedOnDate)
      if (filters.fromDate && recordDate < new Date(filters.fromDate)) return false
      if (filters.toDate && recordDate > new Date(filters.toDate)) return false

      return true
    })
  }, [filters, rejectedComplaints])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pagedComplaints = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  const handleFilterChange = (next) => {
    setFilters(next)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
  }

  const handleExport = () => {
    const headers = [
      'S.No',
      'Ticket ID',
      'Category',
      'Problem Title',
      'Location',
      'Priority',
      'Rejected On',
      'Rejected By',
      'Reason for Rejection',
    ]
    const rows = filtered.map((c) => [
      c.sNo,
      c.ticketId,
      c.category,
      c.problemTitle,
      c.location,
      c.priority,
      `${c.rejectedOnDate} ${c.rejectedOnTime}`,
      `${c.rejectedBy} (${c.rejectedByDesignation})`,
      c.rejectionReason,
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'rejected-complaints.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Approvals - Rejected"
        breadcrumbItems={['Home', 'Approvals', 'Rejected']}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {summaryStats.map((stat) => (
          <SummaryCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Main + right column */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_270px] gap-5">
        <div>
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            onExport={handleExport}
          />

          <RejectedComplaintsTable
            complaints={pagedComplaints}
            onView={setSelectedComplaint}
            loading={loading}
            loadError={loadError}
          />

          <Pagination
            totalRecords={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size)
              setCurrentPage(1)
            }}
          />

          <BottomNote />
        </div>

        <div className="space-y-4">
          <SlaInformation />
          <RejectionReasons />
          <WorkflowSummary />
          <HelpCard />
        </div>
      </div>

      <ViewComplaintModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  )
}
