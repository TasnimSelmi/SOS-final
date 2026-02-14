import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import SOSLogo from '../components/SOSLogo'
import SOSDecorations from '../components/SOSDecorations'
import { useAuth } from '../context/AuthContext'
import './ReportDetail.css'

function ReportDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('info')

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
      'faux': 'Faux signalement',
      'cloture': 'Clôturé'
    }
    return labels[status] || status
  }

  const getUrgencyLabel = (urgency) => {
    const labels = {
      'faible': 'Faible',
      'moyen': 'Moyen',
      'critique': 'Critique'
    }
    return labels[urgency] || urgency
  }

  const getIncidentTypeLabel = (type) => {
    const labels = {
      'sante': 'Santé',
      'comportement': 'Comportement',
      'violence': 'Violence',
      'negligence': 'Négligence',
      'abus': 'Abus',
      'autre': 'Autre'
    }
    return labels[type] || type
  }

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getById(id)
      
      if (response.data?.status === 'success') {
        setReport(response.data.data.report)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du signalement')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canClassify = () => {
    return ['psychologue', 'directeur', 'admin'].includes(user?.role) && 
           ['en_attente', 'en_cours'].includes(report?.status)
  }

  const canDecide = () => {
    return ['directeur', 'admin'].includes(user?.role) && 
           report?.status !== 'cloture'
  }

  const canAssign = () => {
    return ['psychologue', 'directeur', 'admin'].includes(user?.role) && 
           ['en_attente', 'en_cours'].includes(report?.status)
  }

  if (loading) {
    return (
      <div className="report-detail-container">
        <SOSDecorations />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement du signalement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="report-detail-container">
        <SOSDecorations />
        <div className="error-container">
          <span className="error-icon">⚠️</span>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate('/reports')}>
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="report-detail-container">
        <SOSDecorations />
        <div className="error-container">
          <h2>Signalement non trouvé</h2>
          <button className="btn btn-primary" onClick={() => navigate('/reports')}>
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="report-detail-container">
      <SOSDecorations />
      
      {/* Header */}
      <div className="detail-header">
        <div className="header-left">
          <button className="btn btn-back" onClick={() => navigate('/reports')}>
            ← Retour
          </button>
          <SOSLogo size="small" />
        </div>
        <div className="header-center">
          <h1>Signalement {report.reportId}</h1>
          <div className="badges-row">
            <span 
              className="badge status-badge large"
              style={{ 
                backgroundColor: `${getStatusColor(report.status)}20`,
                color: getStatusColor(report.status)
              }}
            >
              {getStatusLabel(report.status)}
            </span>
            <span 
              className="badge urgency-badge large"
              style={{ 
                backgroundColor: `${report.urgencyColor}20`,
                color: report.urgencyColor
              }}
            >
              Urgence: {getUrgencyLabel(report.urgencyLevel)}
            </span>
            {report.isOverdue && (
              <span className="badge overdue-badge">⚠️ Délai dépassé</span>
            )}
          </div>
        </div>
        <div className="header-right">
          {canClassify() && (
            <button 
              className="btn btn-classify"
              onClick={() => navigate(`/reports/${id}/classify`)}
            >
              Classifier
            </button>
          )}
          {canAssign() && (
            <button 
              className="btn btn-assign"
              onClick={() => navigate(`/reports/${id}/assign`)}
            >
              Assigner
            </button>
          )}
          {canDecide() && (
            <button 
              className="btn btn-decide"
              onClick={() => navigate(`/reports/${id}/decision`)}
            >
              Décider
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <button 
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Informations
        </button>
        <button 
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          Historique
        </button>
        {report.attachments?.length > 0 && (
          <button 
            className={`tab ${activeTab === 'attachments' ? 'active' : ''}`}
            onClick={() => setActiveTab('attachments')}
          >
            Pièces jointes ({report.attachments.length})
          </button>
        )}
        {report.documents?.length > 0 && (
          <button 
            className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents ({report.documents.length})
          </button>
        )}
      </div>

      {/* Content */}
      <div className="detail-content">
        {activeTab === 'info' && (
          <div className="info-section">
            {/* Informations de l'enfant */}
            <div className="info-card">
              <h3>👶 Informations de l'enfant</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Nom</label>
                  <span>{report.childName}</span>
                </div>
                <div className="info-item">
                  <label>Âge</label>
                  <span>{report.childAge ? `${report.childAge} ans` : 'Non spécifié'}</span>
                </div>
                <div className="info-item">
                  <label>Genre</label>
                  <span>{report.childGender === 'male' ? 'Garçon' : report.childGender === 'female' ? 'Fille' : 'Autre'}</span>
                </div>
              </div>
            </div>

            {/* Localisation */}
            <div className="info-card">
              <h3>📍 Localisation</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Village SOS</label>
                  <span>{report.village}</span>
                </div>
                <div className="info-item">
                  <label>Programme</label>
                  <span>{report.program || 'Non spécifié'}</span>
                </div>
              </div>
            </div>

            {/* Détails de l'incident */}
            <div className="info-card">
              <h3>⚠️ Détails de l'incident</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Type</label>
                  <span>{getIncidentTypeLabel(report.incidentType)}</span>
                </div>
                <div className="info-item">
                  <label>Date de l'incident</label>
                  <span>{formatDate(report.incidentDate)}</span>
                </div>
                <div className="info-item">
                  <label>Date de création</label>
                  <span>{formatDate(report.createdAt)}</span>
                </div>
                <div className="info-item full-width">
                  <label>Description</label>
                  <p className="description-text">{report.description}</p>
                </div>
              </div>
            </div>

            {/* Déclarant */}
            <div className="info-card">
              <h3>👤 Déclarant</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Anonyme</label>
                  <span>{report.isAnonymous ? 'Oui' : 'Non'}</span>
                </div>
                {!report.isAnonymous && report.declarant && (
                  <div className="info-item">
                    <label>Nom</label>
                    <span>{report.declarant.fullName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Classification */}
            {report.classification && (
              <div className="info-card classification-card">
                <h3>🏷️ Classification</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Classification</label>
                    <span className="classification-value">{report.classification}</span>
                  </div>
                  <div className="info-item">
                    <label>Classifié par</label>
                    <span>{report.classifiedBy?.fullName || 'Non spécifié'}</span>
                  </div>
                  <div className="info-item">
                    <label>Date de classification</label>
                    <span>{formatDate(report.classifiedAt)}</span>
                  </div>
                  {report.classificationNotes && (
                    <div className="info-item full-width">
                      <label>Notes</label>
                      <p>{report.classificationNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assignation */}
            {report.assignedTo && (
              <div className="info-card">
                <h3>👨‍💼 Assigné à</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nom</label>
                    <span>{report.assignedTo.fullName}</span>
                  </div>
                  <div className="info-item">
                    <label>Date d'assignation</label>
                    <span>{formatDate(report.assignedAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Décision */}
            {report.decision?.type && (
              <div className="info-card decision-card">
                <h3>✅ Décision</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Type de décision</label>
                    <span className="decision-value">{report.decision.type}</span>
                  </div>
                  <div className="info-item">
                    <label>Prise par</label>
                    <span>{report.decision.madeBy?.fullName || 'Non spécifié'}</span>
                  </div>
                  <div className="info-item">
                    <label>Date</label>
                    <span>{formatDate(report.decision.madeAt)}</span>
                  </div>
                  {report.decision.details && (
                    <div className="info-item full-width">
                      <label>Détails</label>
                      <p>{report.decision.details}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="timeline-section">
            <h3>📋 Historique des actions</h3>
            <div className="timeline">
              {report.history?.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-action">{event.action}</span>
                      <span className="timeline-date">{formatDate(event.performedAt)}</span>
                    </div>
                    <div className="timeline-meta">
                      <span>par {event.performedBy?.fullName || 'Système'}</span>
                    </div>
                    {event.details && (
                      <p className="timeline-details">{event.details}</p>
                    )}
                  </div>
                </div>
              )) || (
                <p className="empty-timeline">Aucun historique disponible</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="attachments-section">
            <h3>📎 Pièces jointes</h3>
            <div className="attachments-grid">
              {report.attachments?.map((file, index) => (
                <div key={index} className="attachment-card">
                  <div className="attachment-icon">
                    {file.mimeType?.startsWith('image/') ? '🖼️' :
                     file.mimeType?.startsWith('audio/') ? '🎵' :
                     file.mimeType?.startsWith('video/') ? '🎥' : '📄'}
                  </div>
                  <div className="attachment-info">
                    <span className="attachment-name">{file.originalName}</span>
                    <span className="attachment-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <a 
                    href={`/uploads/${file.filename}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-download"
                  >
                    Télécharger
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-section">
            <h3>📝 Documents</h3>
            <div className="documents-list">
              {report.documents?.map((doc, index) => (
                <div key={index} className="document-card">
                  <div className="document-header">
                    <span className="document-type">{doc.type}</span>
                    <span className="document-date">{formatDate(doc.createdAt)}</span>
                  </div>
                  <h4>{doc.title}</h4>
                  <p>{doc.content}</p>
                  <div className="document-meta">
                    <span>Créé par: {doc.createdBy?.fullName || 'Non spécifié'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportDetail
