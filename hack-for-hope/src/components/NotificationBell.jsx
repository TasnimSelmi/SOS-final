import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './NotificationBell.css'

function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Simulation de notifications temps réel
  useEffect(() => {
    // Charger les notifications depuis localStorage
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications)
      setNotifications(parsed)
      setUnreadCount(parsed.filter(n => !n.read).length)
    } else {
      // Notifications par défaut pour la démo
      const defaultNotifications = [
        {
          id: 1,
          type: 'report',
          title: 'Nouveau signalement',
          message: 'Un signalement a été créé dans votre village',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
          read: false,
          link: '/dashboard'
        },
        {
          id: 2,
          type: 'status',
          title: 'Statut mis à jour',
          message: 'Votre signalement #SIG-2024-001 a été traité',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
          read: false,
          link: '/dashboard'
        }
      ]
      setNotifications(defaultNotifications)
      setUnreadCount(2)
      localStorage.setItem('notifications', JSON.stringify(defaultNotifications))
    }

    // Simuler de nouvelles notifications toutes les 30 secondes
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'report' : 'system',
          title: 'Notification',
          message: 'Nouvelle activité détectée',
          timestamp: new Date().toISOString(),
          read: false,
          link: '/dashboard'
        }
        addNotification(newNotification)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const addNotification = (notification) => {
    setNotifications(prev => {
      const updated = [notification, ...prev].slice(0, 20) // Max 20 notifications
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      )
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }))
      localStorage.setItem('notifications', JSON.stringify(updated))
      return updated
    })
    setUnreadCount(0)
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return 'À l\'instant'
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
    return date.toLocaleDateString('fr-FR')
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'report':
        return (
          <div className="notif-icon report">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
        )
      case 'status':
        return (
          <div className="notif-icon status">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22,4 12,14.01 9,11.01"/>
            </svg>
          </div>
        )
      default:
        return (
          <div className="notif-icon system">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
        )
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="notification-bell" ref={menuRef}>
      <button 
        className="bell-trigger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg 
          className={`bell-icon ${unreadCount > 0 ? 'has-unread' : ''}`}
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {menuOpen && (
        <div className="notification-menu">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read" onClick={markAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map(notification => (
                <Link
                  key={notification.id}
                  to={notification.link}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="notification-content">
                    <p className="notification-title">{notification.title}</p>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">{formatTime(notification.timestamp)}</span>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </Link>
              ))
            )}
          </div>

          <div className="notification-footer">
            <Link to="/notifications" onClick={() => setMenuOpen(false)}>
              Voir toutes les notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
