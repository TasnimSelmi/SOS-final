import React from 'react'
import { SOSIcons } from './SOSIcons'
import './NotificationsPanel.css'

function NotificationsPanel() {
  const notifications = [
    {
      id: 1,
      type: 'alert',
      message: '2 nouveaux signalements critiques détectés',
      time: 'Il y a 5 min',
      icon: SOSIcons.Alert,
      color: '#de5a6c'
    },
    {
      id: 2,
      type: 'info',
      message: 'Signalement SIG-2024-001 enregistré avec succès',
      time: 'Il y a 15 min',
      icon: SOSIcons.Check,
      color: '#4ECDC4'
    },
    {
      id: 3,
      type: 'warning',
      message: 'Délai de traitement dépassé pour cas #2026-089',
      time: 'Il y a 1h',
      icon: SOSIcons.Notification,
      color: '#FFB347'
    }
  ]

  const auditTrail = [
    { id: 1, action: 'Connexion', user: 'M. Ben Youssel', time: '17/02/2026 12:17' },
    { id: 2, action: 'Mise à jour', user: 'M. Ben Youssel', time: '17/02/2026 12:23' },
    { id: 3, action: 'Consultation', user: 'MCD', time: '17/02/2026 12:28' }
  ]

  return (
    <div className="notifications-panel">
      {/* Notifications */}
      <div className="panel-section">
        <h4 className="panel-title">
          <SOSIcons.Notification size={16} />
          Notifications
        </h4>
        <div className="notifications-list">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`notification-item ${notif.type}`}
              style={{ borderLeftColor: notif.color }}
            >
              <div className="notification-icon" style={{ color: notif.color }}>
                <notif.icon size={18} />
              </div>
              <div className="notification-content">
                <p className="notification-message">{notif.message}</p>
                <span className="notification-time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="panel-section">
        <h4 className="panel-title">
          <SOSIcons.Document size={16} />
          Audit Trail
        </h4>
        <div className="audit-list">
          {auditTrail.map((audit) => (
            <div key={audit.id} className="audit-item">
              <div className="audit-dot"></div>
              <div className="audit-content">
                <span className="audit-action">{audit.action}</span>
                <span className="audit-user">{audit.user}</span>
                <span className="audit-time">{audit.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPanel
