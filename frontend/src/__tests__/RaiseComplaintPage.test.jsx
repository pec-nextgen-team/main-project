import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RaiseComplaintPage } from '../pages/complaints/RaiseComplaintPage';
import { AuthProvider } from '../context/AuthContext';
import complaintService, { PRIORITY_LEVELS } from '../services/complaintService';

vi.mock('../services/complaintService', () => {
  const PRIORITY_LEVELS = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    EMERGENCY: 'Emergency',
  };
  const COMPLAINT_STATUS = {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN PROGRESS',
    COMPLETED: 'COMPLETED',
    RESOLVED: 'RESOLVED',
  };
  const service = {
    createComplaint: vi.fn(),
    getComplaints: vi.fn(),
    getComplaintById: vi.fn(),
  };

  return {
    PRIORITY_LEVELS,
    COMPLAINT_STATUS,
    complaintService: service,
    default: service,
  };
});

function renderRaiseComplaintPage(props = {}) {
  return render(
    <AuthProvider>
      <RaiseComplaintPage {...props} />
    </AuthProvider>
  );
}

describe('RaiseComplaintPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the complaint requisition form with all sections and controls', () => {
    renderRaiseComplaintPage();

    expect(screen.getByRole('heading', { name: /Raise Maintenance Complaint/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Block \/ Building \/ Facility/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Room \/ Lab \/ Hall Identifier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Issue Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Urgency \/ Priority Level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Detailed Description of Fault \/ Breakdown/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Requisition/i })).toBeInTheDocument();
  });

  it('validates mandatory fields on submission', async () => {
    renderRaiseComplaintPage();

    const form = screen.getByRole('button', { name: /Submit Requisition/i }).closest('form');
    fireEvent.submit(form);

    expect(await screen.findByText(/Please specify the Campus Block \/ Department Building\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please specify the Room Number \/ Laboratory Name\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please select or enter the issue category\./i)).toBeInTheDocument();
    expect(screen.getByText(/Please provide a detailed description of the maintenance issue\./i)).toBeInTheDocument();
    expect(complaintService.createComplaint).not.toHaveBeenCalled();
  });

  it('allows selection of valid category values and priority level', () => {
    renderRaiseComplaintPage();

    const categorySelect = screen.getByLabelText(/Issue Category/i);
    fireEvent.change(categorySelect, { target: { value: 'Lighting & Fixtures' } });
    expect(categorySelect.value).toBe('Lighting & Fixtures');

    const prioritySelect = screen.getByLabelText(/Urgency \/ Priority Level/i);
    fireEvent.change(prioritySelect, { target: { value: PRIORITY_LEVELS.HIGH } });
    expect(prioritySelect.value).toBe(PRIORITY_LEVELS.HIGH);
  });

  it('invokes complaintService.createComplaint with form data when valid and displays confirmation banner', async () => {
    const mockCreated = {
      id: 'REQ-2026-999',
      location: 'Mechanical Block A',
      roomLab: 'Fluid Mechanics Lab 102',
      category: 'Switchboard & Breakers',
      priority: PRIORITY_LEVELS.HIGH,
      description: 'Main breaker tripping repeatedly when starting test pump rig.',
      contactNumber: '9876543210',
      contactEmail: 'staff@panimalar.ac.in',
      status: 'PENDING_HOD_APPROVAL',
      createdAt: new Date().toISOString(),
    };

    complaintService.createComplaint.mockResolvedValueOnce(mockCreated);
    const handleComplaintCreated = vi.fn();

    renderRaiseComplaintPage({ onComplaintCreated: handleComplaintCreated });

    fireEvent.change(screen.getByLabelText(/Block \/ Building \/ Facility/i), {
      target: { name: 'location', value: 'Mechanical Block A' },
    });
    fireEvent.change(screen.getByLabelText(/Room \/ Lab \/ Hall Identifier/i), {
      target: { name: 'roomLab', value: 'Fluid Mechanics Lab 102' },
    });
    fireEvent.change(screen.getByLabelText(/Issue Category/i), {
      target: { name: 'category', value: 'Switchboard & Breakers' },
    });
    fireEvent.change(screen.getByLabelText(/Urgency \/ Priority Level/i), {
      target: { name: 'priority', value: PRIORITY_LEVELS.HIGH },
    });
    fireEvent.change(screen.getByLabelText(/Detailed Description of Fault \/ Breakdown/i), {
      target: { name: 'description', value: 'Main breaker tripping repeatedly when starting test pump rig.' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Phone \/ Extension/i), {
      target: { name: 'contactNumber', value: '9876543210' },
    });
    fireEvent.change(screen.getByLabelText(/Institutional Email Address/i), {
      target: { name: 'contactEmail', value: 'staff@panimalar.ac.in' },
    });

    const form = screen.getByRole('button', { name: /Submit Requisition/i }).closest('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(complaintService.createComplaint).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'Mechanical Block A',
          roomLab: 'Fluid Mechanics Lab 102',
          category: 'Switchboard & Breakers',
          priority: PRIORITY_LEVELS.HIGH,
          description: 'Main breaker tripping repeatedly when starting test pump rig.',
          contactNumber: '9876543210',
          contactEmail: 'staff@panimalar.ac.in',
        }),
        expect.any(String)
      );
      expect(screen.getByText(/Complaint Registered Successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/REQ-2026-999/i)).toBeInTheDocument();
    });
  });
});
