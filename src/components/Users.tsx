import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'

type U = { id: string; name?: string; email: string }

export default function Users() {
  const { authHeaders } = useAuth()
  const [data, setData] = useState<U[]>([])
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const r = await fetch(`${import.meta.env.VITE_API_URL}/users`, { headers: authHeaders() })
        if (!r.ok) throw new Error('Error al cargar usuarios')
        const json = await r.json()
        if (!ignore) setData(json)
      } catch (e:any) { if (!ignore) setErr(e?.message ?? 'Error') }
    })()
    return () => { ignore = true }
  }, [authHeaders])

  if (err) return <div style={{ color:'crimson' }}>{err}</div>
  return (
    <ul>
      {data.map(u => <li key={u.id}>{u.name ?? u.email}</li>)}
    </ul>
  )
}
