import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { User } from '../models/User.js'

const r = Router()

r.get('/', auth, async (_req, res) => {
  const items = await User.find().select('id email name').limit(100).lean()
  res.json(items)
})

r.get('/search', auth, async (req, res) => {
  const q = String((req.query.q || '')).trim()
  const items = q ? await User.find({ name: { $regex: q, $options: 'i' } }).select('id email name').limit(50).lean() : []
  res.json(items)
})

export default r
