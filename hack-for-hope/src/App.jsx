import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'
import Navigation from './components/Navigation'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ProfileSettings from './pages/ProfileSettings'
// New pages
import ReportCreate from './pages/ReportCreate'
import ReportsList from './pages/ReportsList'
import ReportDetail from './pages/ReportDetail'
import AdminUsers from './pages/AdminUsers'
import ReportClassify from './pages/ReportClassify'
import ReportDecision from './pages/ReportDecision'
import './App.css'

// Layout pour les pages publiques avec navigation
function PublicLayout({ children, user, onLogout }) {
  return (
    <>
      <Navigation user={user} onLogout={onLogout} />
      {children}
    </>
  )
}

// Layout pour les pages privées (dashboard)
function PrivateLayout({ children, user, onLogout }) {
  return (
    <>
      <Navigation user={user} onLogout={onLogout} />
      {children}
    </>
  )
}

function AppContent() {
  const { user, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Routes>
        {/* Pages publiques */}
        <Route 
          path="/" 
          element={
            <PublicLayout user={user} onLogout={logout}>
              <LandingPage onEnterApp={() => window.location.href = '/login'} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PublicLayout user={user} onLogout={logout}>
              <AboutPage />
            </PublicLayout>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <PublicLayout user={user} onLogout={logout}>
              <ContactPage />
            </PublicLayout>
          } 
        />
        
        {/* Signup page */}
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        
        {/* Login page */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        
        {/* Pages privées */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <Dashboard user={user} onLogout={logout} />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Profile Settings - Private */}
        <Route 
          path="/profile" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <ProfileSettings />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Reports Routes - Private */}
        <Route 
          path="/reports" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <ReportsList />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/reports/create" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <ReportCreate />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/reports/:id" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <ReportDetail />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/reports/:id/classify" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <ReportClassify />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        <Route 
          path="/reports/:id/decision" 
          element={
            user ? (
              <PrivateLayout user={user} onLogout={logout}>
                <ReportDecision />
              </PrivateLayout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />
        
        {/* Admin Routes - Private (Admin only) */}
        <Route 
          path="/admin/users" 
          element={
            user?.role === 'admin' ? (
              <PrivateLayout user={user} onLogout={logout}>
                <AdminUsers />
              </PrivateLayout>
            ) : (
              <Navigate to="/dashboard" />
            )
          } 
        />
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <AppContent />
        </ProfileProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
