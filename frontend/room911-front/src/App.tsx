import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/layout/ProtectedRoute'

const Login            = lazy(() => import('./components/auth/Login').then(m => ({ default: m.Login })))
const PasswordRecovery = lazy(() => import('./components/auth/PasswordRecovery').then(m => ({ default: m.PasswordRecovery })))
const AppLayout        = lazy(() => import('./components/layout/AppLayout.tsx'))
const Dashboard        = lazy(() => import('./components/dashboard/Dashboard').then(m => ({ default: m.Dashboard })))
const EmployeeMgmt     = lazy(() => import('./components/employee/EmployeeManagement').then(m => ({ default: m.EmployeeManagement })))
const AccessScanner    = lazy(() => import('./components/access/AccessScanner').then(m => ({ default: m.AccessScanner })))
const AccessMonitor    = lazy(() => import('./components/monitor/AccessMonitor').then(m => ({ default: m.AccessMonitor })))
const AccessHistory    = lazy(() => import('./components/history/AccessHistory').then(m => ({ default: m.AccessHistory })))
const AdminMgmt        = lazy(() => import('./components/admins/AdminManagement').then(m => ({ default: m.AdminManagement })))
const SystemConfig     = lazy(() => import('./components/settings/SystemConfig').then(m => ({ default: m.SystemConfig })))
const AdminSettings    = lazy(() => import('./components/settings/AdminSettings').then(m => ({ default: m.AdminSettings })))
const Analytics        = lazy(() => import('./components/analytics/AnalyticsDashboard').then(m => ({ default: m.AnalyticsDashboard })))

function Loader() {
  return (
    <div style={{ height:'100vh', display:'flex',
      alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'4px solid #0d47a1',
        borderTopColor:'transparent', borderRadius:'50%',
        animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/recovery" element={<PasswordRecovery />} />
            <Route path="/scanner"  element={<AccessScanner standalone />} />

            <Route path="/" element={
              <ProtectedRoute><AppLayout /></ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard"  element={<Dashboard />} />
              <Route path="employees"  element={<EmployeeMgmt />} />
              <Route path="monitor"    element={<AccessMonitor />} />
              <Route path="history"    element={<AccessHistory />} />
              <Route path="analytics"  element={<Analytics />} />
              <Route path="settings"   element={<AdminSettings />} />

              <Route path="admin-management" element={
                <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                  <AdminMgmt />
                </ProtectedRoute>
              } />
              <Route path="system-config" element={
                <ProtectedRoute allowedRoles={['ROLE_SUPER_ADMIN']}>
                  <SystemConfig />
                </ProtectedRoute>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  )
}