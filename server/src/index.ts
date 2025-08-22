import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/ping', (_req, res) => {
  res.json({ ok: true, ts: Date.now() })
})

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`)
})
