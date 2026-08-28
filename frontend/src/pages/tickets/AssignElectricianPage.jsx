import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  TicketCheck, 
  Search, 
  RefreshCw, 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  UserPlus
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import WorkflowTracker from '../../components/common/WorkflowTracker';
import { FormField, Input, Select, Textarea } from '../../components/common/FormControls';
import ticketService from '../../services/ticketService';
import { COMPLAINT_STATUS, PRIORITY_LEVELS } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';

export function AssignElectricianPage({ onNavigateToApprovals }) {
  const { user } = useAuth();
  const [unassignedList, setUnassignedList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [electricianName, setElectricianName] = useState('');
  const [electricianId, setElectricianId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [priorityOverride, setPriorityOverride] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load unassigned approved tickets
  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const list = await ticketService.getUnassignedTickets();
      setUnassignedList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setUnassignedList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Filter list
  const filteredList = unassignedList.filter((item) => {
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

  // Open assignment dialog
  const handleOpenAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    setElectricianName('');
    setElectricianId('');
    setInstructions('');
    setPriorityOverride(ticket.priority);
    setFormError('');
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTicket(null);
    setElectricianName('');
    setElectricianId('');
    setInstructions('');
    setFormError('');
  };

  // Submit assignment
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!electricianName.trim()) {
      setFormError('Please enter the electrician / technician staff name.');
      return;
    }

    setIsAssigning(true);
    setFormError('');

    try {
      await ticketService.assignElectrician(selectedTicket.id, {
        electricianName: electricianName.trim(),
        electricianId: electricianId.trim(),
        instructions: instructions.trim(),
        assignedPriority: priorityOverride,
        assignedBy: user?.identifier || 'Maintenance In-charge',
      });

      setSuccessMessage(`Ticket ${selectedTicket.id} assigned to ${electricianName.trim()} successfully.`);
      handleCloseModal();
      await loadTickets();
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setFormError(err.message || 'Assignment failed.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Electrician Work Allocation"
        subtitle="Assign approved maintenance requisitions to campus technicians and electrical maintenance staff."
        breadcrumbs={['Tickets', 'Assign Electrician']}
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={loadTickets}
            icon={RefreshCw}
          >
            Refresh Queue
          </Button>
        }
      />

      {/* Workflow Tracker */}
      <WorkflowTracker currentStatus={COMPLAINT_STATUS.APPROVED} />

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 text-sm font-medium shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Assignment Table Card */}
      <Card
        title="Approved Requisitions Waiting for Assignment"
        subtitle="The following tickets have received departmental HOD approval and require technician dispatch."
        icon={TicketCheck}
      >
        {/* Search Bar & Stats */}
        <div className="mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search approved tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-300 bg-white text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Pending Dispatch:{' '}
            <span className="font-bold text-slate-900">{unassignedList.length}</span>
          </div>
        </div>

        {/* Empty state or table */}
        {filteredList.length === 0 ? (
          <EmptyState
            title="No unassigned tickets found"
            description="There are currently no approved maintenance tickets waiting for technician allocation."
            icon={TicketCheck}
            actionLabel="Check HOD Approvals"
            onAction={onNavigateToApprovals}
          />
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Ticket ID</th>
                  <th className="py-3 px-4">Approved Date</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">HOD Clearance</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredList.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {ticket.id}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {ticket.approvedAt
                        ? new Date(ticket.approvedAt).toLocaleDateString()
                        : new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-900">
                      <div className="font-semibold">{ticket.location}</div>
                      <div className="text-slate-500 text-[11px]">{ticket.roomLab}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium whitespace-nowrap">
                      {ticket.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge priority={ticket.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                      </div>
                      {ticket.hodRemarks && (
                        <div className="text-[11px] text-slate-500 italic truncate max-w-xs">
                          "{ticket.hodRemarks}"
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenAssignModal(ticket)}
                        icon={UserPlus}
                      >
                        Assign Electrician
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Assignment Modal */}
      <Modal
        isOpen={!!selectedTicket}
        onClose={handleCloseModal}
        title={`Assign Electrician: ${selectedTicket?.id}`}
        subtitle="Allocate this authorized work order to an on-duty electrician technician."
        footer={
          <>
            <Button variant="cancel" size="md" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleAssignSubmit}
              loading={isAssigning}
              icon={UserCheck}
            >
              Confirm Assignment
            </Button>
          </>
        }
      >
        {selectedTicket && (
          <form onSubmit={handleAssignSubmit} className="space-y-4 text-sm" noValidate>
            {/* Ticket details brief */}
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Location:</span>
                <span className="font-bold text-slate-900">{selectedTicket.location} ({selectedTicket.roomLab})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Fault Description:</span>
                <span className="text-slate-800 font-medium max-w-xs truncate text-right">{selectedTicket.description}</span>
              </div>
              {selectedTicket.hodRemarks && (
                <div className="flex justify-between text-emerald-800">
                  <span className="font-semibold">HOD Remarks:</span>
                  <span className="italic">{selectedTicket.hodRemarks}</span>
                </div>
              )}
            </div>

            {formError && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Electrician Name Input */}
            <FormField
              label="Electrician / Technician Staff Name"
              required
              id="electrician-name"
              error={formError}
              helperText="Enter the name of the designated technician or maintenance contractor"
            >
              <Input
                id="electrician-name"
                placeholder="e.g. R. Subramanian / Electrical Maintenance Team A"
                value={electricianName}
                onChange={(e) => setElectricianName(e.target.value)}
                error={formError}
              />
            </FormField>

            {/* Electrician Staff ID */}
            <FormField
              label="Technician Staff ID / Phone (Optional)"
              id="electrician-id"
              helperText="Staff ID or mobile contact for campus dispatch tracking"
            >
              <Input
                id="electrician-id"
                placeholder="e.g. PEC/TECH/045 or 9840XXXXXX"
                value={electricianId}
                onChange={(e) => setElectricianId(e.target.value)}
              />
            </FormField>

            {/* Priority override */}
            <FormField
              label="Dispatch Priority"
              id="assign-priority"
              helperText="Confirm or elevate priority for technician scheduling"
            >
              <Select
                id="assign-priority"
                value={priorityOverride}
                onChange={(e) => setPriorityOverride(e.target.value)}
                options={[
                  { value: PRIORITY_LEVELS.LOW, label: 'Low — Routine maintenance' },
                  { value: PRIORITY_LEVELS.MEDIUM, label: 'Medium — Standard departmental requirement' },
                  { value: PRIORITY_LEVELS.HIGH, label: 'High — Immediate attention requested' },
                  { value: PRIORITY_LEVELS.EMERGENCY, label: 'Emergency — High hazard breakdown' },
                ]}
              />
            </FormField>

            {/* Special Instructions */}
            <FormField
              label="Technical Work Instructions / Required Spares"
              id="assign-instructions"
              helperText="Specify testing equipment, replacement parts, or power shutdown clearance instructions"
            >
              <Textarea
                id="assign-instructions"
                rows={3}
                placeholder="e.g. Carry 3-phase multimeter and replacement MCB switchboard units..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </FormField>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default AssignElectricianPage;
