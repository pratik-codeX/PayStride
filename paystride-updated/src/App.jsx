import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import WorkerLoginPage from './pages/WorkerLoginPage'
import WorkerForgotPasswordPage from './pages/WorkerForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import WorkersPage from './pages/WorkersPage'
import HoursPage from './pages/HoursPage'
import PayrollPage from './pages/PayrollPage'
import RequestsPage from './pages/RequestsPage'
import WorkerDashboard from './pages/WorkerDashboard'

function AdminLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1px solid #dce3ee',
            },
            success: { iconTheme: { primary: '#059669', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/worker-login" element={<WorkerLoginPage />} />
          <Route path="/worker-forgot-password" element={<WorkerForgotPasswordPage />} />

          {/* Protected admin routes */}
          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route path="/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
            <Route path="/workers" element={<AdminLayout><WorkersPage /></AdminLayout>} />
            <Route path="/hours" element={<AdminLayout><HoursPage /></AdminLayout>} />
            <Route path="/payroll" element={<AdminLayout><PayrollPage /></AdminLayout>} />
            <Route path="/requests" element={<AdminLayout><RequestsPage /></AdminLayout>} />
          </Route>

          {/* Protected worker routes */}
          <Route element={<ProtectedRoute allowedRole="WORKER" />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
