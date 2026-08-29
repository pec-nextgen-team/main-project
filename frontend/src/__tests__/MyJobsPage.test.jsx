import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MyJobsPage } from '../pages/jobs/MyJobsPage';
import { AuthProvider } from '../context/AuthContext';
import ticketService from '../services/ticketService';
import { COMPLAINT_STATUS } from '../services/complaintService';

vi.mock('../services/ticketService', () => {
  const service = {
    getAssignedJobs: vi.fn(),
    updateJobStatus: vi.fn(),
  };
  return {
    ticketService: service,
    default: service,
  };
});

const mockAssignedJobs = [
  {
    id: 'JOB-2026-301',
    createdAt: '2026-02-28T08:00:00.000Z',
    assignedAt: '2026-02-28T09:30:00.000Z',
    location: 'Central Library Building',
    roomLab: 'Digital Reading Room 1',
    category: 'Lighting & Fixtures',
    priority: 'MEDIUM',
    status: COMPLAINT_STATUS.ASSIGNED,
    electricianName: 'R. Subramanian',
    reportedBy: 'Librarian',
    description: 'LED panel lights flickering in study section.',
  },
];

function renderMyJobsPage(props = {}) {
  return render(
    <AuthProvider>
      <MyJobsPage {...props} />
    </AuthProvider>
  );
}

describe('MyJobsPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders my jobs page and displays assigned work orders', async () => {
    ticketService.getAssignedJobs.mockResolvedValue(mockAssignedJobs);

    renderMyJobsPage();

    expect(screen.getByRole('heading', { name: /Assigned Work Orders/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('JOB-2026-301')).toBeInTheDocument();
      expect(screen.getByText('Central Library Building')).toBeInTheDocument();
      expect(screen.getByText(/Digital Reading Room 1/i)).toBeInTheDocument();
    });
  });

  it('initiates job and calls ticketService.updateJobStatus with IN_PROGRESS', async () => {
    ticketService.getAssignedJobs.mockResolvedValue(mockAssignedJobs);
    ticketService.updateJobStatus.mockResolvedValueOnce({
      ...mockAssignedJobs[0],
      status: COMPLAINT_STATUS.IN_PROGRESS,
    });

    renderMyJobsPage();

    await waitFor(() => {
      expect(screen.getByText('JOB-2026-301')).toBeInTheDocument();
    });

    const startWorkBtn = screen.getByRole('button', { name: /Start Job/i });
    fireEvent.click(startWorkBtn);

    await waitFor(() => {
      expect(ticketService.updateJobStatus).toHaveBeenCalledWith(
        'JOB-2026-301',
        expect.objectContaining({
          newStatus: COMPLAINT_STATUS.IN_PROGRESS,
        })
      );
      expect(screen.getByText(/Job JOB-2026-301 marked as In Progress\./i)).toBeInTheDocument();
    });
  });
});
