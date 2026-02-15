import React from 'react'

function SOSLogo({ size = 44 }) {
  return (
    <img 
      src="/sos-logo.png" 
      alt="SOS Logo" 
      width={size} 
      height={size}
      style={{ objectFit: 'contain' }}
    />
  )
}

export default SOSLogo
