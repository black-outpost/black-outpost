import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute, AdminRoute } from './components/ui/ProtectedRoutes'

import LoginPage from './pages/LoginPage'

// Player pages (szkielety — uzupełnimy w kolejnych etapach)
import PlayerLayout from './pages/player/PlayerLayout'

// Admin pages (szkielety)
import AdminLayout from './pages/admin/AdminLayout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/black-outpost">
        <Routes>
          {/* Publiczne */}
          <Route path="/login" element={<LoginPage />} />

          {/* Gracz */}
          <Route path="/app/*" element={
            <PrivateRoute>
              <PlayerLayout />
            </PrivateRoute>
          } />

          {/* Admin */}
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          } />

          {/* Domyślne przekierowanie */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
