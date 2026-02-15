import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import { useSocket } from '../context/SocketContext'
import { SOSIcons } from './SOSIcons'
import { SOSCard, SOSStatCard } from './SOSCard'
import './Level2Dashboard.css'

function Level2Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({
    pending: 0,
    urgent: 0,
    monthly: 0,
    villages: 4
  })
  const { notifications, unreadCount } = useSocket()

  useEffect(() => {
    fetchStats()
  }, [notifications])

  const fetchStats = async () => {
    try {
      const response = await reportsAPI.getAll()
      const reports = response.data?.data?.reports || []
      
      setStats({
        pending: reports.filter(r => r.status === 'en_attente' || r.status === 'en_cours').length,
        urgent: reports.filter(r => r.urgencyLevel === 'critique').length,
        monthly: reports.filter(r => {
          const date = new Date(r.createdAt)
          const now = new Date()
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length,
        villages: 4
      })
    } catch (error) {
      console.error('Erreur stats:', error)
    }
  }

  return (
    <div className="level2-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Search size={48} color="#00abec" />
        <div>
          <h1>Espace Analyse & Traitement</h1>
          <p>Niveau 2 - Psychologues, Responsables sociaux</p>
        </div>
        {unreadCount > 0 && (
          <div className="notification-badge">
            <SOSIcons.Notification size={24} />
            <span className="badge-count">{unreadCount}</span>
          </div>
        )}
      </div>
      
      <div className="nav-tabs">
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <SOSIcons.Document size={20} />
          Dashboard
        </button>
        <button className={`nav-btn ${activeTab === 'a-traiter' ? 'active' : ''}`} onClick={() => setActiveTab('a-traiter')}>
          <SOSIcons.Alert size={20} />
          À Traiter
          {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
        </button>
        <button className={`nav-btn ${activeTab === 'workflow' ? 'active' : ''}`} onClick={() => setActiveTab('workflow')}>
          <SOSIcons.Family size={20} />
          Workflow 6 Étapes
        </button>
        <button className={`nav-btn ${activeTab === 'mes-cas' ? 'active' : ''}`} onClick={() => setActiveTab('mes-cas')}>
          <SOSIcons.Check size={20} />
          Mes Cas Traités
        </button>
      </div>
      
      {activeTab === 'dashboard' && <AnalystDashboard stats={stats} />}
      {activeTab === 'a-traiter' && <ReportsToProcess />}
      {activeTab === 'workflow' && <WorkflowView />}
      {activeTab === 'mes-cas' && <MyProcessedCases />}
    </div>
  )
}

function AnalystDashboard({ stats }) {
  const villageStats = [
    { label: 'Gammarth', value1: 12, value2: 8 },
    { label: 'Siliana', value1: 8, value2: 5 },
    { label: 'Mahrès', value1: 6, value2: 4 },
    { label: 'Akouda', value1: 10, value2: 7 }
  ]

  return (
    <>
      <div className="stats-grid">
        <SOSStatCard number={stats.pending} label="Signalements en attente" variant="info" />
        <SOSStatCard number={stats.urgent} label="Cas urgents" variant="urgent" />
        <SOSStatCard number={stats.monthly} label="Cas ce mois" variant="success" />
        <SOSStatCard number={stats.villages} label="Villages actifs" variant="warning" />
      </div>
      
      <SOSCard title="Vue par village" subtitle="Répartition des cas par village SOS" variant="info">
        <table className="sos-table">
          <thead>
            <tr>
              <th><SOSIcons.Village size={16} /> Village</th>
              <th><SOSIcons.Document size={16} /> Actifs</th>
              <th><SOSIcons.Notification size={16} /> En traitement</th>
              <th><SOSIcons.Check size={16} /> Cloturés</th>
            </tr>
          </thead>
          <tbody>
            {villageStats.map(v => (
              <tr key={v.label}>
                <td><strong>Village {v.label}</strong></td>
                <td>{v.value1}</td>
                <td>{v.value2}</td>
                <td>{Math.floor(Math.random() * 50) + 20}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SOSCard>
    </>
  )
}

function ReportsToProcess() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [classificationModal, setClassificationModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getAll({ status: 'en_attente,en_cours' })
      setReports(response.data?.data?.reports || [])
    } catch (error) {
      console.error('Erreur chargement signalements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClassify = (report) => {
    setSelectedReport(report)
    setClassificationModal(true)
  }

  const handleClassification = async (classification, notes) => {
    try {
      await reportsAPI.classify(selectedReport.id, { classification, notes })
      alert('Signalement classifié avec succès !')
      setClassificationModal(false)
      setSelectedReport(null)
      fetchReports()
    } catch (error) {
      console.error('Erreur classification:', error)
      alert('Erreur lors de la classification')
    }
  }

  const handleViewDetails = (reportId) => {
    navigate(`/reports/${reportId}`)
  }

  const getPriorityBadge = (urgency) => {
    const badges = {
      'critique': 'sos-badge-urgent',
      'moyen': 'sos-badge-warning',
      'faible': 'sos-badge-success'
    }
    return badges[urgency] || 'sos-badge-info'
  }

  if (loading) {
    return (
      <SOSCard title="Chargement..." variant="info">
        <div className="loading-state">Chargement des signalements...</div>
      </SOSCard>
    )
  }

  return (
    <>
      <SOSCard title="Signalements à traiter" subtitle={`${reports.length} cas nécessitant une analyse`} variant="info">
        {reports.length === 0 ? (
          <div className="empty-state">
            <SOSIcons.Check size={64} color="#00abec" />
            <p>Aucun signalement en attente</p>
            <p className="empty-hint">Tous les cas ont été traités !</p>
          </div>
        ) : (
          <table className="sos-table">
            <thead>
              <tr>
                <th><SOSIcons.Document size={16} /> Référence</th>
                <th><SOSIcons.Notification size={16} /> Date</th>
                <th><SOSIcons.Village size={16} /> Village</th>
                <th><SOSIcons.Alert size={16} /> Type</th>
                <th><SOSIcons.Heart size={16} /> Urgence</th>
                <th><SOSIcons.User size={16} /> Enfant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td><strong>{report.reportId || report.id}</strong></td>
                  <td>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>{report.village}</td>
                  <td>{report.incidentType}</td>
                  <td>
                    <span className={`sos-badge ${getPriorityBadge(report.urgencyLevel)}`}>
                      {report.urgencyLevel}
                    </span>
                  </td>
                  <td>{report.childName}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleViewDetails(report.id)}
                        title="Voir détails"
                      >
                        <SOSIcons.Search size={16} />
                      </button>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleClassify(report)}
                        title="Classifier"
                      >
                        <SOSIcons.Check size={16} />
                        Classer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SOSCard>

      {classificationModal && selectedReport && (
        <ClassificationModal
          report={selectedReport}
          onClose={() => setClassificationModal(false)}
          onClassify={handleClassification}
        />
      )}
    </>
  )
}

function ClassificationModal({ report, onClose, onClassify }) {
  const [classification, setClassification] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!classification) {
      alert('Veuillez sélectionner une classification')
      return
    }
    setSubmitting(true)
    await onClassify(classification, notes)
    setSubmitting(false)
  }

  const classifications = [
    { value: 'sauvegarde', label: 'Sauvegarde', desc: 'Cas nécessitant une protection immédiate', color: '#ef4444' },
    { value: 'prise_en_charge', label: 'Prise en charge', desc: 'Accompagnement psychosocial', color: '#f59e0b' },
    { value: 'faux_signalement', label: 'Faux signalement', desc: 'Signalement non fondé', color: '#6b7280' }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content classification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Classifier le signalement</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="report-info">
            <p><strong>Référence:</strong> {report.reportId || report.id}</p>
            <p><strong>Enfant:</strong> {report.childName}</p>
            <p><strong>Village:</strong> {report.village}</p>
          </div>
          
          <div className="classification-options">
            {classifications.map((c) => (
              <div
                key={c.value}
                className={`classification-option ${classification === c.value ? 'selected' : ''}`}
                onClick={() => setClassification(c.value)}
                style={{ borderColor: classification === c.value ? c.color : undefined }}
              >
                <div className="classification-color" style={{ background: c.color }}></div>
                <div className="classification-details">
                  <h4>{c.label}</h4>
                  <p>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Notes / Observations</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Ajoutez vos observations et recommandations..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Classification...' : 'Confirmer la classification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function WorkflowView() {
  const [activeStep, setActiveStep] = useState(0)
  
  const workflowSteps = [
    { 
      title: "Fiche Initiale", 
      description: "Signalement reçu + Rapport DPE envoyé au Directeur et Bureau National",
      actions: ['Créer fiche initiale', 'Notifier Directeur', 'Envoyer au Bureau National']
    },
    { 
      title: "Évaluation Complète", 
      description: "Analyse approfondie du cas par l'équipe psychosociale",
      actions: ['Évaluation psychologique', 'Entretien avec l\'enfant', 'Collecte d\'informations']
    },
    { 
      title: "Plan d'Action", 
      description: "Élaboration de la stratégie d'intervention",
      actions: ['Définir objectifs', 'Planifier interventions', 'Assigner ressources']
    },
    { 
      title: "Rapport de Suivi", 
      description: "Suivi documenté de l'évolution du cas",
      actions: ['Rédiger rapport suivi', 'Évaluer progression', 'Ajuster plan']
    },
    { 
      title: "Rapport Final", 
      description: "Synthèse et recommandations",
      actions: ['Synthèse complète', 'Recommandations', 'Proposition cloture']
    },
    { 
      title: "Avis de Cloture", 
      description: "Validation finale et archivage",
      actions: ['Validation Décideur', 'Archivage dossier', 'Notification parties']
    }
  ]

  return (
    <SOSCard title="Processus de Traitement SOS" subtitle="Workflow des 6 étapes obligatoires" variant="info">
      <div className="workflow-container">
        <div className="workflow-steps">
          {workflowSteps.map((step, idx) => (
            <div 
              key={idx} 
              className={`workflow-step ${idx === activeStep ? 'active' : ''} ${idx < activeStep ? 'completed' : ''}`}
              onClick={() => setActiveStep(idx)}
            >
              <div className="step-number">{idx + 1}</div>
              <div className="step-content">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="workflow-detail">
          <h3>Étape {activeStep + 1}: {workflowSteps[activeStep].title}</h3>
          <p>{workflowSteps[activeStep].description}</p>
          
          <div className="workflow-actions">
            <h4>Actions requises:</h4>
            <ul>
              {workflowSteps[activeStep].actions.map((action, idx) => (
                <li key={idx}>
                  <SOSIcons.Check size={16} />
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="workflow-navigation">
            <button 
              className="btn btn-secondary"
              disabled={activeStep === 0}
              onClick={() => setActiveStep(activeStep - 1)}
            >
              ← Étape précédente
            </button>
            <button 
              className="btn btn-primary"
              disabled={activeStep === workflowSteps.length - 1}
              onClick={() => setActiveStep(activeStep + 1)}
            >
              Étape suivante →
            </button>
          </div>
        </div>
      </div>
    </SOSCard>
  )
}

function MyProcessedCases() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProcessedReports()
  }, [])

  const fetchProcessedReports = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getAll({ 
        status: 'sauvegarde,pris_en_charge,faux,cloture'
      })
      setReports(response.data?.data?.reports || [])
    } catch (error) {
      console.error('Erreur chargement cas traités:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'sauvegarde': { class: 'sos-badge-urgent', label: 'Sauvegarde' },
      'pris_en_charge': { class: 'sos-badge-warning', label: 'Pris en charge' },
      'faux': { class: 'sos-badge-secondary', label: 'Faux signalement' },
      'cloture': { class: 'sos-badge-success', label: 'Cloturé' }
    }
    const badge = badges[status] || { class: 'sos-badge-info', label: status }
    return <span className={`sos-badge ${badge.class}`}>{badge.label}</span>
  }

  return (
    <SOSCard title="Mes Cas Traités" subtitle="Historique des signalements que vous avez traités" variant="info">
      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : reports.length === 0 ? (
        <div className="empty-state">
          <SOSIcons.Document size={64} color="#00abec" />
          <p>Aucun cas traité pour le moment</p>
        </div>
      ) : (
        <table className="sos-table">
          <thead>
            <tr>
              <th><SOSIcons.Document size={16} /> Référence</th>
              <th><SOSIcons.Notification size={16} /> Date</th>
              <th><SOSIcons.Village size={16} /> Village</th>
              <th><SOSIcons.Alert size={16} /> Type</th>
              <th><SOSIcons.Check size={16} /> Classification</th>
              <th><SOSIcons.Heart size={16} /> Statut</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td><strong>{report.reportId || report.id}</strong></td>
                <td>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>{report.village}</td>
                <td>{report.incidentType}</td>
                <td>{report.classification || '-'}</td>
                <td>{getStatusBadge(report.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SOSCard>
  )
}

export default Level2Dashboard
