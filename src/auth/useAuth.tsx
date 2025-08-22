import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type User = { id: string; name?: string; email: string; [k: string]: unknown }
type AuthState = { user: User | null; token: string | null; exp: number | null }
type LoginInput = { email: string; password: string }

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  authHeaders: () => Record<string, string>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'auth'
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''

function readStored(): AuthState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null, exp: null }
    const data = JSON.parse(raw) as AuthState
    if (data.exp && Date.now() >= data.exp * 1000) {
      localStorage.removeItem(STORAGE_KEY)
      return { user: null, token: null, exp: null }
    }
    return data
  } catch {
    return { user: null, token: null, exp: null }
  }
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!r.ok) {
    let msg = 'Error'
    try { const d = await r.json(); msg = (d?.message as string) ?? msg } catch {}
    throw new Error(msg)
  }
  return r.json() as Promise<T>
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => readStored())
  const [loading, setLoading] = useState(false)

  const persist = useCallback((next: AuthState) => {
    setState(next)
    if (next.token) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true)
    try {
      const data = await http<{ token: string; exp: number; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      })
      persist({ token: data.token, exp: data.exp, user: data.user })
    } finally {
      setLoading(false)
    }
  }, [persist])

  const logout = useCallback(() => {
    persist({ token: null, exp: null, user: null })
  }, [persist])

  const authHeaders = useCallback(() => {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {}
  }, [state.token])

  const refreshUser = useCallback(async () => {
    if (!state.token) return
    const data = await http<User>('/users/me', { headers: authHeaders() })
    persist({ ...state, user: data })
  }, [state, authHeaders, persist])

  useEffect(() => {
    if (!state.token || !state.exp) return
    const msLeft = state.exp * 1000 - Date.now()
    if (msLeft <= 0) {
      logout()
      return
    }
    const id = setTimeout(logout, msLeft)
    return () => clearTimeout(id)
  }, [state.token, state.exp, logout])

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    token: state.token,
    isAuthenticated: !!state.token,
    loading,
    login,
    logout,
    refreshUser,
    authHeaders,
  }), [state.user, state.token, loading, login, logout, refreshUser, authHeaders])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
