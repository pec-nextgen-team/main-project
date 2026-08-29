import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RaiseComplaintPage from './pages/complaints/RaiseComplaintPage';
import PendingApprovalsPage from './pages/approvals/PendingApprovalsPage';
import AssignElectricianPage from './pages/tickets/AssignElectricianPage';
import MyJobsPage from './pages/jobs/MyJobsPage';

function AppContent() {
  const { isAuthenticated, role } = useAuth();
  const [currentRoute, setCurrentRoute] = useState('raise-complaint');

  // Handle route switching
  const handleNavigate = (routeId) => {
    setCurrentRoute(routeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user navigated to login specifically
  if (currentRoute === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(newRole) => {
          if (newRole.includes('HOD')) {
            setCurrentRoute('hod-approvals');
          } else if (newRole.includes('Maintenance')) {
            setCurrentRoute('assign-electrician');
          } else if (newRole.includes('Electrician')) {
            setCurrentRoute('my-jobs');
          } else {
            setCurrentRoute('raise-complaint');
          }
        }}
      />
    );
  }

  // Main Institutional View
  return (
    <MainLayout
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
    >
      {currentRoute === 'raise-complaint' && (
        <RaiseComplaintPage
          onComplaintCreated={() => {
            // Optional: User can choose to review approvals
          }}
        />
      )}

      {currentRoute === 'hod-approvals' && (
        <PendingApprovalsPage
          onNavigateToRaise={() => setCurrentRoute('raise-complaint')}
        />
      )}

      {currentRoute === 'assign-electrician' && (
        <AssignElectricianPage
          onNavigateToApprovals={() => setCurrentRoute('hod-approvals')}
        />
      )}

      {currentRoute === 'my-jobs' && (
        <MyJobsPage
          onNavigateToAssign={() => setCurrentRoute('assign-electrician')}
        />
      )}
    </MainLayout>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
