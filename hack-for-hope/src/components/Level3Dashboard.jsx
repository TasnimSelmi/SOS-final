import React, { useState } from 'react'
import { SOSIcons } from './SOSIcons'
import { SOSCard, SOSStatCard } from './SOSCard'
import { SOSBarChart } from './SOSChart'
import './Dashboard.css'

function Level3Dashboard() {
  const [activeTab, setActiveTab] = useState('vue-globale')

  return (
    <div className="level3-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Shield size={48} color="#00abec" />
        <div>
          <h1>Espace Gouvernance</h1>
          <p>Niveau 3 - Direction du Village, Bureau National</p>
        </div>
      </div>
      
      <div className="nav-tabs">
        <button className={`nav-btn ${activeTab === 'vue-globale' ? 'active' : ''}`} onClick={() => setActiveTab('vue-globale')}>
          <SOSIcons.Document size={20} />
          Vue Globale
        </button>
        <button className={`nav-btn ${activeTab === 'decisions' ? 'active' : ''}`} onClick={() => setActiveTab('decisions')}>
          <SOSIcons.Check size={20} />
          Décisions
        </button>
        <button className={`nav-btn ${activeTab === 'archives' ? 'active' : ''}`} onClick={() => setActiveTab('archives')}>
          <SOSIcons.Family size={20} />
          Archives
        </button>
      </div>
      
      {activeTab === 'vue-globale' && <GovernanceOverview />}
      {activeTab === 'decisions' && <DecisionsView />}
      {activeTab === 'archives' && <ArchivesView />}
    </div>
  )
}

function GovernanceOverview() {
  const villageStats = [
    { label: 'Gammarth', value1: 85, value2: 92 },
    { label: 'Siliana', value1: 78, value2: 88 },
    { label: 'Mahrès', value1: 72, value2: 85 },
    { label: 'Akouda', value1: 80, value2: 90 }
  ]

  return (
    <>
      <div className="stats-grid">
        <SOSStatCard number="127" label="Total cas trimestre" variant="info" />
        <SOSStatCard number="2.3j" label="Temps moyen traitement" variant="warning" />
        <SOSStatCard number="94%" label="Taux résolution" variant="success" />
        <SOSStatCard number="15" label="Décisions en attente" variant="urgent" />
      </div>
      
      <SOSCard title="Performance par village" subtitle="Taux de résolution et satisfaction" variant="info">
        <SOSBarChart data={villageStats} barColors={['#1c325d', '#00abec']} showValues={true} />
      </SOSCard>
      
      <SOSCard title="Vue globale par village" subtitle="État des signalements par village SOS" variant="info">
        <table className="sos-table">
          <thead>
            <tr>
              <th><SOSIcons.Village size={16} /> Village</th>
              <th><SOSIcons.Document size={16} /> Actifs</th>
              <th><SOSIcons.Notification size={16} /> Traités</th>
              <th><SOSIcons.Check size={16} /> Clôturés</th>
              <th><SOSIcons.Heart size={16} /> Taux</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Village Gammarth</strong></td>
              <td>12</td>
              <td>8</td>
              <td>45</td>
              <td><span className="success-rate high">96%</span></td>
            </tr>
            <tr>
              <td><strong>Village Siliana</strong></td>
              <td>8</td>
              <td>5</td>
              <td>38</td>
              <td><span className="success-rate high">93%</span></td>
            </tr>
            <tr>
              <td><strong>Village Mahrès</strong></td>
              <td>6</td>
              <td>4</td>
              <td>32</td>
              <td><span className="success-rate high">95%</span></td>
            </tr>
            <tr>
              <td><strong>Village Akouda</strong></td>
              <td>10</td>
              <td>7</td>
              <td>41</td>
              <td><span className="success-rate high">94%</span></td>
            </tr>
          </tbody>
        </table>
      </SOSCard>
    </>
  )
}

function DecisionsView() {
  const pendingDecisions = [
    { id: 'D2026-015', title: 'Clôture cas #2026-089', type: 'Clôture', priority: 'Urgent', requester: 'Dr. Psychologue' },
    { id: 'D2026-014', title: 'Transfert externe cas #2026-076', type: 'Transfert', priority: 'Normal', requester: 'Mère SOS' },
    { id: 'D2026-013', title: "Plan d'action cas #2026-071", type: 'Plan', priority: 'Normal', requester: 'Responsable Social' }
  ]

  return (
    <SOSCard title="Prise de décision" subtitle="Décisions formelles et validations en attente" variant="urgent">
      <table className="sos-table">
        <thead>
          <tr>
            <th><SOSIcons.Document size={16} /> ID</th>
            <th><SOSIcons.Alert size={16} /> Titre</th>
            <th><SOSIcons.Notification size={16} /> Type</th>
            <th><SOSIcons.Heart size={16} /> Priorité</th>
            <th><SOSIcons.User size={16} /> Demandeur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingDecisions.map((decision) => (
            <tr key={decision.id}>
              <td><strong>{decision.id}</strong></td>
              <td>{decision.title}</td>
              <td>{decision.type}</td>
              <td>
                <span className={`sos-badge sos-badge-${decision.priority.toLowerCase()}`}>
                  {decision.priority}
                </span>
              </td>
              <td>{decision.requester}</td>
              <td>
                <button className="btn btn-primary btn-sm">
                  <SOSIcons.Check size={16} />
                  Décider
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SOSCard>
  )
}

function ArchivesView() {
  const archivedCases = [
    { id: '#2026-001', date: 'Jan 2026', village: 'Gammarth', type: 'Comportement', outcome: 'Résolu' },
    { id: '#2025-189', date: 'Déc 2025', village: 'Siliana', type: 'Santé', outcome: 'Transféré' },
    { id: '#2025-156', date: 'Nov 2025', village: 'Mahrès', type: 'Conflit', outcome: 'Résolu' },
    { id: '#2025-134', date: 'Oct 2025', village: 'Akouda', type: 'Violence', outcome: 'Résolu' }
  ]

  return (
    <SOSCard title="Archives sécurisées" subtitle="Historique des dossiers clôturés" variant="success">
      <table className="sos-table">
        <thead>
          <tr>
            <th><SOSIcons.Document size={16} /> Référence</th>
            <th><SOSIcons.Notification size={16} /> Date</th>
            <th><SOSIcons.Village size={16} /> Village</th>
            <th><SOSIcons.Alert size={16} /> Type</th>
            <th><SOSIcons.Check size={16} /> Issue</th>
          </tr>
        </thead>
        <tbody>
          {archivedCases.map((caseItem) => (
            <tr key={caseItem.id}>
              <td><strong>{caseItem.id}</strong></td>
              <td>{caseItem.date}</td>
              <td>{caseItem.village}</td>
              <td>{caseItem.type}</td>
              <td>
                <span className={`sos-badge sos-badge-${caseItem.outcome.toLowerCase()}`}>
                  {caseItem.outcome}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SOSCard>
  )
}

export default Level3Dashboard
