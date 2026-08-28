import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/AppShell'
import NotificationsPage from './pages/NotificationsPage'
import StockAdjustmentsPage from './pages/StockAdjustmentsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/notifications" replace />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="stock/adjustments" element={<StockAdjustmentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
