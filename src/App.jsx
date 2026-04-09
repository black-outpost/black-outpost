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
      <BrowserRouter >
        {/* Global background image */}
        <div style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: "url('https://i.imgur.com/dg2BvAB.png')",
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.05,
        }} />
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
        <Routes>
          {/* Publiczne */}
          <Route path="/" element={<LoginPage />} />

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
