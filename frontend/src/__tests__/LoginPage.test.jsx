import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginPage } from '../pages/auth/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import authService, { ROLES } from '../services/authService';

// Mock authService
vi.mock('../services/authService', () => {
  return {
    ROLES: {
      STAFF_STUDENT: 'Staff / Student',
      HOD: 'Department HOD',
      MAINTENANCE_INCHARGE: 'Maintenance In-charge',
      ELECTRICIAN: 'Electrician / Technician',
    },
    default: {
      getCurrentSession: vi.fn(() => null),
      login: vi.fn(),
      logout: vi.fn(),
      switchRole: vi.fn(),
    },
  };
});

function renderLoginPage(props = {}) {
  return render(
    <AuthProvider>
      <LoginPage {...props} />
    </AuthProvider>
  );
}

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login page with institutional title and form elements', () => {
    renderLoginPage();

    expect(screen.getAllByText(/PANIMALAR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ENGINEERING COLLEGE/i).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Institutional ID \/ Staff ID \/ Reg No/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Designation \/ System Role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
  });

  it('provides username and password input fields that accept text', () => {
    renderLoginPage();

    const idInput = screen.getByLabelText(/Institutional ID \/ Staff ID \/ Reg No/i);
    const passwordInput = screen.getByLabelText(/^Password/i);

    fireEvent.change(idInput, { target: { value: 'PEC-STAFF-2024' } });
    fireEvent.change(passwordInput, { target: { value: 'secretPassword123' } });

    expect(idInput.value).toBe('PEC-STAFF-2024');
    expect(passwordInput.value).toBe('secretPassword123');
  });

  it('validates empty institutional ID on submit', async () => {
    renderLoginPage();

    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter your Institutional ID \/ Register Number\./i)).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('validates empty password when ID is provided', async () => {
    renderLoginPage();

    const idInput = screen.getByLabelText(/Institutional ID \/ Staff ID \/ Reg No/i);
    fireEvent.change(idInput, { target: { value: 'PEC-STAFF-2024' } });

    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter your account password\./i)).toBeInTheDocument();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('toggles password visibility when show/hide button is clicked', () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/^Password/i);
    expect(passwordInput.type).toBe('password');

    const toggleBtn = screen.getByRole('button', { name: /Show password/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(screen.getByRole('button', { name: /Hide password/i }));
    expect(passwordInput.type).toBe('password');
  });

  it('submits credentials and calls onLoginSuccess callback', async () => {
    const handleSuccess = vi.fn();
    authService.login.mockResolvedValueOnce({
      identifier: 'PEC-HOD-01',
      role: ROLES.HOD,
      token: 'mock_token',
    });

    renderLoginPage({ onLoginSuccess: handleSuccess });

    fireEvent.change(screen.getByLabelText(/Institutional ID \/ Staff ID \/ Reg No/i), {
      target: { value: 'PEC-HOD-01' },
    });
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'hodpass123' },
    });
    fireEvent.change(screen.getByLabelText(/Designation \/ System Role/i), {
      target: { value: ROLES.HOD },
    });

    fireEvent.click(screen.getByRole('button', { name: /Sign In to Portal/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        identifier: 'PEC-HOD-01',
        password: 'hodpass123',
        role: ROLES.HOD,
      });
      expect(handleSuccess).toHaveBeenCalledWith(ROLES.HOD);
    });
  });
});
