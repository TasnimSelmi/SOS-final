import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import SOSLogo from '../components/SOSLogo'
import SOSDecorations from '../components/SOSDecorations'
import './ReportDecision.css'

function ReportDecision() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  
  const [decision, setDecision] = useState('')
  const [details, setDetails] = useState('')

  const decisionOptions = [
    {
      value: 'validation',
      label: 'Valider et clôturer',
      description: 'La procédure est complète et la décision finale est prise. Le dossier sera clôturé.',
      color: '#10b981',
      icon: '✅'
    },
    {
      value: 'escalade',
      label: 'Escalader',
      description: 'L\'incident nécessite une intervention de niveau supérieur (Bureau National, autorités...).',
      color: '#f59e0b',
      icon: '⬆️'
    },
    {
      value: 'cloture',
      label: 'Clôturer sans suite',
      description: 'La situation est résolue ou ne nécessite plus d\'action. Le dossier sera archivé.',
      color: '#6b7280',
      icon: '📁'
    }
  ]

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getById(id)
      
      if (response.data?.status === 'success') {
        setReport(response.data.data.report)
        
        // Pre-fill if decision exists
        if (response.data.data.report.decision?.type) {
          setDecision(response.data.data.report.decision.type)
          setDetails(response.data.data.report.decision.details || '')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!decision) {
      setError('Veuillez sélectionner une décision')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir prendre cette décision ? Cette action est définitive.')) {
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await reportsAPI.makeDecision(id, {
        decision,
        details
      })

      if (response.data?.status === 'success') {
        alert('Décision enregistrée avec succès !')
        navigate(`/reports/${id}`)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'en_attente': '#f59e0b',
      'en_cours': '#3b82f6',
      'pris_en_charge': '#10b981',
      'sauvegarde': '#8b5cf6',
      'faux': '#ef4444',
      'cloture': '#6b7280'
    }
    return colors[status] || '#6b7280'
  }

  const getStatusLabel = (status) => {
    const labels = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'pris_en_charge': 'Pris en charge',
      'sauvegarde': 'Sauvegarde',
      'faux': 'Faux',
      'cloture': 'Clôturé'
    }
    return labels[status] || status
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="report-decision-container">
        <SOSDecorations />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="report-decision-container">
        <SOSDecorations />
        <div className="error-container">
          <h2>Signalement non trouvé</h2>
          <button className="btn btn-primary" onClick={() => navigate('/reports')}>
            Retour
          </button>
        </div>
      </div>
    )
  }

  // Check if already decided
  if (report.decision?.type && report.status === 'cloture') {
    return (
      <div className="report-decision-container">
        <SOSDecorations />
        <div className="already-decided">
          <span className="icon">✅</span>
          <h2>Décision déjà prise</h2>
          <p>Ce signalement a déjà été traité et clôturé.</p>
          <div className="decision-info">
            <p><strong>Décision :</strong> {report.decision.type}</p>
            <p><strong>Date :</strong> {formatDate(report.decision.madeAt)}</p>
            {report.decision.details && (
              <p><strong>Détails :</strong> {report.decision.details}</p>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/reports/${id}`)}>
            Voir le signalement
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="report-decision-container">
      <SOSDecorations />
      
      <div className="decision-header">
        <button className="btn btn-back" onClick={() => navigate(`/reports/${id}`)}>
          ← Retour au signalement
        </button>
        <SOSLogo size="small" />
        <h1>Prise de Décision</h1>
        <p className="subtitle">{report.reportId} - {report.childName}</p>
      </div>

      {/* Contexte */}
      <div className="decision-context">
        <h3>📋 Contexte</h3>
        
        <div className="context-grid">
          <div className="context-item">
            <label>Statut actuel</label>
            <span 
              className="status-badge"
              style={{ color: getStatusColor(report.status) }}
            >
              {getStatusLabel(report.status)}
            </span>
          </div>
          
          <div className="context-item">
            <label>Classification</label>
            <span>{report.classification || 'Non classifié'}</span>
          </div>
          
          {report.assignedTo && (
            <div className="context-item">
              <label>Assigné à</label>
              <span>{report.assignedTo.fullName}</span>
            </div>
          )}
          
          <div className="context-item">
            <label>Date de création</label>
            <span>{formatDate(report.createdAt)}</span>
          </div>
        </div>

        {report.classificationNotes && (
          <div className="classification-notes">
            <label>Notes de classification</label>
            <p>{report.classificationNotes}</p>
          </div>
        )}

        <div className="description-box">
          <label>Description initiale</label>
          <p>{report.description}</p>
        </div>
      </div>

      {/* Formulaire de décision */}
      <form onSubmit={handleSubmit} className="decision-form">
        <h3>⚖️ Décision finale</h3>
        
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <div className="decision-options">
          {decisionOptions.map((option) => (
            <label
              key={option.value}
              className={`decision-card ${decision === option.value ? 'selected' : ''}`}
              style={{ '--option-color': option.color }}
            >
              <input
                type="radio"
                name="decision"
                value={option.value}
                checked={decision === option.value}
                onChange={(e) => setDecision(e.target.value)}
              />
              <div className="card-content">
                <span className="card-icon">{option.icon}</span>
                <div className="card-text">
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                </div>
                <div className="selection-indicator"></div>
              </div>
            </label>
          ))}
        </div>

        <div className="form-group">
          <label htmlFor="details">Détails de la décision (obligatoire)</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="6"
            required
            placeholder="Décrivez la décision prise, les mesures à mettre en place, et toute information pertinente..."
          />
        </div>

        <div className="warning-box">
          <span className="warning-icon">⚠️</span>
          <p>
            <strong>Attention :</strong> Cette action est définitive. Une fois la décision prise, 
            le signalement sera clôturé et archivé. Assurez-vous d'avoir toutes les informations 
            nécessaires avant de confirmer.
          </p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(`/reports/${id}`)}
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-decision"
            disabled={submitting || !decision || !details.trim()}
          >
            {submitting ? 'Enregistrement...' : 'Confirmer la décision'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReportDecision
