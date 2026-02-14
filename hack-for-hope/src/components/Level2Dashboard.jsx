import React, { useState } from 'react'
import { SOSIcons } from './SOSIcons'
import { SOSCard, SOSStatCard } from './SOSCard'
import { SOSNumberedList } from './SOSChart'
import './Level2Dashboard.css'

function Level2Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="level2-dashboard">
      <div className="dashboard-header">
        <SOSIcons.Search size={48} color="#00abec" />
        <div>
          <h1>Espace Analyse & Traitement</h1>
          <p>Niveau 2 - Psychologues, Responsables sociaux</p>
        </div>
      </div>
      
      <div className="nav-tabs">
        <button className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          <SOSIcons.Document size={20} />
          Dashboard
        </button>
        <button className={`nav-btn ${activeTab === 'a-traiter' ? 'active' : ''}`} onClick={() => setActiveTab('a-traiter')}>
          <SOSIcons.Alert size={20} />
          À Traiter
        </button>
        <button className={`nav-btn ${activeTab === 'workflow' ? 'active' : ''}`} onClick={() => setActiveTab('workflow')}>
          <SOSIcons.Family size={20} />
          Workflow
        </button>
      </div>
      
      {activeTab === 'dashboard' && <AnalystDashboard />}
      {activeTab === 'a-traiter' && <ReportsToProcess />}
      {activeTab === 'workflow' && <WorkflowView />}
    </div>
  )
}

function AnalystDashboard() {
  return (
    <>
      <div className="stats-grid">
        <SOSStatCard
          number="24"
          label="Signalements en attente"
          variant="info"
        />
        <SOSStatCard
          number="8"
          label="Cas urgents"
          variant="urgent"
        />
        <SOSStatCard
          number="156"
          label="Cas traités ce mois"
          variant="success"
        />
        <SOSStatCard
          number="4"
          label="Villages actifs"
          variant="warning"
        />
      </div>
      
      <SOSCard title="Vue par village" subtitle="Répartition des cas par village SOS" variant="info">
        <table className="sos-table">
          <thead>
            <tr>
              <th><SOSIcons.Village size={16} /> Village</th>
              <th><SOSIcons.Document size={16} /> Actifs</th>
              <th><SOSIcons.Notification size={16} /> En traitement</th>
              <th><SOSIcons.Check size={16} /> Clôturés</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Village Gammarth</strong></td>
              <td>12</td>
              <td>8</td>
              <td>45</td>
            </tr>
            <tr>
              <td><strong>Village Siliana</strong></td>
              <td>8</td>
              <td>5</td>
              <td>38</td>
            </tr>
            <tr>
              <td><strong>Village Mahrès</strong></td>
              <td>6</td>
              <td>4</td>
              <td>32</td>
            </tr>
            <tr>
              <td><strong>Village Akouda</strong></td>
              <td>10</td>
              <td>7</td>
              <td>41</td>
            </tr>
          </tbody>
        </table>
      </SOSCard>
    </>
  )
}

function ReportsToProcess() {
  const reports = [
    { id: '#2026-089', date: '14 Fév 2026', type: 'Comportement', priorite: 'Élevée', village: 'Gammarth' },
    { id: '#2026-088', date: '13 Fév 2026', type: 'Santé', priorite: 'Moyenne', village: 'Siliana' },
    { id: '#2026-087', date: '12 Fév 2026', type: 'Conflit', priorite: 'Basse', village: 'Mahrès' },
    { id: '#2026-086', date: '11 Fév 2026', type: 'Violence', priorite: 'Élevée', village: 'Akouda' }
  ]

  return (
    <SOSCard title="Signalements à traiter" subtitle="Liste des cas nécessitant une analyse" variant="info">
      <table className="sos-table">
        <thead>
          <tr>
            <th><SOSIcons.Document size={16} /> Référence</th>
            <th><SOSIcons.Notification size={16} /> Date</th>
            <th><SOSIcons.Village size={16} /> Village</th>
            <th><SOSIcons.Alert size={16} /> Type</th>
            <th><SOSIcons.Heart size={16} /> Priorité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td><strong>{report.id}</strong></td>
              <td>{report.date}</td>
              <td>{report.village}</td>
              <td>{report.type}</td>
              <td>
                <span className={`sos-badge sos-badge-${report.priorite.toLowerCase()}`}>
                  {report.priorite}
                </span>
              </td>
              <td>
                <button className="btn btn-primary btn-sm">
                  <SOSIcons.Search size={16} />
                  Traiter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SOSCard>
  )
}

function WorkflowView() {
  const workflowSteps = [
    { title: "Fiche Initiale", description: "Signalement reçu + Rapport DPE envoyé au Directeur et Bureau National" },
    { title: "Évaluation Complète", description: "Analyse approfondie du cas par l'équipe psychosociale" },
    { title: "Plan d'Action", description: "Élaboration de la stratégie d'intervention" },
    { title: "Rapport de Suivi", description: "Suivi documenté de l'évolution du cas" },
    { title: "Rapport Final", description: "Synthèse et recommandations" },
    { title: "Avis de Clôture", description: "Validation finale et archivage" }
  ]

  return (
    <SOSCard title="Processus de Traitement" subtitle="Workflow SOS - Les 6 étapes obligatoires" variant="info">
      <SOSNumberedList items={workflowSteps} />
    </SOSCard>
  )
}

export default Level2Dashboard
