import dotenv from 'dotenv'
dotenv.config()
export const PORT = Number(process.env.PORT || 4000)
export const MONGO_URI = String(process.env.MONGO_URI || '')
export const JWT_SECRET = String(process.env.JWT_SECRET || 'secret')
export const CORS_ORIGIN = String(process.env.CORS_ORIGIN || '*')
export const TOKEN_TTL_MS = Number(process.env.TOKEN_TTL_MS || 86400000)
