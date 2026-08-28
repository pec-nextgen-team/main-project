import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Clock, 
  RefreshCw, 
  ShieldCheck,
  AlertCircle,
  Building,
  MapPin,
  Calendar,
  User,
  Filter
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import WorkflowTracker from '../../components/common/WorkflowTracker';
import { FormField, Textarea, Input } from '../../components/common/FormControls';
import approvalService from '../../services/approvalService';
import { COMPLAINT_STATUS } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

export function PendingApprovalsPage({ onNavigateToRaise }) {
  const { user } = useAuth();
  const [pendingList, setPendingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject' | 'view'
  const [remarks, setRemarks] = useState('');
  const [actionError, setActionError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load pending approvals from service
  const loadApprovals = async () => {
    setIsLoading(true);
    try {
      const data = await approvalService.getPendingApprovals();
      setPendingList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load approvals:', err);
      setPendingList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  // Filter list by search query
  const filteredList = pendingList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      (item.id && item.id.toLowerCase().includes(query)) ||
      (item.location && item.location.toLowerCase().includes(query)) ||
      (item.roomLab && item.roomLab.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });

  // Open action modal
  const handleOpenAction = (complaint, type) => {
    setSelectedComplaint(complaint);
    setActionType(type);
    setRemarks('');
    setActionError('');
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedComplaint(null);
    setActionType(null);
    setRemarks('');
    setActionError('');
  };

  // Confirm Approval / Rejection
  const handleConfirmAction = async () => {
    if (!selectedComplaint) return;
    setActionError('');
    setIsProcessing(true);

    try {
      if (actionType === 'approve') {
        await approvalService.approve(selectedComplaint.id, {
          remarks,
          approvedBy: user?.identifier || 'Head of Department',
        });
        setSuccessMessage(`Complaint ${selectedComplaint.id} approved successfully and forwarded for electrician assignment.`);
      } else if (actionType === 'reject') {
        if (!remarks.trim()) {
          setActionError('Please provide a mandatory reason for rejecting this requisition.');
          setIsProcessing(false);
          return;
        }
        await approvalService.reject(selectedComplaint.id, {
          reason: remarks,
          rejectedBy: user?.identifier || 'Head of Department',
        });
        setSuccessMessage(`Complaint ${selectedComplaint.id} has been marked as Rejected.`);
      }
      handleCloseModal();
      await loadApprovals();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setActionError(err.message || 'Operation failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Departmental Approvals"
        subtitle="Review, verify, and authorize maintenance requisitions raised within your department."
        breadcrumbs={['Approvals', 'Pending Approvals']}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={loadApprovals}
            icon={RefreshCw}
          >
            Refresh Queue
          </Button>
        }
      />

      {/* Workflow Tracker Overview */}
      <WorkflowTracker currentStatus={COMPLAINT_STATUS.PENDING} />

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Approvals Table / Content Card */}
      <Card
        title="Pending Departmental Requisitions"
        subtitle="The following complaints require HOD authorization before technical assignment."
        icon={ShieldCheck}
      >
        {/* Search & Filter Bar */}
        <div className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, location, or issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Pending Count:{' '}
            <span className="font-bold text-slate-900">{pendingList.length}</span>
          </div>
        </div>

        {/* List / Table or Empty State */}
        {filteredList.length === 0 ? (
          <EmptyState
            title="No pending approvals found"
            description="There are currently no maintenance complaints awaiting departmental review."
            icon={CheckCircle2}
            actionLabel="Raise New Complaint"
            onAction={onNavigateToRaise}
          />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Complaint ID</th>
                  <th className="py-3 px-4">Raised On</th>
                  <th className="py-3 px-4">Location & Facility</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">HOD Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredList.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {complaint.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-900">
                      <div className="font-semibold">{complaint.location}</div>
                      <div className="text-slate-500 text-[11px]">{complaint.roomLab}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                      {complaint.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge priority={complaint.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge status={complaint.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenAction(complaint, 'view')}
                          icon={Eye}
                          title="View Full Details"
                        >
                          View
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleOpenAction(complaint, 'approve')}
                          icon={CheckCircle2}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleOpenAction(complaint, 'reject')}
                          icon={XCircle}
                        >
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Review / Approval / Rejection Modal */}
      <Modal
        isOpen={!!selectedComplaint}
        onClose={handleCloseModal}
        title={
          actionType === 'approve'
            ? `Approve Complaint: ${selectedComplaint?.id}`
            : actionType === 'reject'
            ? `Reject Complaint: ${selectedComplaint?.id}`
            : `Complaint Details: ${selectedComplaint?.id}`
        }
        subtitle={
          actionType === 'approve'
            ? 'Verify departmental authorization and forward to maintenance admin'
            : actionType === 'reject'
            ? 'Provide mandatory justification for rejecting this request'
            : 'Complete audit details for this maintenance requisition'
        }
        footer={
          actionType === 'view' ? (
            <Button variant="secondary" size="md" onClick={handleCloseModal}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="cancel" size="md" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'approve' ? 'success' : 'danger'}
                size="md"
                onClick={handleConfirmAction}
                loading={isProcessing}
                icon={actionType === 'approve' ? CheckCircle2 : XCircle}
              >
                {actionType === 'approve' ? 'Confirm & Authorize' : 'Confirm Rejection'}
              </Button>
            </>
          )
        }
      >
        {selectedComplaint && (
          <div className="space-y-4 text-sm">
            {/* Info Summary Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Location / Facility
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {selectedComplaint.location} — {selectedComplaint.roomLab}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Category & Priority
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-medium text-slate-800">
                    {selectedComplaint.category}
                  </span>
                  <Badge priority={selectedComplaint.priority} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Reported By
                </span>
                <span className="text-xs text-slate-700 font-medium">
                  {selectedComplaint.reportedBy}
                </span>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Date Registered
                </span>
                <span className="text-xs text-slate-700">
                  {new Date(selectedComplaint.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1">
                Description of Issue
              </span>
              <div className="p-3 bg-slate-100 rounded-md border border-slate-200 text-xs text-slate-800 leading-relaxed">
                {selectedComplaint.description}
              </div>
            </div>

            {/* Action Inputs */}
            {actionType === 'approve' && (
              <FormField
                label="HOD Approval Remarks (Optional)"
                helperText="Add any specific instructions for the maintenance team or technician"
              >
                <Textarea
                  placeholder="e.g. Verified. Urgent requirement for lab exam session tomorrow."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                />
              </FormField>
            )}

            {actionType === 'reject' && (
              <FormField
                label="Rejection Justification"
                required
                error={actionError}
                helperText="Explain the reason for rejection (e.g. Duplicate request, unauthorized equipment)"
              >
                <Textarea
                  placeholder="Enter detailed reason for rejection..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  error={actionError}
                />
              </FormField>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default PendingApprovalsPage;
