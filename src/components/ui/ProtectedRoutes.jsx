import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

// Dla każdego zalogowanego gracza
export function PrivateRoute({ children }) {
  const { currentUser } = useAuth()
  return currentUser ? children : <Navigate to="/" replace />
}

// Tylko dla adminów
export function AdminRoute({ children }) {
  const { currentUser, isAdmin } = useAuth()
  if (!currentUser) return <Navigate to="/" replace />
  if (!isAdmin)     return <Navigate to="/app" replace />
  return children
}
