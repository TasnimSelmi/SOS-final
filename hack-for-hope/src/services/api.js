import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

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
}

// Reports API
export const reportsAPI = {
  getAll: () => api.get('/reports'),
  create: (data) => api.post('/reports', data),
  classify: (id, data) => api.put(`/reports/${id}/classify`, data),
  updateStatus: (id, status) => api.put(`/reports/${id}/status`, { statut: status })
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
