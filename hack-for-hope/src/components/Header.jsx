import React from 'react'
import SOSLogo from './SOSLogo'
import './Header.css'

function Header({ user, onLogout }) {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="header-left">
          <div className="sos-logo">
            <SOSLogo size={44} />
          </div>
          <div className="brand-text">
            <h1>Hack for Hope</h1>
            <div className="sos-slogan">
              <span className="we-can">WE CAN,</span>
              <span className="we-do">WE DO,</span>
              <span className="with-text">WITH</span>
              <span className="love-text">love</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <h3>{user.name}</h3>
            <p className="user-role">{user.role === 1 ? 'Niveau 1 - Déclarant' : user.role === 2 ? 'Niveau 2 - Analyse' : 'Niveau 3 - Gouvernance'}</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>Déconnexion</button>
        </div>
      </div>
    </header>
  )
}

export default Header
