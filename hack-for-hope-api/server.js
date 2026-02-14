import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import reportRoutes from './routes/reports.js'
import uploadRoutes from './routes/upload.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/upload', uploadRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hack for Hope API is running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
