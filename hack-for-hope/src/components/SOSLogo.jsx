import React from 'react'

function SOSLogo({ size = 44 }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
      <rect x="10" y="10" width="80" height="80" rx="18" fill="#4A6FA5"/>
      <circle cx="32" cy="30" r="7" fill="white"/>
      <path d="M25 40 L25 60 L30 60 L30 46 L35 46 L35 60 L40 60 L40 40 Q40 38 32.5 38 Q25 38 25 40" fill="white"/>
      <line x1="25" y1="44" x2="18" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="40" y1="44" x2="47" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="28" y1="60" x2="24" y2="74" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="37" y1="60" x2="41" y2="74" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="68" cy="30" r="7" fill="white"/>
      <path d="M60 40 L60 60 L65 60 L65 46 L70 46 L70 60 L75 60 L75 40 Q75 38 67.5 38 Q60 38 60 40" fill="white"/>
      <line x1="60" y1="44" x2="53" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="75" y1="44" x2="82" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="63" y1="60" x2="59" y2="74" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="72" y1="60" x2="76" y2="74" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="50" cy="34" rx="4" ry="9" fill="white"/>
      <line x1="50" y1="42" x2="50" y2="65" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="43" cy="50" rx="3" ry="7" fill="white" transform="rotate(-30 43 50)"/>
      <ellipse cx="57" cy="50" rx="3" ry="7" fill="white" transform="rotate(30 57 50)"/>
      <line x1="18" y1="76" x2="82" y2="76" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

export default SOSLogo
