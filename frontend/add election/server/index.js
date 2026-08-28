import express from 'express'
import cors from 'cors'
import electricianRoutes from './routes/electricians.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/api/electricians', electricianRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Unexpected server error.' })
})

app.listen(PORT, () => {
  console.log(`Repair & Maintenance API listening on port ${PORT}`)
})
