import express from 'express'
import multer from 'multer'
import path from 'path'
import { authMiddleware } from './auth.js'

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Allow images, audio, video
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav', 'video/mp4', 'video/avi']
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non autorisé'), false)
    }
  }
})

// Upload single file
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' })
  }
  
  res.json({
    message: 'Fichier uploadé avec succès',
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  })
})

// Upload multiple files
router.post('/multiple', authMiddleware, upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' })
  }
  
  const files = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }))
  
  res.json({
    message: `${files.length} fichier(s) uploadé(s) avec succès`,
    files
  })
})

export default router
