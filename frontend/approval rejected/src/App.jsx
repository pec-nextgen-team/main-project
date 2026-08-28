import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ApprovalsRejected from './pages/ApprovalsRejected.jsx'
import PlaceholderPage from './pages/PlaceholderPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/approvals/rejected" replace />} />
        <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
        <Route path="/raise-complaint" element={<PlaceholderPage title="Raise Complaint" />} />
        <Route path="/my-complaints" element={<PlaceholderPage title="My Complaints" />} />
        <Route path="/approvals/pending" element={<PlaceholderPage title="Approvals - Pending Approvals" />} />
        <Route path="/approvals/approved" element={<PlaceholderPage title="Approvals - Approved" />} />
        <Route path="/approvals/rejected" element={<ApprovalsRejected />} />
        <Route path="/tickets" element={<PlaceholderPage title="Tickets" />} />
        <Route path="/requests" element={<PlaceholderPage title="Requests" />} />
        <Route path="/electrician" element={<PlaceholderPage title="Electrician" />} />
        <Route path="/stock-management" element={<PlaceholderPage title="Stock Management" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="/notifications" element={<PlaceholderPage title="Notifications" />} />
        <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        <Route path="*" element={<Navigate to="/approvals/rejected" replace />} />
      </Route>
    </Routes>
  )
}
