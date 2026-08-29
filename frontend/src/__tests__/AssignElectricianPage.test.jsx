import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignElectricianPage } from '../pages/tickets/AssignElectricianPage';
import { AuthProvider } from '../context/AuthContext';
import ticketService from '../services/ticketService';

vi.mock('../services/ticketService', () => {
  const service = {
    getUnassignedTickets: vi.fn(),
    assignElectrician: vi.fn(),
    getAssignedJobs: vi.fn(),
    updateJobStatus: vi.fn(),
  };
  return {
    ticketService: service,
    default: service,
  };
});

const mockUnassignedTickets = [
  {
    id: 'TICK-2026-101',
    createdAt: '2026-02-28T09:00:00.000Z',
    approvedAt: '2026-02-28T10:30:00.000Z',
    location: 'Electrical Sciences Block',
    roomLab: 'Machines Lab II',
    category: 'Laboratory Equipment Power Feed',
    priority: 'HIGH',
    status: 'APPROVED_BY_HOD',
    reportedBy: 'Prof. Kumar',
    hodRemarks: 'Approved for urgent repair before 2 PM session.',
    description: '3-phase AC supply terminal loose on test motor set.',
  },
];

function renderAssignElectricianPage(props = {}) {
  return render(
    <AuthProvider>
      <AssignElectricianPage {...props} />
    </AuthProvider>
  );
}

describe('AssignElectricianPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders assignment queue and displays approved unassigned tickets', async () => {
    ticketService.getUnassignedTickets.mockResolvedValueOnce(mockUnassignedTickets);

    renderAssignElectricianPage();

    expect(screen.getByRole('heading', { name: /Electrician Work Allocation/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('TICK-2026-101')).toBeInTheDocument();
      expect(screen.getByText('Electrical Sciences Block')).toBeInTheDocument();
      expect(screen.getByText('Machines Lab II')).toBeInTheDocument();
      expect(screen.getByText('Laboratory Equipment Power Feed')).toBeInTheDocument();
    });
  });

  it('displays empty state when all approved tickets have been assigned', async () => {
    ticketService.getUnassignedTickets.mockResolvedValueOnce([]);

    renderAssignElectricianPage();

    await waitFor(() => {
      expect(screen.getByText(/No unassigned tickets found/i)).toBeInTheDocument();
    });
  });

  it('opens assignment dialog and validates mandatory electrician name', async () => {
    ticketService.getUnassignedTickets.mockResolvedValue(mockUnassignedTickets);

    renderAssignElectricianPage();

    await waitFor(() => {
      expect(screen.getByText('TICK-2026-101')).toBeInTheDocument();
    });

    const assignBtn = screen.getByRole('button', { name: /Assign Electrician/i });
    fireEvent.click(assignBtn);

    expect(screen.getByText(/Assign Electrician: TICK-2026-101/i)).toBeInTheDocument();

    const confirmAssignBtn = screen.getByRole('button', { name: /Confirm Assignment/i });
    fireEvent.click(confirmAssignBtn);

    expect((await screen.findAllByText(/Please enter the electrician \/ technician staff name\./i)).length).toBeGreaterThan(0);
    expect(ticketService.assignElectrician).not.toHaveBeenCalled();
  });

  it('successfully assigns an electrician and invokes ticketService.assignElectrician', async () => {
    ticketService.getUnassignedTickets.mockResolvedValue(mockUnassignedTickets);
    ticketService.assignElectrician.mockResolvedValueOnce({
      ...mockUnassignedTickets[0],
      status: 'ASSIGNED_TO_ELECTRICIAN',
      electricianName: 'R. Subramanian',
      electricianId: 'PEC/ELEC/042',
    });

    renderAssignElectricianPage();

    await waitFor(() => {
      expect(screen.getByText('TICK-2026-101')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Assign Electrician/i }));

    const nameInput = screen.getByLabelText(/Electrician \/ Technician Staff Name/i);
    fireEvent.change(nameInput, { target: { value: 'R. Subramanian' } });

    const idInput = screen.getByLabelText(/Technician Staff ID \/ Phone/i);
    fireEvent.change(idInput, { target: { value: 'PEC/ELEC/042' } });

    const instructionsInput = screen.getByLabelText(/Technical Work Instructions \/ Required Spares/i);
    fireEvent.change(instructionsInput, { target: { value: 'Check busbar insulation before restoring power.' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Assignment/i }));

    await waitFor(() => {
      expect(ticketService.assignElectrician).toHaveBeenCalledWith(
        'TICK-2026-101',
        expect.objectContaining({
          electricianName: 'R. Subramanian',
          electricianId: 'PEC/ELEC/042',
          instructions: 'Check busbar insulation before restoring power.',
        })
      );
      expect(screen.getByText(/Ticket TICK-2026-101 assigned to R\. Subramanian successfully\./i)).toBeInTheDocument();
    });
  });
});
