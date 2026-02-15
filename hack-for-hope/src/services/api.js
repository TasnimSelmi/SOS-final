import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data)
}

// Users API (Admin only)
export const usersAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, data) => api.post(`/users/${id}/reset-password`, data),
  getRoles: () => api.get('/users/roles/list'),
  getPsychologuesByVillage: (village) => api.get(`/users/psychologues/${village}`)
}

// Reports API
export const reportsAPI = {
  getAll: (params = {}) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => {
    const formData = new FormData()
    
    // Append text data
    Object.keys(data).forEach(key => {
      if (key !== 'attachments') {
        formData.append(key, data[key])
      }
    })
    
    // Append files
    if (data.attachments) {
      data.attachments.forEach(file => {
        formData.append('attachments', file)
      })
    }
    
    return api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  classify: (id, data) => api.put(`/reports/${id}/classify`, data),
  assign: (id, userId) => api.put(`/reports/${id}/assign`, { userId }),
  makeDecision: (id, data) => api.put(`/reports/${id}/decision`, data)
}

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`)
}

// Upload API
export const uploadAPI = {
  upload: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default api
