import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Play, 
  CheckCheck, 
  Search, 
  RefreshCw, 
  MapPin, 
  AlertCircle,
  User,
  History
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import WorkflowTracker from '../../components/common/WorkflowTracker';
import { FormField, Textarea, Input } from '../../components/common/FormControls';
import ticketService from '../../services/ticketService';
import { COMPLAINT_STATUS } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

export function MyJobsPage({ onNavigateToAssign }) {
  const { user } = useAuth();
  const [jobsList, setJobsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'complete' | 'history'
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load assigned jobs
  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const list = await ticketService.getAssignedJobs();
      setJobsList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load assigned jobs:', err);
      setJobsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Filter list
  const filteredJobs = jobsList.filter((job) => {
    if (statusFilter !== 'ALL' && job.status !== statusFilter) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (job.id && job.id.toLowerCase().includes(query)) ||
      (job.location && job.location.toLowerCase().includes(query)) ||
      (job.roomLab && job.roomLab.toLowerCase().includes(query)) ||
      (job.category && job.category.toLowerCase().includes(query)) ||
      ((job.electricianName || '').toLowerCase().includes(query)) ||
      (job.description && job.description.toLowerCase().includes(query))
    );
  });

  // Action: Start Work (In Progress)
  const handleStartWork = async (job) => {
    try {
      await ticketService.updateJobStatus(job.id, {
        newStatus: COMPLAINT_STATUS.IN_PROGRESS,
        technicianName: user?.identifier || job.electricianName || 'Electrician',
        resolutionNotes: 'Technician on site. Inspection and repair initiated.',
      });
      setSuccessMessage(`Job ${job.id} marked as In Progress.`);
      await loadJobs();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Error starting work:', err);
    }
  };

  // Action: Open Complete Dialog
  const handleOpenCompleteModal = (job) => {
    setSelectedJob(job);
    setModalMode('complete');
    setResolutionNotes('');
    setTechnicianName(user?.identifier || job.electricianName || '');
    setErrorMessage('');
  };

  // Action: Open Audit History
  const handleOpenHistoryModal = (job) => {
    setSelectedJob(job);
    setModalMode('history');
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
    setModalMode(null);
    setResolutionNotes('');
    setErrorMessage('');
  };

  // Submit Completion
  const handleCompleteSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      setErrorMessage('Please provide a brief summary of the work carried out & parts serviced.');
      return;
    }

    setIsUpdating(true);
    try {
      await ticketService.updateJobStatus(selectedJob.id, {
        newStatus: COMPLAINT_STATUS.COMPLETED,
        technicianName: technicianName.trim() || 'Electrician',
        resolutionNotes: resolutionNotes.trim(),
      });
      setSuccessMessage(`Job ${selectedJob.id} has been marked as Work Completed & Resolved.`);
      handleCloseModal();
      await loadJobs();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update job status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Assigned Work Orders"
        subtitle="Manage on-site electrical repairs, track operational status, and record maintenance completion."
        breadcrumbs={['Jobs', 'My Jobs']}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={loadJobs}
            loading={isLoading}
            icon={RefreshCw}
          >
            Refresh Jobs
          </Button>
        }
      />

      {/* Workflow Tracker Overview */}
      <WorkflowTracker currentStatus={COMPLAINT_STATUS.IN_PROGRESS} />

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 text-sm font-medium shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Jobs Card */}
      <Card
        title="Active Maintenance Tasks"
        subtitle="Technician job queue and task resolution records."
        icon={Wrench}
      >
        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === 'ALL'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({jobsList.length})
            </button>
            <button
              onClick={() => setStatusFilter(COMPLAINT_STATUS.ASSIGNED)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === COMPLAINT_STATUS.ASSIGNED
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned ({jobsList.filter((j) => j.status === COMPLAINT_STATUS.ASSIGNED).length})
            </button>
            <button
              onClick={() => setStatusFilter(COMPLAINT_STATUS.IN_PROGRESS)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === COMPLAINT_STATUS.IN_PROGRESS
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({jobsList.filter((j) => j.status === COMPLAINT_STATUS.IN_PROGRESS).length})
            </button>
            <button
              onClick={() => setStatusFilter(COMPLAINT_STATUS.COMPLETED)}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                statusFilter === COMPLAINT_STATUS.COMPLETED
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({jobsList.filter((j) => j.status === COMPLAINT_STATUS.COMPLETED).length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search technician, room, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
        </div>

        {/* Empty State or Jobs List */}
        {filteredJobs.length === 0 ? (
          <EmptyState
            title="No jobs assigned"
            description="There are currently no maintenance work orders matching this filter."
            icon={Wrench}
            actionLabel="View Assignment Desk"
            onAction={onNavigateToAssign}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const isAssigned = job.status === COMPLAINT_STATUS.ASSIGNED;
              const isInProgress = job.status === COMPLAINT_STATUS.IN_PROGRESS;
              const isCompleted = job.status === COMPLAINT_STATUS.COMPLETED || job.status === COMPLAINT_STATUS.RESOLVED;

              return (
                <div
                  key={job.id}
                  className={`bg-white rounded-lg border p-5 flex flex-col justify-between transition-all ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : isInProgress
                      ? 'border-indigo-300 ring-1 ring-indigo-200 shadow-xs'
                      : 'border-slate-200 shadow-xs hover:border-slate-300'
                  }`}
                >
                  {/* Job Header */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {job.id}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-2">
                          {job.category}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge status={job.status} size="sm" />
                        <Badge priority={job.priority} size="sm" />
                      </div>
                    </div>

                    {/* Location & Details */}
                    <div className="space-y-2 text-xs py-3 border-y border-slate-100 mb-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-900">{job.location}</span>
                        <span className="text-slate-500 font-normal">({job.roomLab})</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-500">Technician:</span>
                        <span className="font-bold text-blue-950">
                          {job.electricianName || 'Unassigned'}
                        </span>
                        {job.electricianId && (
                          <span className="text-slate-400">({job.electricianId})</span>
                        )}
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700 text-xs leading-relaxed">
                        <span className="font-semibold text-slate-900 block mb-0.5">Problem:</span>
                        {job.description}
                      </div>

                      {job.assignmentInstructions && (
                        <div className="p-2.5 bg-blue-50/50 rounded border border-blue-100 text-blue-900 text-xs">
                          <span className="font-semibold block mb-0.5 text-blue-950">Work Instructions:</span>
                          {job.assignmentInstructions}
                        </div>
                      )}

                      {job.resolutionNotes && (
                        <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-xs">
                          <span className="font-semibold block mb-0.5 text-emerald-950">Resolution Summary:</span>
                          {job.resolutionNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Job Action Buttons */}
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenHistoryModal(job)}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {isAssigned && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStartWork(job)}
                          icon={Play}
                        >
                          Start Job
                        </Button>
                      )}

                      {isInProgress && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleOpenCompleteModal(job)}
                          icon={CheckCheck}
                        >
                          Complete Work
                        </Button>
                      )}

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Completion Modal */}
      <Modal
        isOpen={modalMode === 'complete'}
        onClose={handleCloseModal}
        title={`Complete Work Order: ${selectedJob?.id}`}
        subtitle="Record technical resolution notes and sign off this maintenance task."
        footer={
          <>
            <Button variant="cancel" size="md" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="success"
              size="md"
              onClick={handleCompleteSubmit}
              loading={isUpdating}
              icon={CheckCheck}
            >
              Sign Off & Complete Work
            </Button>
          </>
        }
      >
        {selectedJob && (
          <form onSubmit={handleCompleteSubmit} className="space-y-4 text-sm" noValidate>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="font-semibold text-slate-700">Location: {selectedJob.location} - {selectedJob.roomLab}</div>
              <div className="text-slate-600 mt-1">Issue: {selectedJob.description}</div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <FormField
              label="Technician / Electrician Signature Name"
              id="tech-name"
              helperText="Staff name completing the physical maintenance"
            >
              <Input
                id="tech-name"
                value={technicianName}
                onChange={(e) => setTechnicianName(e.target.value)}
                placeholder="e.g. R. Subramanian"
              />
            </FormField>

            <FormField
              label="Work Carried Out & Parts Replaced"
              required
              id="resolution-notes"
              error={errorMessage}
              helperText="Detail the physical repair, circuit testing, replaced components (MCB, wire gauge, bulbs), or safety checks conducted."
            >
              <Textarea
                id="resolution-notes"
                rows={4}
                placeholder="e.g. Replaced faulty 16A modular switch and renewed burnt wiring terminal. Load tested at 230V normal."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                error={errorMessage}
              />
            </FormField>
          </form>
        )}
      </Modal>

      {/* Audit History Timeline Modal */}
      <Modal
        isOpen={modalMode === 'history'}
        onClose={handleCloseModal}
        title={`Audit Trail: ${selectedJob?.id}`}
        subtitle="Complete chronological timeline for this maintenance ticket."
        footer={
          <Button variant="secondary" size="md" onClick={handleCloseModal}>
            Close
          </Button>
        }
      >
        {selectedJob && (
          <div className="space-y-4">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(selectedJob.history || []).map((hist, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                  <div className="text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{hist.stage}</span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {new Date(hist.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      <span className="font-semibold text-slate-700">Actor:</span> {hist.actor}
                    </div>
                    <div className="p-2 mt-1.5 bg-slate-50 rounded border border-slate-200 text-slate-700">
                      {hist.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default MyJobsPage;
