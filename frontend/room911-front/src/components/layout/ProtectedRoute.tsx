import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import type { AdminRole } from '../../types'

interface Props {
  children: React.ReactNode
  allowedRoles?: AdminRole[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}