import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Mock users database (replace with real database)
const users = [
  { id: 1, username: 'mere1', password: '$2a$10$...', role: 1, name: 'Mère SOS Fatima' },
  { id: 2, username: 'psy1', password: '$2a$10$...', role: 2, name: 'Dr. Sarah Bennour' },
  { id: 3, username: 'directeur1', password: '$2a$10$...', role: 3, name: 'Directeur Ahmed' }
]

// Login
router.post('/login', async (req, res) => {
  const { username, password, role } = req.body
  
  // Find user
  const user = users.find(u => u.username === username && u.role === role)
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' })
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'hackforhope2026',
    { expiresIn: '24h' }
  )
  
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role
    }
  })
})

// Verify token middleware
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token manquant' })
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hackforhope2026')
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token invalide' })
  }
}

// Check role middleware
export const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès non autorisé' })
  }
  next()
}

export default router
