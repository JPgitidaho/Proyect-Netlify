import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Login() {
  const { login, loading, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login({ email, password })
      nav('/profile', { replace: true })
    } catch (err: any) {
      setError(err?.message ?? 'Error de login')
    }
  }

  if (isAuthenticated) return null

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: '24px auto', display: 'grid', gap: 12 }}>
      <h2>Ingresar</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      {error && <div style={{ color:'crimson' }}>{error}</div>}
      <button disabled={loading}>{loading ? 'Ingresando...' : 'Entrar'}</button>
    </form>
  )
}
