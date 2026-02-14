import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { authMiddleware, checkRole } from './auth.js'

const router = express.Router()

// Mock reports database
let reports = [
  { id: '#2026-089', date: '2026-02-14', village: 'tunis', type: 'comportement', priorite: 'elevee', statut: 'urgent', createdBy: 1 },
  { id: '#2026-088', date: '2026-02-13', village: 'sousse', type: 'sante', priorite: 'moyenne', statut: 'en-traitement', createdBy: 1 }
]

// Get all reports (role-based filtering)
router.get('/', authMiddleware, (req, res) => {
  const { role, userId } = req.user
  
  let filteredReports = reports
  
  // Level 1: only see their own reports
  if (role === 1) {
    filteredReports = reports.filter(r => r.createdBy === userId)
  }
  // Level 2 & 3: see all reports
  
  res.json(filteredReports)
})

// Create new report (Level 1 only)
router.post('/', authMiddleware, checkRole([1]), (req, res) => {
  const { type, urgence, village, anonyme, enfant, abuseur, description } = req.body
  
  const newReport = {
    id: `#2026-${Math.floor(Math.random() * 100 + 90)}`,
    date: new Date().toISOString().split('T')[0],
    type,
    priorite: urgence,
    village,
    statut: 'en-attente',
    createdBy: req.user.userId,
    anonyme: anonyme === 'oui',
    enfant,
    abuseur,
    description
  }
  
  reports.push(newReport)
  res.status(201).json(newReport)
})

// Update report status (Level 2 & 3)
router.put('/:id/status', authMiddleware, checkRole([2, 3]), (req, res) => {
  const { statut } = req.body
  const report = reports.find(r => r.id === req.params.id)
  
  if (!report) {
    return res.status(404).json({ error: 'Signalement non trouvé' })
  }
  
  report.statut = statut
  res.json(report)
})

// Classify report (Level 2)
router.put('/:id/classify', authMiddleware, checkRole([2]), (req, res) => {
  const { decision, rapport } = req.body
  const report = reports.find(r => r.id === req.params.id)
  
  if (!report) {
    return res.status(404).json({ error: 'Signalement non trouvé' })
  }
  
  report.classification = decision
  report.rapportConfidentiel = rapport
  report.statut = 'classifie'
  
  res.json(report)
})

export default router
