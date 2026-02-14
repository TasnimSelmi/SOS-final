import React from 'react'
import { SOSIcons } from './SOSIcons'
import './ConfidentialBanner.css'

function ConfidentialBanner() {
  return (
    <div className="confidential-banner">
      <div className="confidential-content">
        <SOSIcons.Alert size={16} color="white" />
        <span className="confidential-text">
          CONFIDENTIEL - ACCÈS RESTREINT SOS VILLAGES D'ENFANTS
        </span>
        <span className="confidential-separator">|</span>
        <span className="confidential-subtext">
          Données sensibles - Protection de l'enfance
        </span>
      </div>
    </div>
  )
}

export default ConfidentialBanner
