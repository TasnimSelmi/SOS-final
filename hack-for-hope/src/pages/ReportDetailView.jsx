import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import { SOSIcons } from '../components/SOSIcons'
import './ReportDetailView.css'

function ReportDetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  const [classificationData, setClassificationData] = useState({
    classification: '',
    notes: ''
  })
  const [decisionData, setDecisionData] = useState({
    decision: '',
    details: ''
  })

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getById(id)
      setReport(response.data.data.report)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClassify = async (e) => {
    e.preventDefault()
    try {
      await reportsAPI.classify(id, classificationData)
      alert('Classification enregistrée avec succès')
      fetchReport()
    } catch (error) {
      alert('Erreur lors de la classification')
      console.error(error)
    }
  }

  const handleDecision = async (e) => {
    e.preventDefault()
    try {
      await reportsAPI.makeDecision(id, decisionData)
      alert('Décision enregistrée avec succès')
      fetchReport()
    } catch (error) {
      alert('Erreur lors de l\'enregistrement de la décision')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="report-detail-loading">
        <div className="spinner"></div>
        <p>Chargement du signalement...</p>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="report-detail-error">
        <SOSIcons.Alert size={64} color="#ef4444" />
        <h2>Signalement introuvable</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </button>
      </div>
    )
  }

  const urgencyColors = {
    faible: '#10b981',
    moyen: '#f59e0b',
    critique: '#ef4444'
  }

  const statusColors = {
    en_attente: '#6b7280',
    en_cours: '#3b82f6',
    pris_en_charge: '#8b5cf6',
    sauvegarde: '#10b981',
    faux: '#ef4444',
    cloture: '#64748b'
  }

  return (
    <div className="report-detail-container">
      {/* Header */}
      <div className="report-detail-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <SOSIcons.Alert size={20} />
          Retour
        </button>
        <div className="report-header-info">
          <h1>Signalement {report.reportId}</h1>
          <div className="report-badges">
            <span 
              className="badge badge-urgency" 
              style={{ backgroundColor: urgencyColors[report.urgencyLevel] }}
            >
              {report.urgencyLevel}
            </span>
            <span 
              className="badge badge-status"
              style={{ backgroundColor: statusColors[report.status] }}
            >
              {report.statusDisplay}
            </span>
          </div>
        </div>
        <div className="report-meta">
          <span><SOSIcons.Village size={16} /> {report.village}</span>
          <span><SOSIcons.Document size={16} /> {new Date(report.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="report-detail-tabs">
        <button 
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <SOSIcons.Document size={18} />
          Détails
        </button>
        <button 
          className={`tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflow')}
        >
          <SOSIcons.Family size={18} />
          Workflow
        </button>
        <button 
          className={`tab-btn ${activeTab === 'classification' ? 'active' : ''}`}
          onClick={() => setActiveTab('classification')}
        >
          <SOSIcons.Check size={18} />
          Classification
        </button>
        <button 
          className={`tab-btn ${activeTab === 'decision' ? 'active' : ''}`}
          onClick={() => setActiveTab('decision')}
        >
          <SOSIcons.User size={18} />
          Décision
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <SOSIcons.Notification size={18} />
          Historique
        </button>
      </div>

      {/* Content */}
      <div className="report-detail-content">
        {activeTab === 'details' && (
          <div className="details-view">
            <div className="detail-card">
              <h3><SOSIcons.Family size={20} /> Informations de l'enfant</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Nom</label>
                  <p>{report.childName}</p>
                </div>
                {report.childAge && (
                  <div className="detail-item">
                    <label>Âge</label>
                    <p>{report.childAge} ans</p>
                  </div>
                )}
                <div className="detail-item">
                  <label>Genre</label>
                  <p>{report.childGender === 'male' ? 'Garçon' : report.childGender === 'female' ? 'Fille' : 'Autre'}</p>
                </div>
              </div>
            </div>

            <div className="detail-card">
              <h3><SOSIcons.Alert size={20} /> Détails de l'incident</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Type</label>
                  <p>{report.incidentType}</p>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <p>{new Date(report.incidentDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="detail-item">
                  <label>Niveau d'urgence</label>
                  <p style={{ color: urgencyColors[report.urgencyLevel], fontWeight: 'bold' }}>
                    {report.urgencyLevel}
                  </p>
                </div>
              </div>
              <div className="detail-item full-width">
                <label>Description</label>
                <p className="description-text">{report.description}</p>
              </div>
            </div>

            {(report.abuserName || report.abuserRole) && (
              <div className="detail-card">
                <h3><SOSIcons.User size={20} /> Information sur l'abuseur</h3>
                <div className="detail-grid">
                  {report.abuserName && (
                    <div className="detail-item">
                      <label>Nom</label>
                      <p>{report.abuserName}</p>
                    </div>
                  )}
                  {report.abuserRole && (
                    <div className="detail-item">
                      <label>Rôle</label>
                      <p>{report.abuserRole}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {report.attachments && report.attachments.length > 0 && (
              <div className="detail-card">
                <h3><SOSIcons.Upload size={20} /> Pièces jointes ({report.attachments.length})</h3>
                <div className="attachments-list">
                  {report.attachments.map((file, idx) => (
                    <div key={idx} className="attachment-item">
                      <SOSIcons.Document size={20} />
                      <span>{file.originalName}</span>
                      <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="workflow-view">
            <h3>Processus en 6 étapes</h3>
            {report.workflowSteps && report.workflowSteps.length > 0 ? (
              <div className="workflow-steps">
                {report.workflowSteps.map((step) => (
                  <div 
                    key={step.stepNumber} 
                    className={`workflow-step ${step.status}`}
                  >
                    <div className="step-number">{step.stepNumber}</div>
                    <div className="step-content">
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                      <div className="step-meta">
                        <span className={`step-status status-${step.status}`}>
                          {step.status === 'completed' ? 'Complété' : 
                           step.status === 'in_progress' ? 'En cours' : 
                           step.status === 'overdue' ? 'En retard' : 'En attente'}
                        </span>
                        {step.deadline && (
                          <span className="step-deadline">
                            Échéance: {new Date(step.deadline).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                      {step.notes && (
                        <div className="step-notes">
                          <strong>Notes:</strong> {step.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucune étape de workflow initialisée</p>
            )}
          </div>
        )}

        {activeTab === 'classification' && (
          <div className="classification-view">
            {report.classification ? (
              <div className="classification-display">
                <h3>Classification actuelle</h3>
                <div className="classification-result">
                  <span className={`classification-badge ${report.classification}`}>
                    {report.classification}
                  </span>
                  {report.classificationNotes && (
                    <p>{report.classificationNotes}</p>
                  )}
                  <small>
                    Classifié le {new Date(report.classifiedAt).toLocaleDateString('fr-FR')}
                  </small>
                </div>
              </div>
            ) : (
              <form onSubmit={handleClassify} className="classification-form">
                <h3>Classifier le signalement</h3>
                <div className="form-group">
                  <label>Type de classification *</label>
                  <select
                    value={classificationData.classification}
                    onChange={(e) => setClassificationData({...classificationData, classification: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="sauvegarde">Sauvegarde</option>
                    <option value="prise_en_charge">Prise en charge</option>
                    <option value="faux_signalement">Faux signalement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={classificationData.notes}
                    onChange={(e) => setClassificationData({...classificationData, notes: e.target.value})}
                    rows="4"
                    placeholder="Notes sur la classification..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Enregistrer la classification
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'decision' && (
          <div className="decision-view">
            {report.decision && report.decision.type ? (
              <div className="decision-display">
                <h3>Décision prise</h3>
                <div className="decision-result">
                  <span className={`decision-badge ${report.decision.type}`}>
                    {report.decision.type}
                  </span>
                  {report.decision.details && (
                    <p>{report.decision.details}</p>
                  )}
                  <small>
                    Décision prise le {new Date(report.decision.madeAt).toLocaleDateString('fr-FR')}
                  </small>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDecision} className="decision-form">
                <h3>Prendre une décision</h3>
                <div className="form-group">
                  <label>Type de décision *</label>
                  <select
                    value={decisionData.decision}
                    onChange={(e) => setDecisionData({...decisionData, decision: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="prise_en_charge">Prise en charge</option>
                    <option value="sanction">Sanction</option>
                    <option value="suivi">Suivi</option>
                    <option value="escalade">Escalade</option>
                    <option value="cloture">Clôture</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Détails</label>
                  <textarea
                    value={decisionData.details}
                    onChange={(e) => setDecisionData({...decisionData, details: e.target.value})}
                    rows="4"
                    placeholder="Détails de la décision..."
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Enregistrer la décision
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-view">
            <h3>Historique des actions</h3>
            {report.history && report.history.length > 0 ? (
              <div className="history-timeline">
                {report.history.map((entry, idx) => (
                  <div key={idx} className="history-item">
                    <div className="history-dot"></div>
                    <div className="history-content">
                      <strong>{entry.action}</strong>
                      {entry.details && <p>{entry.details}</p>}
                      <small>
                        {new Date(entry.performedAt).toLocaleDateString('fr-FR')} à{' '}
                        {new Date(entry.performedAt).toLocaleTimeString('fr-FR')}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun historique disponible</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportDetailView
