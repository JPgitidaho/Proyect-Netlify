import { Router } from 'express'
import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'
import { sign } from '../utils/jwt.js'
import { TOKEN_TTL_MS } from '../config/env.js'

const r = Router()

r.post('/register', async (req, res) => {
  const { email, name, password } = req.body || {}
  if (!email || !name || !password) return res.status(400).json({ error: 'invalid' })
  const exists = await User.findOne({ email })
  if (exists) return res.status(409).json({ error: 'exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const u = await User.create({ email, name, passwordHash })
  const token = sign({ sub: u.id, email: u.email })
  return res.status(201).json({ token, exp: Date.now() + TOKEN_TTL_MS, user: { id: u.id, email: u.email, name: u.name } })
})

r.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'invalid' })
  const u = await User.findOne({ email })
  if (!u) return res.status(401).json({ error: 'invalid' })
  const ok = await bcrypt.compare(password, u.passwordHash)
  if (!ok) return res.status(401).json({ error: 'invalid' })
  const token = sign({ sub: u.id, email: u.email })
  return res.json({ token, exp: Date.now() + TOKEN_TTL_MS, user: { id: u.id, email: u.email, name: u.name } })
})

export default r
