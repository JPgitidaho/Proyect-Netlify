import { createContext } from 'react'

export type User = { email: string }
export type Ctx = {
  token: string | null
  user: User | null
  exp: number | null
  loading: boolean
  error: string | null
  isAuth: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}
export const AuthCtx = createContext<Ctx | null>(null)
