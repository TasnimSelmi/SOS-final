import React from 'react'
import './SOSCard.css'

// SOS Card Component - Following brand guidelines
// Rounded corners, shadows, bubble design cues
// Should NEVER be used on top of photos

export function SOSCard({ 
  children, 
  variant = 'default', // default, info, urgent, success
  title,
  subtitle,
  className = ''
}) {
  return (
    <div className={`sos-card sos-card-${variant} ${className}`}>
      {(title || subtitle) && (
        <div className="sos-card-header">
          {title && <h3 className="sos-card-title">{title}</h3>}
          {subtitle && <p className="sos-card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="sos-card-content">
        {children}
      </div>
    </div>
  )
}

// Data Card - For infographics and statistics
export function SOSDataCard({
  label,
  value,
  unit = '',
  variant = 'default',
  icon: Icon
}) {
  return (
    <div className={`sos-data-card sos-data-card-${variant}`}>
      {Icon && (
        <div className="sos-data-card-icon">
          <Icon size={32} />
        </div>
      )}
      <div className="sos-data-card-content">
        <div className="sos-data-card-value">
          {value}
          {unit && <span className="sos-data-card-unit">{unit}</span>}
        </div>
        <div className="sos-data-card-label">{label}</div>
      </div>
    </div>
  )
}

// Info Card - With colored header bar
export function SOSInfoCard({
  title,
  items = [], // Array of { label, value }
  color = '#00abec'
}) {
  return (
    <div className="sos-info-card">
      <div className="sos-info-card-header" style={{ background: color }}>
        <span>{title}</span>
      </div>
      <div className="sos-info-card-body">
        {items.map((item, index) => (
          <div key={index} className="sos-info-card-item">
            <span className="sos-info-card-item-label">{item.label}</span>
            <span className="sos-info-card-item-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Stat Card - Highlighted numbers
export function SOSStatCard({
  number,
  label,
  description,
  variant = 'default'
}) {
  return (
    <div className={`sos-stat-card sos-stat-card-${variant}`}>
      <div className="sos-stat-card-number">{number}</div>
      <div className="sos-stat-card-label">{label}</div>
      {description && (
        <div className="sos-stat-card-description">{description}</div>
      )}
    </div>
  )
}

export default SOSCard
