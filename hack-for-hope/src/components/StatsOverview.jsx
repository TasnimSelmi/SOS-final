import React from 'react'
import { SOSIcons } from './SOSIcons'
import { SOSProgressRing, SOSBarChart } from './SOSChart'
import './StatsOverview.css'

function StatsOverview() {
  const villageData = [
    { label: 'Gammarth', value1: 12, value2: 8 },
    { label: 'Siliana', value1: 8, value2: 5 },
    { label: 'Mahrès', value1: 6, value2: 4 },
    { label: 'Akouda', value1: 10, value2: 7 }
  ]

  return (
    <div className="stats-overview">
      {/* Global Resolution Rate */}
      <div className="stat-card-large">
        <div className="stat-card-header">
          <h3>TAUX DE RÉSOLUTION GLOBAL</h3>
        </div>
        <div className="stat-card-body center">
          <SOSProgressRing value={75} size={120} strokeWidth={10} />
          <div className="stat-legend">
            <div className="legend-item">
              <span className="legend-dot resolved"></span>
              <span>Incidents résolus</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot ongoing"></span>
              <span>Incidents en cours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Incidents by Village */}
      <div className="stat-card-large">
        <div className="stat-card-header">
          <h3>Incidents par Village</h3>
        </div>
        <div className="stat-card-body">
          <SOSBarChart 
            data={villageData}
            barColors={['#1c325d', '#00abec']}
            showValues={true}
            height={200}
          />
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-bar dark"></span>
              <span>Incidents résolus</span>
            </div>
            <div className="legend-item">
              <span className="legend-bar light"></span>
              <span>Incidents en cours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview
