import jwt from 'jsonwebtoken'
import { JWT_SECRET, TOKEN_TTL_MS } from '../config/env.js'
export const sign = (payload: object) => jwt.sign(payload, JWT_SECRET, { expiresIn: Math.floor(TOKEN_TTL_MS/1000) })
export const verify = (token: string) => jwt.verify(token, JWT_SECRET) as any
