import React, { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    avatar: null,
    location: null,
    village: '',
    role: '',
    phone: '',
    bio: ''
  })
  const [loading, setLoading] = useState(false)

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    const savedUser = localStorage.getItem('user')
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else if (savedUser) {
      const user = JSON.parse(savedUser)
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        username: user.username || '',
        role: user.role || '',
        village: user.village || ''
      }))
    }
  }, [])

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile.name) {
      localStorage.setItem('userProfile', JSON.stringify(profile))
    }
  }, [profile])

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const uploadAvatar = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('Aucun fichier sélectionné'))
        return
      }

      if (!file.type.startsWith('image/')) {
        reject(new Error('Veuillez sélectionner une image'))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('L\'image ne doit pas dépasser 5MB'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const avatarData = e.target.result
        updateProfile({ avatar: avatarData })
        resolve(avatarData)
      }
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'))
      reader.readAsDataURL(file)
    })
  }

  const deleteAvatar = () => {
    updateProfile({ avatar: null })
  }

  const updateLocation = (location) => {
    updateProfile({ location })
  }

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          }
          updateLocation(location)
          resolve(location)
        },
        (error) => {
          let message = 'Erreur de géolocalisation'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Accès à la localisation refusé'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Position non disponible'
              break
            case error.TIMEOUT:
              message = 'Délai dépassé'
              break
          }
          reject(new Error(message))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  const value = {
    profile,
    loading,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
    updateLocation,
    getCurrentLocation
  }

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
