import React from 'react'
import SidebarNavigation from './SidebarNavigation'
import ConfidentialBanner from './ConfidentialBanner'
import StatsOverview from './StatsOverview'
import NotificationsPanel from './NotificationsPanel'
import Level1Dashboard from './Level1Dashboard'
import Level2Dashboard from './Level2Dashboard'
import Level3Dashboard from './Level3Dashboard'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const renderDashboard = () => {
    switch(user.role) {
      case 1:
        return <Level1Dashboard />
      case 2:
        return <Level2Dashboard />
      case 3:
        return <Level3Dashboard />
      default:
        return <Level1Dashboard />
    }
  }

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
            <button className="btn btn-primary btn-new-report">
              + Nouveau signalement
            </button>
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
