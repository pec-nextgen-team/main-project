import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PendingApprovalsPage } from '../pages/approvals/PendingApprovalsPage';
import { AuthProvider } from '../context/AuthContext';
import approvalService from '../services/approvalService';

vi.mock('../services/approvalService', () => {
  return {
    default: {
      getPendingApprovals: vi.fn(),
      approve: vi.fn(),
      reject: vi.fn(),
    },
  };
});

const mockPendingApprovals = [
  {
    id: 'REQ-2026-001',
    createdAt: '2026-02-28T10:00:00.000Z',
    location: 'Main Academic Block',
    roomLab: 'ECE DSP Lab 301',
    category: 'Lighting & Fixtures',
    priority: 'HIGH',
    status: 'PENDING_HOD_APPROVAL',
    reportedBy: 'Staff John',
    description: 'Fluorescent tubes flickering continuously causing disturbance during practicals.',
  },
  {
    id: 'REQ-2026-002',
    createdAt: '2026-02-28T11:30:00.000Z',
    location: 'Mechanical Block',
    roomLab: 'CAD/CAM Centre',
    category: 'Power Outlets / Plug Points',
    priority: 'MEDIUM',
    status: 'PENDING_HOD_APPROVAL',
    reportedBy: 'Staff Mary',
    description: 'Wall power socket loose and sparking on high load.',
  },
];

function renderPendingApprovalsPage(props = {}) {
  return render(
    <AuthProvider>
      <PendingApprovalsPage {...props} />
    </AuthProvider>
  );
}

describe('PendingApprovalsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pending approvals page and displays list of complaints from service', async () => {
    approvalService.getPendingApprovals.mockResolvedValueOnce(mockPendingApprovals);

    renderPendingApprovalsPage();

    expect(screen.getByRole('heading', { name: /Departmental Approvals/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('REQ-2026-001')).toBeInTheDocument();
      expect(screen.getByText('REQ-2026-002')).toBeInTheDocument();
      expect(screen.getByText('ECE DSP Lab 301')).toBeInTheDocument();
      expect(screen.getByText('CAD/CAM Centre')).toBeInTheDocument();
    });
  });

  it('displays empty state when no pending approvals exist', async () => {
    approvalService.getPendingApprovals.mockResolvedValueOnce([]);

    renderPendingApprovalsPage();

    await waitFor(() => {
      expect(screen.getByText(/No pending approvals found/i)).toBeInTheDocument();
    });
  });

  it('allows approving a complaint with remarks and invokes approvalService.approve', async () => {
    approvalService.getPendingApprovals.mockResolvedValue(mockPendingApprovals);
    approvalService.approve.mockResolvedValueOnce({ success: true });

    renderPendingApprovalsPage();

    await waitFor(() => {
      expect(screen.getByText('REQ-2026-001')).toBeInTheDocument();
    });

    const approveButtons = screen.getAllByRole('button', { name: /^Approve$/i });
    fireEvent.click(approveButtons[0]);

    expect(screen.getByText(/Approve Complaint: REQ-2026-001/i)).toBeInTheDocument();

    const remarksInput = screen.getByPlaceholderText(/e\.g\. Verified\. Urgent requirement/i);
    fireEvent.change(remarksInput, { target: { value: 'Approved by ECE HOD for immediate work.' } });

    const confirmBtn = screen.getByRole('button', { name: /Confirm & Authorize/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(approvalService.approve).toHaveBeenCalledWith(
        'REQ-2026-001',
        expect.objectContaining({
          remarks: 'Approved by ECE HOD for immediate work.',
        })
      );
      expect(screen.getByText(/Complaint REQ-2026-001 approved successfully/i)).toBeInTheDocument();
    });
  });

  it('validates mandatory reason when rejecting a complaint and invokes approvalService.reject', async () => {
    approvalService.getPendingApprovals.mockResolvedValue(mockPendingApprovals);
    approvalService.reject.mockResolvedValueOnce({ success: true });

    renderPendingApprovalsPage();

    await waitFor(() => {
      expect(screen.getByText('REQ-2026-002')).toBeInTheDocument();
    });

    const rejectButtons = screen.getAllByRole('button', { name: /^Reject$/i });
    fireEvent.click(rejectButtons[1]);

    expect(screen.getByText(/Reject Complaint: REQ-2026-002/i)).toBeInTheDocument();

    const confirmBtn = screen.getByRole('button', { name: /Confirm Rejection/i });
    fireEvent.click(confirmBtn);

    expect(await screen.findByText(/Please provide a mandatory reason for rejecting this requisition\./i)).toBeInTheDocument();
    expect(approvalService.reject).not.toHaveBeenCalled();

    const reasonInput = screen.getByPlaceholderText(/Enter detailed reason for rejection\.\.\./i);
    fireEvent.change(reasonInput, { target: { value: 'Duplicate ticket already handled under routine sweep.' } });

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(approvalService.reject).toHaveBeenCalledWith(
        'REQ-2026-002',
        expect.objectContaining({
          reason: 'Duplicate ticket already handled under routine sweep.',
        })
      );
      expect(screen.getByText(/Complaint REQ-2026-002 has been marked as Rejected\./i)).toBeInTheDocument();
    });
  });
});
