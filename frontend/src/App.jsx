import { Routes, Route } from 'react-router-dom'
import InvitationPage from './pages/InvitationPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminConfig from './pages/AdminConfig'

export default function App() {
  return (
    <Routes>
      <Route path="/:codigo" element={<InvitationPage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/config" element={<AdminConfig />} />
      <Route path="/" element={<div className="min-h-screen flex items-center justify-center"><p className="text-secondary">Invitación no encontrada</p></div>} />
    </Routes>
  )
}