import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProfile } from '../context/ProfileContext'
import { useAuth } from '../context/AuthContext'
import { SOSIcons } from '../components/SOSIcons'
import SOSLogo from '../components/SOSLogo'
import './ProfileSettings.css'

function ProfileSettings() {
  const { profile, updateProfile, uploadAvatar, deleteAvatar, getCurrentLocation } = useProfile()
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [locationLoading, setLocationLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: profile.name || user?.name || '',
    email: profile.email || user?.email || '',
    username: profile.username || user?.username || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    village: profile.village || user?.village || ''
  })

  const villages = [
    { id: 'gammarth', name: 'Village Gammarth' },
    { id: 'siliana', name: 'Village Siliana' },
    { id: 'mahres', name: 'Village Mahrès' },
    { id: 'akouda', name: 'Village Akouda' }
  ]

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await uploadAvatar(file)
      setMessage({ type: 'success', text: 'Photo de profil mise à jour avec succès!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAvatar = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil?')) {
      deleteAvatar()
      setMessage({ type: 'success', text: 'Photo de profil supprimée' })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const handleGetLocation = async () => {
    setLocationLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const location = await getCurrentLocation()
      setMessage({ 
        type: 'success', 
        text: `Localisation obtenue: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` 
      })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLocationLoading(false)
    }
  }

  const displayName = profile.name || user?.name || 'Utilisateur'
  const avatarUrl = profile.avatar

  return (
    <div className="profile-settings-page">
      <div className="settings-header">
        <div className="settings-header-content">
          <SOSLogo size={50} />
          <div>
            <h1>Paramètres du Profil</h1>
            <p>Gérez vos informations personnelles et préférences</p>
          </div>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">
          <SOSIcons.Village size={18} />
          Retour au Dashboard
        </Link>
      </div>

      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-avatar-section">
            <div className="settings-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} />
              ) : (
                <div className="avatar-placeholder large">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <button 
                className="avatar-change-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {loading ? '...' : <SOSIcons.Family size={18} />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            <h3>{displayName}</h3>
            <p className="user-role">
              {profile.village && villages.find(v => v.id === profile.village)?.name}
            </p>
            {avatarUrl && (
              <button className="btn btn-text" onClick={handleDeleteAvatar}>
                Supprimer la photo
              </button>
            )}
          </div>

          <nav className="settings-nav">
            <a href="#general" className="settings-nav-item active">
              <SOSIcons.User size={18} />
              Informations générales
            </a>
            <a href="#location" className="settings-nav-item">
              <SOSIcons.Village size={18} />
              Localisation
            </a>
            <a href="#security" className="settings-nav-item">
              <SOSIcons.Shield size={18} />
              Sécurité
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <section id="general" className="settings-section">
              <h2>Informations générales</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Votre nom"
                  />
                </div>
                <div className="form-group">
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="@username"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Village SOS</label>
                <select
                  value={formData.village}
                  onChange={(e) => setFormData({...formData, village: e.target.value})}
                >
                  <option value="">Sélectionner votre village</option>
                  {villages.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Dites-nous en plus sur vous..."
                  rows={4}
                />
              </div>
            </section>

            <section id="location" className="settings-section">
              <h2>Localisation</h2>
              <p className="section-description">
                Votre localisation est importante pour les signalements d'urgence.
              </p>

              <div className="location-card">
                <div className="location-info">
                  <SOSIcons.Village size={32} color="#00abec" />
                  <div>
                    <h4>Position actuelle</h4>
                    {profile.location ? (
                      <p>
                        Lat: {profile.location.lat.toFixed(6)}, Lng: {profile.location.lng.toFixed(6)}
                        <br />
                        <small>Précision: {profile.location.accuracy?.toFixed(0)}m</small>
                      </p>
                    ) : (
                      <p className="text-muted">Localisation non définie</p>
                    )}
                  </div>
                </div>
                <button 
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGetLocation}
                  disabled={locationLoading}
                >
                  {locationLoading ? 'Obtention...' : 'Obtenir ma position'}
                </button>
              </div>
            </section>

            <section id="security" className="settings-section">
              <h2>Sécurité</h2>
              
              <div className="security-options">
                <div className="security-option">
                  <div>
                    <h4>Changer le mot de passe</h4>
                    <p>Mettez à jour votre mot de passe régulièrement</p>
                  </div>
                  <button type="button" className="btn btn-secondary">
                    Modifier
                  </button>
                </div>

                <div className="security-option">
                  <div>
                    <h4>Authentification à deux facteurs</h4>
                    <p>Activez la 2FA pour plus de sécurité</p>
                  </div>
                  <button type="button" className="btn btn-secondary">
                    Configurer
                  </button>
                </div>
              </div>
            </section>

            <div className="settings-actions">
              <button type="submit" className="btn btn-primary btn-large">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
