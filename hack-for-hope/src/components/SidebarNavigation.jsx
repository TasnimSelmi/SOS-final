import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SOSIcons } from './SOSIcons'
import SOSLogo from './SOSLogo'
import './SidebarNavigation.css'

function SidebarNavigation({ user, onLogout }) {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  const menuItems = [
    { path: '/dashboard', icon: SOSIcons.Village, label: 'Accueil' },
    { path: '/reports', icon: SOSIcons.Document, label: 'Signalements' },
    { path: '/beneficiaries', icon: SOSIcons.Family, label: 'Bénéficiaires' },
    { path: '/settings', icon: SOSIcons.Heart, label: 'Paramètres' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <SOSLogo size={40} />
        </div>
        <span className="sidebar-title">SOS Villages d'Enfants</span>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">NAVIGATION</span>
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {user && (
          <div className="nav-section">
            <span className="nav-section-title">UTILISATEUR</span>
            <div className="user-info">
              <div className="user-avatar">
                <SOSIcons.User size={24} />
              </div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">
                  {user.role === 1 ? 'Niveau 1 - Déclarant' : 
                   user.role === 2 ? 'Niveau 2 - Analyse' : 
                   'Niveau 3 - Gouvernance'}
                </span>
              </div>
            </div>
            <button onClick={onLogout} className="logout-btn">
              <SOSIcons.Alert size={18} />
              Déconnexion
            </button>
          </div>
        )}
      </nav>
    </aside>
  )
}

export default SidebarNavigation
