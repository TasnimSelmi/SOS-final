import React from 'react'
import './SOSChart.css'

// SOS Charts - Following brand visual guidelines
// Vertical bar charts with brand colors

export function SOSBarChart({ 
  data = [], 
  title,
  subtitle,
  maxValue,
  showValues = true,
  barColors = ['#1c325d', '#00abec'] // Dark blue, Primary blue
}) {
  const calculatedMax = maxValue || Math.max(...data.map(d => Math.max(d.value1 || 0, d.value2 || 0))) * 1.1
  
  return (
    <div className="sos-chart-container">
      {(title || subtitle) && (
        <div className="sos-chart-header">
          {title && <h3 className="sos-chart-title">{title}</h3>}
          {subtitle && <p className="sos-chart-subtitle">{subtitle}</p>}
        </div>
      )}
      
      <div className="sos-bar-chart">
        {data.map((item, index) => (
          <div key={index} className="sos-bar-group">
            <div className="sos-bars">
              {/* First bar (dark blue) */}
              {item.value1 !== undefined && (
                <div 
                  className="sos-bar sos-bar-primary"
                  style={{ 
                    height: `${(item.value1 / calculatedMax) * 100}%`,
                    background: barColors[0]
                  }}
                >
                  {showValues && (
                    <span className="sos-bar-value">{item.value1}%</span>
                  )}
                </div>
              )}
              
              {/* Second bar (light blue) */}
              {item.value2 !== undefined && (
                <div 
                  className="sos-bar sos-bar-secondary"
                  style={{ 
                    height: `${(item.value2 / calculatedMax) * 100}%`,
                    background: barColors[1]
                  }}
                >
                  {showValues && (
                    <span className="sos-bar-value">{item.value2}%</span>
                  )}
                </div>
              )}
            </div>
            <div className="sos-bar-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple progress ring/chart (like the 90% example)
export function SOSProgressRing({ 
  value, 
  size = 80, 
  strokeWidth = 8,
  color = '#00abec'
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference
  
  return (
    <div className="sos-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="sos-progress-ring-bg"
          stroke="#e8f7fc"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="sos-progress-ring-fill"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div className="sos-progress-ring-text">
        <span className="sos-progress-ring-value">{value}%</span>
      </div>
    </div>
  )
}

// Horizontal stat bar
export function SOSStatBar({ 
  label, 
  value, 
  max = 100,
  color = '#00abec'
}) {
  return (
    <div className="sos-stat-bar">
      <div className="sos-stat-bar-header">
        <span className="sos-stat-bar-label">{label}</span>
        <span className="sos-stat-bar-value">{value}%</span>
      </div>
      <div className="sos-stat-bar-track">
        <div 
          className="sos-stat-bar-fill"
          style={{ width: `${(value / max) * 100}%`, background: color }}
        />
      </div>
    </div>
  )
}

// Mini stat cards row
export function SOSStatRow({ stats = [] }) {
  return (
    <div className="sos-stat-row">
      {stats.map((stat, index) => (
        <div key={index} className="sos-stat-row-item">
          <div className="sos-stat-row-value" style={{ color: stat.color || '#00abec' }}>
            {stat.value}
          </div>
          <div className="sos-stat-row-label">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

// ========================================
// LOLIPOP CHART - Vertical lines with circles
// ========================================
export function SOSLollipopChart({ 
  data = [], 
  maxValue = 100,
  lineColor = '#1c325d',
  circleColors = ['#1c325d', '#00abec', '#00abec']
}) {
  return (
    <div className="sos-lollipop-chart">
      <div className="sos-lollipop-y-axis">
        {[100, 80, 60, 40, 20, 0].map(val => (
          <div key={val} className="sos-lollipop-tick">
            <span>{val}%</span>
            <div className="sos-lollipop-gridline"></div>
          </div>
        ))}
      </div>
      
      <div className="sos-lollipop-bars">
        {data.map((item, index) => (
          <div key={index} className="sos-lollipop-group">
            <div className="sos-lollipop-line-container">
              <div 
                className="sos-lollipop-line"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  background: lineColor
                }}
              />
              <div 
                className="sos-lollipop-circle"
                style={{ 
                  bottom: `${(item.value / maxValue) * 100}%`,
                  background: circleColors[index % circleColors.length],
                  borderColor: lineColor
                }}
              />
            </div>
            <div className="sos-lollipop-label">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ========================================
// PICTOGRAM CHART - Using people icons
// ========================================
export function SOSPictogramChart({ 
  rows = [],
  totalIcons = 10,
  filledColor = '#00abec',
  emptyColor = '#e8f7fc'
}) {
  const PersonIcon = ({ filled }) => (
    <svg width="20" height="40" viewBox="0 0 20 40" fill={filled ? filledColor : emptyColor}>
      <circle cx="10" cy="6" r="5" />
      <path d="M5 14 L5 38 L8 38 L8 22 L12 22 L12 38 L15 38 L15 14 Q15 12 10 12 Q5 12 5 14" />
    </svg>
  )

  return (
    <div className="sos-pictogram-chart">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="sos-pictogram-row">
          <div className="sos-pictogram-icons">
            {Array.from({ length: totalIcons }).map((_, i) => (
              <PersonIcon key={i} filled={i < row.value} />
            ))}
          </div>
          <div className="sos-pictogram-label">{row.label}</div>
        </div>
      ))}
    </div>
  )
}

// ========================================
// DOT DENSITY CHART
// ========================================
export function SOSDotChart({ 
  data = [],
  maxDots = 100,
  dotColor = '#00abec',
  emptyDotColor = '#e8f7fc'
}) {
  return (
    <div className="sos-dot-chart">
      <div className="sos-dot-grid">
        {Array.from({ length: maxDots }).map((_, i) => {
          const isFilled = i < data[0]?.value || 0
          return (
            <div 
              key={i}
              className="sos-dot"
              style={{ background: isFilled ? dotColor : emptyDotColor }}
            />
          )
        })}
      </div>
      <div className="sos-dot-label">{data[0]?.label || 'Lorem ipsum'}</div>
    </div>
  )
}

// ========================================
// NUMBERED CARD - With J-shape style (1, 2, 3, 4)
// ========================================
export function SOSNumberedCard({ 
  number,
  title,
  description,
  color = '#00abec'
}) {
  return (
    <div className="sos-numbered-card" style={{ borderLeftColor: color }}>
      <div className="sos-numbered-card-number" style={{ background: color }}>
        {number}
      </div>
      <div className="sos-numbered-card-content">
        <h4 className="sos-numbered-card-title" style={{ color }}>{title}</h4>
        <p className="sos-numbered-card-description">{description}</p>
      </div>
    </div>
  )
}

// Numbered card list
export function SOSNumberedList({ items = [] }) {
  const colors = ['#00abec', '#4ECDC4', '#de5a6c', '#FFB347']
  
  return (
    <div className="sos-numbered-list">
      {items.map((item, index) => (
        <SOSNumberedCard
          key={index}
          number={index + 1}
          title={item.title}
          description={item.description}
          color={colors[index % colors.length]}
        />
      ))}
    </div>
  )
}

// ========================================
// PUBLICATION CARD - With curved corner
// ========================================
export function SOSPublicationCard({ 
  image,
  title,
  subtitle,
  badge,
  onClick
}) {
  return (
    <div className="sos-publication-card" onClick={onClick}>
      <div className="sos-publication-image">
        <img src={image} alt={title} />
        <div className="sos-publication-curve"></div>
      </div>
      <div className="sos-publication-content">
        {badge && <span className="sos-publication-badge">{badge}</span>}
        <h4 className="sos-publication-title">{title}</h4>
        {subtitle && <p className="sos-publication-subtitle">{subtitle}</p>}
      </div>
    </div>
  )
}

export default SOSBarChart
