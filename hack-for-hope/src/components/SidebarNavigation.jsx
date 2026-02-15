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

  // Add admin link if user is admin
  if (user?.role === 'admin') {
    menuItems.push({ path: '/admin/users', icon: SOSIcons.User, label: 'Gestion Utilisateurs' })
  }

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
                <span className="user-name">{user.fullName || user.name || `${user.firstName} ${user.lastName}`}</span>
                <span className="user-role">
                  {user.role === 'admin' ? 'Administrateur' :
                   user.role === 'mere' ? 'Mère SOS' :
                   user.role === 'tante' ? 'Tante SOS' :
                   user.role === 'educateur' ? 'Éducateur' :
                   user.role === 'psychologue' ? 'Psychologue' :
                   user.role === 'decideur1' ? 'Décideur 1' :
                   user.role === 'decideur2' ? 'Décideur 2' :
                   user.role}
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
