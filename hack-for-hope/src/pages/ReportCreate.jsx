import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import SOSLogo from '../components/SOSLogo'
import SOSDecorations from '../components/SOSDecorations'
import './ReportCreate.css'

function ReportCreate() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    childGender: 'male',
    village: '',
    program: '',
    incidentType: 'sante',
    incidentDate: '',
    urgencyLevel: 'moyen',
    description: '',
    abuserName: '',
    abuserRole: '',
    isAnonymous: false
  })
  
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const incidentTypes = [
    { value: 'sante', label: 'Santé' },
    { value: 'comportement', label: 'Comportement' },
    { value: 'violence', label: 'Violence' },
    { value: 'negligence', label: 'Négligence' },
    { value: 'abus', label: 'Abus' },
    { value: 'autre', label: 'Autre' }
  ]

  const urgencyLevels = [
    { value: 'faible', label: 'Faible', color: '#10b981' },
    { value: 'moyen', label: 'Moyen', color: '#f59e0b' },
    { value: 'critique', label: 'Critique', color: '#ef4444' }
  ]

  const abuserRoles = [
    { value: '', label: 'Non applicable' },
    { value: 'membre_famille', label: 'Membre de famille' },
    { value: 'volontaire', label: 'Volontaire' },
    { value: 'personnel', label: 'Personnel SOS' },
    { value: 'inconnu', label: 'Inconnu' },
    { value: 'autre', label: 'Autre' }
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg', 'audio/wav', 'video/mp4', 'application/pdf']
      const maxSize = 15 * 1024 * 1024 // 15MB
      
      if (!validTypes.includes(file.type)) {
        setError(`Type non supporté: ${file.name}`)
        return false
      }
      if (file.size > maxSize) {
        setError(`Fichier trop volumineux: ${file.name}`)
        return false
      }
      return true
    })
    
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 files
  }

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = {
        ...formData,
        attachments
      }

      const response = await reportsAPI.create(data)
      
      if (response.data?.status === 'success') {
        setSuccess(true)
        setTimeout(() => {
          navigate('/reports')
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du signalement')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="report-create-container">
        <SOSDecorations />
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Signalement créé avec succès !</h2>
          <p>Vous allez être redirigé vers la liste des signalements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="report-create-container">
      <SOSDecorations />
      
      <div className="report-create-header">
        <SOSLogo size="small" />
        <h1>Nouveau Signalement</h1>
        <p className="subtitle">Remplissez le formulaire ci-dessous pour signaler un incident</p>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="report-form">
        {/* Confidentialité */}
        <div className="form-section privacy-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
            />
            <span className="checkmark"></span>
            <span className="label-text">
              <strong>Signalement anonyme</strong>
              <small>Votre identité ne sera pas visible par les autres utilisateurs</small>
            </span>
          </label>
        </div>

        {/* Informations de l'enfant */}
        <div className="form-section">
          <h3>👶 Informations de l'enfant</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="childName">Nom de l'enfant *</label>
              <input
                type="text"
                id="childName"
                name="childName"
                value={formData.childName}
                onChange={handleInputChange}
                required
                placeholder="Prénom et nom"
              />
            </div>
            
            <div className="form-group small">
              <label htmlFor="childAge">Âge</label>
              <input
                type="number"
                id="childAge"
                name="childAge"
                value={formData.childAge}
                onChange={handleInputChange}
                min="0"
                max="18"
                placeholder="0-18"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Genre *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="childGender"
                  value="male"
                  checked={formData.childGender === 'male'}
                  onChange={handleInputChange}
                />
                <span>Garçon</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="childGender"
                  value="female"
                  checked={formData.childGender === 'female'}
                  onChange={handleInputChange}
                />
                <span>Fille</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="childGender"
                  value="other"
                  checked={formData.childGender === 'other'}
                  onChange={handleInputChange}
                />
                <span>Autre</span>
              </label>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="form-section">
          <h3>📍 Localisation</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="village">Village SOS *</label>
              <input
                type="text"
                id="village"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                required
                placeholder="Nom du village"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="program">Programme</label>
              <input
                type="text"
                id="program"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                placeholder="Programme éducatif"
              />
            </div>
          </div>
        </div>

        {/* Détails de l'incident */}
        <div className="form-section">
          <h3>⚠️ Détails de l'incident</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="incidentType">Type d'incident *</label>
              <select
                id="incidentType"
                name="incidentType"
                value={formData.incidentType}
                onChange={handleInputChange}
                required
              >
                {incidentTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="incidentDate">Date de l'incident *</label>
              <input
                type="date"
                id="incidentDate"
                name="incidentDate"
                value={formData.incidentDate}
                onChange={handleInputChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Niveau d'urgence *</label>
            <div className="urgency-selector">
              {urgencyLevels.map(level => (
                <label
                  key={level.value}
                  className={`urgency-option ${formData.urgencyLevel === level.value ? 'selected' : ''}`}
                  style={{ '--urgency-color': level.color }}
                >
                  <input
                    type="radio"
                    name="urgencyLevel"
                    value={level.value}
                    checked={formData.urgencyLevel === level.value}
                    onChange={handleInputChange}
                  />
                  <span className="urgency-dot" style={{ backgroundColor: level.color }}></span>
                  <span className="urgency-label">{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description détaillée *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="6"
              placeholder="Décrivez l'incident en détail..."
              minLength="10"
            />
            <small className="char-count">{formData.description.length} caractères (min. 10)</small>
          </div>
        </div>

        {/* Information sur l'abuseur (si applicable) */}
        <div className="form-section">
          <h3>👤 Information sur l'abuseur (si applicable)</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="abuserName">Nom de la personne concernée</label>
              <input
                type="text"
                id="abuserName"
                name="abuserName"
                value={formData.abuserName}
                onChange={handleInputChange}
                placeholder="Nom/prénom si connu"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="abuserRole">Rôle de la personne</label>
              <select
                id="abuserRole"
                name="abuserRole"
                value={formData.abuserRole}
                onChange={handleInputChange}
              >
                {abuserRoles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pièces jointes */}
        <div className="form-section">
          <h3>📎 Pièces jointes ({attachments.length}/5)</h3>
          
          <div className="attachments-section">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="image/*,audio/*,video/*,application/pdf"
              style={{ display: 'none' }}
            />
            
            <button
              type="button"
              className="btn btn-secondary btn-attach"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= 5}
            >
              📎 Ajouter des fichiers
            </button>
            
            <small className="file-hint">
              Formats: Images, Audio, Vidéo, PDF (max 15MB par fichier)
            </small>

            {attachments.length > 0 && (
              <div className="attachments-list">
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <span className="file-icon">
                      {file.type.startsWith('image/') ? '🖼️' :
                       file.type.startsWith('audio/') ? '🎵' :
                       file.type.startsWith('video/') ? '🎥' : '📄'}
                    </span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeAttachment(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || formData.description.length < 10}
          >
            {loading ? 'Envoi en cours...' : 'Soumettre le signalement'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportCreate
