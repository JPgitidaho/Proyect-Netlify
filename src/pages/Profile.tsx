import { useEffect } from 'react'
import { useAuth } from '../auth/useAuth'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  useEffect(() => { if (!user) refreshUser() }, [user, refreshUser])
  return (
    <div className="section">
      <h2>Perfil</h2>
      <pre>{JSON.stringify(user ?? {}, null, 2)}</pre>
    </div>
  )
}
