import React from 'react'
import { useNavigate } from 'react-router-dom'
import SidebarNavigation from './SidebarNavigation'
import ConfidentialBanner from './ConfidentialBanner'
import StatsOverview from './StatsOverview'
import NotificationsPanel from './NotificationsPanel'
import Level1Dashboard from './Level1Dashboard'
import Level2Dashboard from './Level2Dashboard'
import Level3Dashboard from './Level3Dashboard'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()

  const renderDashboard = () => {
    // Backend uses string roles: 'mere', 'tante', 'educateur', 'psychologue', 'directeur', 'admin'
    const level1Roles = ['mere', 'tante', 'educateur']
    const level2Roles = ['psychologue']
    const level3Roles = ['directeur', 'admin']

    if (level1Roles.includes(user.role)) {
      return <Level1Dashboard />
    } else if (level2Roles.includes(user.role)) {
      return <Level2Dashboard />
    } else if (level3Roles.includes(user.role)) {
      return <Level3Dashboard />
    } else {
      return <Level1Dashboard />
    }
  }

  const canCreateReport = ['mere', 'tante', 'educateur'].includes(user.role)

  return (
    <div className="dashboard-container">
      <ConfidentialBanner />
      <div className="dashboard-layout">
        <SidebarNavigation user={user} onLogout={onLogout} />
        <main className="dashboard-main">
          <div className="dashboard-header-bar">
            <div className="header-title">
              <h1>Hack for Hope</h1>
              <p className="header-subtitle">"Aucun enfant ne devrait grandir seul" — SOS Tunisie</p>
            </div>
            {canCreateReport && (
              <button 
                className="btn btn-primary btn-new-report"
                onClick={() => navigate('/reports/create')}
              >
                + Nouveau signalement
              </button>
            )}
          </div>
          
          <div className="dashboard-body">
            <div className="dashboard-content-area">
              <StatsOverview />
              {renderDashboard()}
            </div>
            <aside className="dashboard-sidebar-right">
              <NotificationsPanel />
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
