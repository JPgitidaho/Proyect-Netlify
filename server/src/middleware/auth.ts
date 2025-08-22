import { Request, Response, NextFunction } from 'express'
import { verify } from '../utils/jwt.js'
export const auth = (req: Request, res: Response, next: NextFunction) => {
  const h = req.headers.authorization || ''
  const t = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!t) return res.status(401).json({ error: 'unauthorized' })
  try { (req as any).user = verify(t); next() } catch { return res.status(401).json({ error: 'unauthorized' }) }
}
