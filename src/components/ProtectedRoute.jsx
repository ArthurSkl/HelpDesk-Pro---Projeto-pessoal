import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  try {
    const raw = localStorage.getItem('helpdesk_user')
    if (!raw) {
      return <Navigate to="/login" replace />
    }
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.id) {
      return <Navigate to="/login" replace />
    }
    return children
  } catch {
    return <Navigate to="/login" replace />
  }
}

export default ProtectedRoute
