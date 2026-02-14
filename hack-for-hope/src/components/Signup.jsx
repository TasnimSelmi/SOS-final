import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SOSLogo from './SOSLogo'
import { SOSDecorations } from './SOSDecorations'
import './Signup.css'

function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '1',
    village: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const villages = [
    { id: 'gammarth', name: 'Village Gammarth' },
    { id: 'siliana', name: 'Village Siliana' },
    { id: 'mahres', name: 'Village Mahrès' },
    { id: 'akouda', name: 'Village Akouda' }
  ]

  const roles = [
    { id: '1', name: 'Niveau 1 - Déclarant', description: 'Mères SOS, Tantes SOS, Éducateurs' },
    { id: '2', name: 'Niveau 2 - Analyse', description: 'Psychologues, Responsables sociaux' },
    { id: '3', name: 'Niveau 3 - Gouvernance', description: 'Direction du Village, Bureau National' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    setLoading(true)
    
    // Simulation inscription - dans un vrai cas, appel API ici
    setTimeout(() => {
      setLoading(false)
      // Redirection vers login après inscription
      navigate('/login')
    }, 1500)
  }

  return (
    <div className="signup-screen">
      <SOSDecorations />
      
      <div className="signup-container">
        <div className="signup-header">
          <SOSLogo size={60} />
          <h1>Inscription</h1>
          <p>Créer votre compte Hack for Hope</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nom complet *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Votre nom"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Nom d'utilisateur *</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              placeholder="Choisissez un nom d'utilisateur"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mot de passe *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label>Confirmer mot de passe *</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Village SOS *</label>
              <select
                value={formData.village}
                onChange={(e) => setFormData({...formData, village: e.target.value})}
                required
              >
                <option value="">Sélectionner votre village</option>
                {villages.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Niveau d'accès *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="role-info">
            <p>{roles.find(r => r.id === formData.role)?.description}</p>
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Vous avez déjà un compte ?</p>
          <Link to="/login" className="btn btn-secondary">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signup
