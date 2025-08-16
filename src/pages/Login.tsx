import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('juanita@mail.com')
  const [password, setPassword] = useState('123456')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div style={{ display:'grid', gap:12, maxWidth:360, margin:'40px auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit} style={{ display:'grid', gap:10 }}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading}>{loading ? 'Ingresando…' : 'Entrar'}</button>
      </form>
      {error && <p style={{ color:'tomato' }}>{error}</p>}
    </div>
  )
}
