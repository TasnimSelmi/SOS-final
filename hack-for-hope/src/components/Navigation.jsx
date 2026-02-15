import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SOSLogo from './SOSLogo'
import { SOSIcons } from './SOSIcons'
import UserProfile from './UserProfile'
import NotificationBell from './NotificationBell'
import './Navigation.css'

function Navigation({ user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const publicLinks = [
    { path: '/', label: 'Accueil', icon: SOSIcons.Village },
    { path: '/about', label: 'À Propos', icon: SOSIcons.Family },
    { path: '/contact', label: 'Contact', icon: SOSIcons.User }
  ]

  const privateLinks = [
    { path: '/dashboard', label: 'Tableau de Bord', icon: SOSIcons.Document },
    { path: '/reports', label: 'Signalements', icon: SOSIcons.Alert }
  ]

  return (
    <nav className="main-navigation">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <SOSLogo size={40} />
          </div>
          <div className="nav-logo-text">
            <span className="nav-title">Hack for Hope</span>
            <span className="nav-subtitle">SOS Villages d'Enfants</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-desktop">
          <ul className="nav-links">
            {publicLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {user ? (
            <div className="nav-user-section">
              <NotificationBell />
              <div className="nav-divider"></div>
              <UserProfile />
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-primary">
                <SOSIcons.Village size={18} />
                Connexion
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`nav-mobile ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="nav-mobile-links">
          {publicLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon size={24} />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
          
          {user && privateLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <link.icon size={24} />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}

          {user ? (
            <li>
              <button onClick={onLogout} className="nav-mobile-link">
                <SOSIcons.User size={24} />
                <span>Déconnexion</span>
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="nav-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                <SOSIcons.Village size={24} />
                <span>Connexion</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
