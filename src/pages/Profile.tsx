import { useAuth } from '../auth/AuthContext'

export default function Profile() {
  const { user, exp, logout } = useAuth()
  return (
    <div style={{ display:'grid', gap:12, maxWidth:480, margin:'40px auto' }}>
      <h2>Perfil</h2>
      <p>Email: {user?.email}</p>
      <p>Expira: {exp ? new Date(exp).toLocaleTimeString() : '-'}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  )
}
