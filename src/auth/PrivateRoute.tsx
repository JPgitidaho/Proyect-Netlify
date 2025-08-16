import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { ReactElement } from 'react'

export default function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuth } = useAuth()
  if (!isAuth) return <Navigate to="/login" replace />
  return children
}
