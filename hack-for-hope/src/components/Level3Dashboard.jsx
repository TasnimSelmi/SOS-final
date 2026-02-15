import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { reportsAPI } from '../services/api'
import { useSocket } from '../context/SocketContext'
import { SOSIcons } from './SOSIcons'
import { SOSCard, SOSStatCard } from './SOSCard'
import './Level3Dashboard.css'

function Level3Dashboard() {
  const [activeTab, setActiveTab] = useState('vue-globale')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    urgent: 0,
    resolved: 0
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
        total: reports.length,
        pending: reports.filter(r => ['en_attente', 'en_cours'].includes(r.status)).length,
        urgent: reports.filter(r => r.urgencyLevel === 'critique').length,
        resolved: reports.filter(r => ['cloture', 'sauvegarde', 'pris_en_charge'].includes(r.status)).length
      })
    } catch (error) {
      console.error('Erreur stats:', error)
    }
  }

  return (
    <div className="level3-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Shield size={48} color="#00abec" />
        <div>
          <h1>Espace Gouvernance & Décision</h1>
          <p>Niveau 3 - Direction du Village, Bureau National</p>
        </div>
        {unreadCount > 0 && (
          <div className="notification-badge">
            <SOSIcons.Notification size={24} />
            <span className="badge-count">{unreadCount}</span>
          </div>
        )}
      </div>
      
      <div className="nav-tabs">
        <button className={`nav-btn ${activeTab === 'vue-globale' ? 'active' : ''}`} onClick={() => setActiveTab('vue-globale')}>
          <SOSIcons.Document size={20} />
          Vue Globale
        </button>
        <button className={`nav-btn ${activeTab === 'decisions' ? 'active' : ''}`} onClick={() => setActiveTab('decisions')}>
          <SOSIcons.Check size={20} />
          Prise de Décision
          {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
        </button>
        <button className={`nav-btn ${activeTab === 'archives' ? 'active' : ''}`} onClick={() => setActiveTab('archives')}>
          <SOSIcons.Family size={20} />
          Archives Sécurisées
        </button>
      </div>
      
      {activeTab === 'vue-globale' && <GovernanceOverview stats={stats} />}
      {activeTab === 'decisions' && <DecisionMaking />}
      {activeTab === 'archives' && <SecureArchives />}
    </div>
  )
}

function GovernanceOverview({ stats }) {
  const [villageStats, setVillageStats] = useState([
    { label: 'Gammarth', total: 85, pending: 12, resolved: 73 },
    { label: 'Siliana', total: 78, pending: 8, resolved: 70 },
    { label: 'Mahrès', total: 72, pending: 6, resolved: 66 },
    { label: 'Akouda', total: 80, pending: 10, resolved: 70 }
  ])

  return (
    <>
      <div className="stats-grid">
        <SOSStatCard number={stats.total} label="Total cas" variant="info" />
        <SOSStatCard number={stats.pending} label="Décisions en attente" variant="urgent" />
        <SOSStatCard number={stats.urgent} label="Cas urgents" variant="urgent" />
        <SOSStatCard number={stats.resolved} label="Cas résolus" variant="success" />
      </div>
      
      <SOSCard title="Performance par village" subtitle="Taux de résolution et statistiques" variant="info">
        <table className="sos-table">
          <thead>
            <tr>
              <th><SOSIcons.Village size={16} /> Village</th>
              <th><SOSIcons.Document size={16} /> Total Cas</th>
              <th><SOSIcons.Notification size={16} /> En attente</th>
              <th><SOSIcons.Check size={16} /> Résolus</th>
              <th><SOSIcons.Heart size={16} /> Taux résolution</th>
            </tr>
          </thead>
          <tbody>
            {villageStats.map((v) => (
              <tr key={v.label}>
                <td><strong>Village {v.label}</strong></td>
                <td>{v.total}</td>
                <td>{v.pending}</td>
                <td>{v.resolved}</td>
                <td>
                  <span className={`success-rate ${v.resolved/v.total > 0.8 ? 'high' : 'medium'}`}>
                    {Math.round((v.resolved/v.total) * 100)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SOSCard>
      
      <SOSCard title="Alertes et Priorités" subtitle="Cas nécessitant une attention immédiate" variant="urgent">
        <div className="alerts-list">
          <div className="alert-item urgent">
            <SOSIcons.Alert size={20} color="#ef4444" />
            <div>
              <h4>3 cas urgents en attente de décision</h4>
              <p>Village Gammarth - Niveau de risque: Élevé</p>
            </div>
          </div>
          <div className="alert-item warning">
            <SOSIcons.Notification size={20} color="#f59e0b" />
            <div>
              <h4>5 rapports de suivi en retard</h4>
              <p>Délai de traitement dépassé</p>
            </div>
          </div>
        </div>
      </SOSCard>
    </>
  )
}

function DecisionMaking() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [decisionModal, setDecisionModal] = useState(false)

  useEffect(() => {
    fetchPendingDecisions()
  }, [])

  const fetchPendingDecisions = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getAll({ 
        status: 'sauvegarde,pris_en_charge',
        classification: 'sauvegarde,prise_en_charge'
      })
      setReports(response.data?.data?.reports || [])
    } catch (error) {
      console.error('Erreur chargement décisions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMakeDecision = (report) => {
    setSelectedReport(report)
    setDecisionModal(true)
  }

  const handleDecisionSubmit = async (decision, details) => {
    try {
      await reportsAPI.makeDecision(selectedReport.id, { decision, details })
      alert('Décision enregistrée avec succès !')
      setDecisionModal(false)
      setSelectedReport(null)
      fetchPendingDecisions()
    } catch (error) {
      console.error('Erreur décision:', error)
      alert('Erreur lors de l\'enregistrement de la décision')
    }
  }

  const getClassificationBadge = (classification) => {
    const badges = {
      'sauvegarde': { class: 'sos-badge-urgent', label: 'Sauvegarde' },
      'prise_en_charge': { class: 'sos-badge-warning', label: 'Prise en charge' }
    }
    const badge = badges[classification] || { class: 'sos-badge-info', label: classification }
    return <span className={`sos-badge ${badge.class}`}>{badge.label}</span>
  }

  return (
    <>
      <SOSCard title="Prise de Décision" subtitle={`${reports.length} cas en attente de décision formelle`} variant="info">
        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <SOSIcons.Check size={64} color="#22c55e" />
            <p>Aucune décision en attente</p>
            <p className="empty-hint">Tous les cas ont été traités et validés</p>
          </div>
        ) : (
          <table className="sos-table">
            <thead>
              <tr>
                <th><SOSIcons.Document size={16} /> Référence</th>
                <th><SOSIcons.Notification size={16} /> Date</th>
                <th><SOSIcons.Village size={16} /> Village</th>
                <th><SOSIcons.User size={16} /> Enfant</th>
                <th><SOSIcons.Alert size={16} /> Classification</th>
                <th><SOSIcons.Heart size={16} /> Urgence</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td><strong>{report.reportId || report.id}</strong></td>
                  <td>{new Date(report.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td>{report.village}</td>
                  <td>{report.childName}</td>
                  <td>{getClassificationBadge(report.classification)}</td>
                  <td>
                    <span className={`sos-badge ${report.urgencyLevel === 'critique' ? 'sos-badge-urgent' : 'sos-badge-warning'}`}>
                      {report.urgencyLevel}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleMakeDecision(report)}
                    >
                      <SOSIcons.Check size={16} />
                      Décider
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SOSCard>

      {decisionModal && selectedReport && (
        <DecisionModal
          report={selectedReport}
          onClose={() => setDecisionModal(false)}
          onSubmit={handleDecisionSubmit}
        />
      )}
    </>
  )
}

function DecisionModal({ report, onClose, onSubmit }) {
  const [decision, setDecision] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!decision) {
      alert('Veuillez sélectionner une décision')
      return
    }
    setSubmitting(true)
    await onSubmit(decision, details)
    setSubmitting(false)
  }

  const decisions = [
    { value: 'validation', label: 'Validation', desc: 'Valider la prise en charge ou sauvegarde', color: '#22c55e' },
    { value: 'escalade', label: 'Escalade', desc: 'Escalader vers instances supérieures', color: '#f59e0b' },
    { value: 'cloture', label: 'Clôture', desc: 'Clôturer le dossier définitivement', color: '#6b7280' }
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content decision-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Prise de Décision Formelle</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="report-info">
            <p><strong>Référence:</strong> {report.reportId || report.id}</p>
            <p><strong>Enfant:</strong> {report.childName}</p>
            <p><strong>Village:</strong> {report.village}</p>
            <p><strong>Classification:</strong> {report.classification}</p>
          </div>
          
          <div className="decision-options">
            {decisions.map((d) => (
              <div
                key={d.value}
                className={`decision-option ${decision === d.value ? 'selected' : ''}`}
                onClick={() => setDecision(d.value)}
                style={{ borderColor: decision === d.value ? d.color : undefined }}
              >
                <div className="decision-color" style={{ background: d.color }}></div>
                <div className="decision-details">
                  <h4>{d.label}</h4>
                  <p>{d.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Détails de la décision</label>
            <textarea
              className="form-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows="4"
              placeholder="Précisez les mesures prises, sanctions éventuelles, recommandations..."
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Enregistrement...' : 'Enregistrer la décision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SecureArchives() {
  const [archivedReports, setArchivedReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArchivedReports()
  }, [])

  const fetchArchivedReports = async () => {
    try {
      setLoading(true)
      const response = await reportsAPI.getAll({ status: 'cloture,faux' })
      setArchivedReports(response.data?.data?.reports || [])
    } catch (error) {
      console.error('Erreur chargement archives:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = archivedReports.filter(r => 
    r.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reportId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.village?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const badges = {
      'cloture': { class: 'sos-badge-success', label: 'Clôturé' },
      'faux': { class: 'sos-badge-secondary', label: 'Faux signalement' }
    }
    const badge = badges[status] || { class: 'sos-badge-info', label: status }
    return <span className={`sos-badge ${badge.class}`}>{badge.label}</span>
  }

  return (
    <SOSCard title="Archives Sécurisées" subtitle={`${archivedReports.length} dossiers archivés`} variant="info">
      <div className="archives-search">
        <input
          type="text"
          className="form-input"
          placeholder="Rechercher par nom, référence ou village..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <SOSIcons.Document size={64} color="#00abec" />
          <p>Aucun dossier archivé</p>
          <p className="empty-hint">Les dossiers clôturés apparaîtront ici</p>
        </div>
      ) : (
        <table className="sos-table">
          <thead>
            <tr>
              <th><SOSIcons.Document size={16} /> Référence</th>
              <th><SOSIcons.Notification size={16} /> Date archivage</th>
              <th><SOSIcons.Village size={16} /> Village</th>
              <th><SOSIcons.User size={16} /> Enfant</th>
              <th><SOSIcons.Alert size={16} /> Type</th>
              <th><SOSIcons.Check size={16} /> Statut final</th>
              <th>Accès</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report.id}>
                <td><strong>{report.reportId || report.id}</strong></td>
                <td>{new Date(report.updatedAt).toLocaleDateString('fr-FR')}</td>
                <td>{report.village}</td>
                <td>{report.childName}</td>
                <td>{report.incidentType}</td>
                <td>{getStatusBadge(report.status)}</td>
                <td>
                  <button className="btn btn-sm btn-secondary">
                    <SOSIcons.Search size={16} />
                    Voir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </SOSCard>
  )
}

export default Level3Dashboard
