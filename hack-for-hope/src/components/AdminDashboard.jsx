import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usersAPI } from '../services/api'

function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll()
      const usersData = response.data?.data?.users || response.data?.users || []
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (error) {
      console.error('Erreur:', error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = () => {
    setEditingUser(null)
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowModal(true)
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return
    try {
      await usersAPI.delete(userId)
      fetchUsers()
    } catch (error) {
      alert('Erreur')
    }
  }

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Nouveau mot de passe (min 6 caractères):')
    if (!newPassword || newPassword.length < 6) {
      alert('Mot de passe invalide')
      return
    }
    try {
      await usersAPI.resetPassword(userId, { password: newPassword })
      alert('Mot de passe réinitialisé !')
    } catch (error) {
      alert('Erreur')
    }
  }

  const getRoleLabel = (role) => {
    const labels = {
      'admin': 'Administrateur',
      'mere': 'Mère SOS',
      'tante': 'Tante SOS',
      'educateur': 'Éducateur',
      'psychologue': 'Psychologue',
      'decideur1': 'Décideur 1',
      'decideur2': 'Décideur 2'
    }
    return labels[role] || role
  }

  if (loading) {
    return <div style={{padding: '2rem'}}>Chargement...</div>
  }

  return (
    <div style={{padding: '2rem'}}>
      <div style={{marginBottom: '2rem'}}>
        <h1>Espace Administrateur</h1>
        <p>Gestion des utilisateurs</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem'}}>
        <div style={{background: '#f0f9ff', padding: '1rem', borderRadius: '8px'}}>
          <h3>{users.length}</h3>
          <p>Total utilisateurs</p>
        </div>
        <div style={{background: '#f0fdf4', padding: '1rem', borderRadius: '8px'}}>
          <h3>{users.filter(u => u.isActive).length}</h3>
          <p>Actifs</p>
        </div>
        <div style={{background: '#fef3c7', padding: '1rem', borderRadius: '8px'}}>
          <h3>{users.filter(u => u.role === 'psychologue').length}</h3>
          <p>Psychologues</p>
        </div>
        <div style={{background: '#fee2e2', padding: '1rem', borderRadius: '8px'}}>
          <h3>{users.filter(u => ['mere', 'tante', 'educateur'].includes(u.role)).length}</h3>
          <p>Déclarants</p>
        </div>
      </div>

      <div style={{background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
          <h2>Liste des utilisateurs</h2>
          <button 
            onClick={handleCreateUser}
            style={{padding: '0.5rem 1rem', background: '#00abec', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            + Nouvel Utilisateur
          </button>
        </div>

        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '2px solid #e5e7eb'}}>
                <th style={{textAlign: 'left', padding: '0.75rem'}}>Utilisateur</th>
                <th style={{textAlign: 'left', padding: '0.75rem'}}>Rôle</th>
                <th style={{textAlign: 'left', padding: '0.75rem'}}>Village</th>
                <th style={{textAlign: 'left', padding: '0.75rem'}}>Statut</th>
                <th style={{textAlign: 'left', padding: '0.75rem'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id || user._id} style={{borderBottom: '1px solid #e5e7eb'}}>
                  <td style={{padding: '0.75rem'}}>
                    <strong>@{user.username}</strong>
                    <br/>
                    <small>{user.firstName} {user.lastName}</small>
                  </td>
                  <td style={{padding: '0.75rem'}}>{getRoleLabel(user.role)}</td>
                  <td style={{padding: '0.75rem'}}>{user.village || '-'}</td>
                  <td style={{padding: '0.75rem'}}>
                    <span style={{
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      background: user.isActive ? '#dcfce7' : '#fee2e2',
                      color: user.isActive ? '#166534' : '#991b1b'
                    }}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td style={{padding: '0.75rem'}}>
                    <button onClick={() => handleEditUser(user)} style={{marginRight: '0.5rem'}}>✏️</button>
                    <button onClick={() => handleResetPassword(user.id || user._id)} style={{marginRight: '0.5rem'}}>🔒</button>
                    <button onClick={() => handleDeleteUser(user.id || user._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <UserModal 
          user={editingUser} 
          onClose={() => setShowModal(false)}
          onSave={fetchUsers}
        />
      )}
    </div>
  )
}

function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'mere',
    village: 'gammarth',
    isActive: true,
    ...(user || {})
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (user) {
        await usersAPI.update(user.id || user._id, formData)
      } else {
        await usersAPI.create(formData)
      }
      onSave()
      onClose()
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const roles = [
    { value: 'mere', label: 'Mère SOS' },
    { value: 'tante', label: 'Tante SOS' },
    { value: 'educateur', label: 'Éducateur' },
    { value: 'psychologue', label: 'Psychologue' },
    { value: 'decideur1', label: 'Décideur 1' },
    { value: 'decideur2', label: 'Décideur 2' },
    { value: 'admin', label: 'Administrateur' }
  ]

  const villages = [
    { value: 'gammarth', label: 'Gammarth' },
    { value: 'siliana', label: 'Siliana' },
    { value: 'mahres', label: 'Mahrès' },
    { value: 'akouda', label: 'Akouda' }
  ]

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{background: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '500px'}} onClick={(e) => e.stopPropagation()}>
        <h2>{user ? 'Modifier Utilisateur' : 'Nouvel Utilisateur'}</h2>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem'}}>
          <input 
            type="text" 
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
            disabled={!!user}
            style={{padding: '0.5rem'}}
          />
          <input 
            type="text" 
            placeholder="Prénom"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            required
            style={{padding: '0.5rem'}}
          />
          <input 
            type="text" 
            placeholder="Nom"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            required
            style={{padding: '0.5rem'}}
          />
          <input 
            type="email" 
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{padding: '0.5rem'}}
          />
          <input 
            type="password" 
            placeholder={user ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required={!user}
            style={{padding: '0.5rem'}}
          />
          <select 
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={{padding: '0.5rem'}}
          >
            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select 
            value={formData.village}
            onChange={(e) => setFormData({...formData, village: e.target.value})}
            style={{padding: '0.5rem'}}
          >
            {villages.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
          <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
            <button type="button" onClick={onClose} style={{flex: 1, padding: '0.5rem'}}>Annuler</button>
            <button type="submit" disabled={saving} style={{flex: 1, padding: '0.5rem', background: '#00abec', color: 'white', border: 'none'}}>
              {saving ? 'Sauvegarde...' : (user ? 'Modifier' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminDashboard
