import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    if (allowedRole === 'WORKER') return <Navigate to="/worker-login" replace />
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user?.role !== allowedRole) {
    if (user?.role === 'WORKER') return <Navigate to="/worker/dashboard" replace />
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
