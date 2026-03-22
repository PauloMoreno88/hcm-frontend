import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'
import { AddVehiclePage } from '../pages/AddVehiclePage'
import { EditVehiclePage } from '../pages/EditVehiclePage'
import { VehiclesPage } from '../pages/VehiclesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { HistoryPage } from '../pages/HistoryPage'
import { AddMaintenancePage } from '../pages/AddMaintenancePage'
import { StatsPage } from '../pages/StatsPage'
import { ProfilePage } from '../pages/ProfilePage'
import { VehicleHealthSetupPage } from '../pages/VehicleHealthSetupPage'
import { EditMaintenancePage } from '../pages/EditMaintenancePage'
import { useAuthStore } from '../store/authStore'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute><HistoryPage /></PrivateRoute>
        } />
        <Route path="/add-maintenance" element={
          <PrivateRoute><AddMaintenancePage /></PrivateRoute>
        } />
        <Route path="/vehicles" element={
          <PrivateRoute><VehiclesPage /></PrivateRoute>
        } />
        <Route path="/add-vehicle" element={
          <PrivateRoute><AddVehiclePage /></PrivateRoute>
        } />
        <Route path="/edit-vehicle/:id" element={
          <PrivateRoute><EditVehiclePage /></PrivateRoute>
        } />
        <Route path="/stats" element={
          <PrivateRoute><StatsPage /></PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
        <Route path="/health-setup" element={
          <PrivateRoute><VehicleHealthSetupPage /></PrivateRoute>
        } />
        <Route path="/edit-maintenance/:id" element={
          <PrivateRoute><EditMaintenancePage /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
