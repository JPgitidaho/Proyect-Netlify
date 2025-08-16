import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'

type User = { email: string }

type Ctx = {
  token: string | null
  user: User | null
  exp: number | null
  loading: boolean
  error: string | null
  isAuth: boolean
  timeLeft: number
  willExpireSoon: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  renew: (minutes?: number) => void
}

const AuthCtx = createContext<Ctx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>('auth_token', null)
  const [user, setUser] = useLocalStorage<User | null>('auth_user', null)
  const [exp, setExp] = useLocalStorage<number | null>('auth_exp', null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [timeLeft, setTimeLeft] = useState(0)
  const [willExpireSoon, setWillExpireSoon] = useState(false)

  // Guarda el id del timeout de auto-logout
  const timerRef = useRef<number | null>(null)

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    setExp(null)
    if (timerRef.current) window.clearTimeout(timerRef.current)
  }, [setToken, setUser, setExp])

  const scheduleLogout = useCallback((ts: number | null) => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    if (!ts) return
    const ms = Math.max(0, ts - Date.now())
    timerRef.current = window.setTimeout(() => {
      logout()
    }, ms)
  }, [logout])

  const renew = useCallback((minutes = 5) => {
    if (!token) return
    const newExp = Date.now() + minutes * 60_000
    setExp(newExp)
    scheduleLogout(newExp)
  }, [token, setExp, scheduleLogout])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    await new Promise(r => setTimeout(r, 400)) // simula latencia
    if (!email || !password) {
      setLoading(false)
      setError('Credenciales inválidas')
      return
    }
    const fakeExp = Date.now() + 5 * 60_000 // 5 min
    setToken('fake_token')
    setUser({ email })
    setExp(fakeExp)
    scheduleLogout(fakeExp)
    setLoading(false)
  }, [setToken, setUser, setExp, scheduleLogout])

  // Contador visual de expiración y aviso ≤ 60s
  useEffect(() => {
    if (!exp) { setTimeLeft(0); setWillExpireSoon(false); return }
    const update = () => {
      const secs = Math.max(0, Math.floor((exp - Date.now()) / 1000))
      setTimeLeft(secs)
      setWillExpireSoon(secs > 0 && secs <= 60)
    }
    update()
    const id = window.setInterval(update, 1000)
    return () => window.clearInterval(id)
  }, [exp])

  // Reprograma auto-logout si hay sesión previa al montar
  useEffect(() => {
    if (exp && Date.now() >= exp) logout()
    if (exp && Date.now() < exp) scheduleLogout(exp)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intencional: solo al montar

  const value: Ctx = useMemo(() => ({
    token,
    user,
    exp,
    loading,
    error,
    isAuth: Boolean(token),
    timeLeft,
    willExpireSoon,
    login,
    logout,
    renew
  }), [token, user, exp, loading, error, timeLeft, willExpireSoon, login, logout, renew])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('AuthContext not found')
  return ctx
}
