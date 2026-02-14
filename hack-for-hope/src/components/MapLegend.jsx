import React from 'react'
import './MapLegend.css'

function MapLegend() {
  const legendItems = [
    { label: 'Villages SOS', color: '#00abec', type: 'village' },
    { label: 'Votre position', color: '#1c325d', type: 'user' },
    { label: 'Nouveau signalement', color: '#ffa726', type: 'nouveau' },
    { label: 'En cours', color: '#00abec', type: 'en-cours' },
    { label: 'Traité', color: '#4ecdc4', type: 'traite' },
    { label: 'Urgent', color: '#de5a6c', type: 'urgent' }
  ]

  return (
    <div className="map-legend">
      <h4>Légende</h4>
      {legendItems.map(item => (
        <div key={item.type} className="legend-item">
          <div 
            className="legend-dot" 
            style={{ backgroundColor: item.color }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}

export default MapLegend
