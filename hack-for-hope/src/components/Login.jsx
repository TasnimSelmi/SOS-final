import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import SOSLogo from './SOSLogo'
import { SOSDecorations } from './SOSDecorations'
import './Login.css'

const roles = [
  { id: 'admin', level: 'Administrateur', description: 'Gestion des utilisateurs et configuration', icon: '👤' },
  { id: 1, level: 'Niveau 1 - Déclarant', description: 'Mères SOS, Tantes SOS, Éducateurs', icon: '📝' },
  { id: 2, level: 'Niveau 2 - Analyse & Traitement', description: 'Psychologues, Responsables sociaux', icon: '🔍' },
  { id: 3, level: 'Niveau 3 - Gouvernance', description: 'Direction du Village, Bureau National', icon: '⚖️' }
]

function Login() {
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState(null)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!selectedRole) {
      setError('Veuillez sélectionner un rôle')
      return
    }
    
    setLoading(true)
    const result = await login({ ...credentials, role: selectedRole })
    setLoading(false)
    
    if (!result.success) {
      setError(result.error)
    }
  }

  return (
    <div className="login-screen">
      <SOSDecorations />
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <SOSLogo size={56} />
          </div>
          <h1>Hack for Hope</h1>
          <p className="subtitle">Plateforme de Protection de l'Enfance<br/>SOS Villages d'Enfants Tunisie</p>
          <div className="sos-slogan-center">
            <span className="we-can">WE CAN,</span>
            <span className="we-do">WE DO,</span>
            <span className="with-text">WITH</span>
            <span className="love-text">love</span>
          </div>
        </div>
        
        <div className="login-body">
          {error && <div className="error-message">{error}</div>}
          
          <div className="role-selection">
            <h3>Sélectionnez votre rôle</h3>
            <div className="role-cards">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`role-card level-${role.id} ${selectedRole === role.id ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="role-icon">{role.icon}</div>
                  <div className="role-info">
                    <h4>{role.level}</h4>
                    <p>{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom d'utilisateur</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: admin"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
