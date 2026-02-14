import React from 'react'
import { SOSIcons } from './SOSIcons'
import { SOSProgressRing } from './SOSChart'
import './ReportCard.css'

function ReportCard({ 
  id, 
  title, 
  description, 
  status, 
  priority, 
  village, 
  date, 
  onViewDetails 
}) {
  const statusConfig = {
    'ATTENTE': { color: '#00abec', bg: 'rgba(0, 171, 236, 0.1)' },
    'EN COURS': { color: '#FFB347', bg: 'rgba(255, 179, 71, 0.1)' },
    'URGENT': { color: '#de5a6c', bg: 'rgba(222, 90, 108, 0.1)' },
    'RÉSOLU': { color: '#4ECDC4', bg: 'rgba(78, 205, 196, 0.1)' }
  }

  const config = statusConfig[status] || statusConfig['ATTENTE']

  return (
    <div className="report-card">
      <div className="report-card-header">
        <span className="report-id">{id}</span>
        <span 
          className="report-status" 
          style={{ 
            color: config.color, 
            background: config.bg 
          }}
        >
          {status}
        </span>
      </div>
      
      <h3 className="report-title">{title}</h3>
      <p className="report-description">{description}</p>
      
      <div className="report-meta">
        <div className="report-meta-item">
          <SOSIcons.Village size={14} />
          <span>{village}</span>
        </div>
        <div className="report-meta-item">
          <SOSIcons.Notification size={14} />
          <span>{date}</span>
        </div>
        {priority && (
          <div className="report-meta-item priority">
            <SOSIcons.Heart size={14} />
            <span>{priority}</span>
          </div>
        )}
      </div>
      
      <button className="report-view-btn" onClick={onViewDetails}>
        Voir détails
        <SOSIcons.Search size={14} />
      </button>
    </div>
  )
}

export default ReportCard
