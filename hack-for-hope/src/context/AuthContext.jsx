import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      console.log('Login response:', response.data)
      
      // Handle different response structures
      let token, user
      if (response.data.data && response.data.data.token) {
        // Structure: { status, message, data: { token, user } }
        token = response.data.data.token
        user = response.data.data.user
      } else if (response.data.token) {
        // Structure: { token, user }
        token = response.data.token
        user = response.data.user
      } else {
        throw new Error('Format de réponse invalide')
      }
      
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setUser(user)
      return { success: true, user }
    } catch (error) {
      console.error('Login error details:', error)
      return { success: false, error: error.response?.data?.message || error.message || 'Erreur de connexion' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
