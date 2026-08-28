import { useEffect, useMemo, useState } from 'react';
import { Loader2, Info } from 'lucide-react';
import SummaryCards from '../components/SummaryCards.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ComplaintsTable from '../components/ComplaintsTable.jsx';
import Pagination from '../components/Pagination.jsx';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal.jsx';
import { SLACard, NeedHelpCard, WorkflowSummaryCard } from '../components/InfoCards.jsx';
import { getMyComplaints, getMyComplaintsSummary } from '../api/complaintsApi.js';
import { exportComplaintsToCsv } from '../utils/csvExport.js';
import { MOCK_REFERENCE_DATE } from '../data/sampleComplaints.js';

const DEFAULT_FILTERS = {
  search: '',
  status: 'All Status',
  category: 'All Category',
  fromDate: '',
  toDate: '',
};

export default function MyComplaints() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [complaints, setComplaints] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSample, setIsSample] = useState(false);
  const [referenceDate, setReferenceDate] = useState(new Date());

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Debounce the free-text search so we don't fetch on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(filters.search), 300);
    return () => clearTimeout(t);
  }, [filters.search]);

  // Refetch whenever a filter or the page/limit changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getMyComplaints({
      search: debouncedSearch,
      status: filters.status,
      category: filters.category,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      page,
      limit,
    }).then((result) => {
      if (cancelled) return;
      setComplaints(result.data);
      setTotal(result.total);
      setIsSample(result.isSample);
      setReferenceDate(result.isSample ? MOCK_REFERENCE_DATE : new Date());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, filters.status, filters.category, filters.fromDate, filters.toDate, page, limit]);

  // Load the summary cards once (they reflect ALL complaints, not the filtered table).
  useEffect(() => {
    let cancelled = false;
    setSummaryLoading(true);
    getMyComplaintsSummary().then((result) => {
      if (!cancelled) {
        setSummary(result);
        setSummaryLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleFilterChange(partial) {
    setFilters((prev) => ({ ...prev, ...partial }));
    setPage(1);
  }

  function handleReset() {
    setFilters(DEFAULT_FILTERS);
    setDebouncedSearch('');
    setPage(1);
  }

  async function handleExport() {
    const result = await getMyComplaints({
      search: debouncedSearch,
      status: filters.status,
      category: filters.category,
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      page: 1,
      limit: Math.max(total, 1),
    });
    exportComplaintsToCsv(result.data, 'my-complaints.csv');
  }

  const startIndex = useMemo(() => (page - 1) * limit, [page, limit]);

  return (
    <div>
      {/* Page heading + breadcrumb */}
      <div className="mb-6">
        <nav className="mb-1 text-xs text-slate-500">
          <span>Home</span>
          <span className="mx-1.5">/</span>
          <span className="font-medium text-slate-700">My Complaints</span>
        </nav>
        <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">My Complaints</h2>
      </div>

      <SummaryCards summary={summary} loading={summaryLoading} />

      {isSample && (
        <div className="mb-6 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            Showing sample data because the backend at <code>/api/complaints/my</code> isn't reachable yet.
            Connect the Express/Prisma API to see live records here.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <FilterBar filters={filters} onChange={handleFilterChange} onReset={handleReset} onExport={handleExport} />

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
            <h3 className="mb-4 text-base font-bold text-slate-800">Complaints List</h3>

            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading complaints...
              </div>
            ) : (
              <>
                <ComplaintsTable
                  complaints={complaints}
                  startIndex={startIndex}
                  referenceDate={referenceDate}
                  onView={setSelectedComplaint}
                />
                <div className="mt-4">
                  <Pagination
                    page={page}
                    limit={limit}
                    total={total}
                    onPageChange={setPage}
                    onLimitChange={(l) => {
                      setLimit(l);
                      setPage(1);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right info column */}
        <div className="space-y-6">
          <SLACard showPolicyLink approvalLabel="approval/processing" />
          <WorkflowSummaryCard />
          <NeedHelpCard variant="green" />
        </div>
      </div>

      <ComplaintDetailsModal
        complaint={selectedComplaint}
        referenceDate={referenceDate}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
}
