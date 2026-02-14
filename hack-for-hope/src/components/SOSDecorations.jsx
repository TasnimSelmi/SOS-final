import React from 'react'
import './SOSDecorations.css'

// ========================================
// J-SHAPE DECORATION
// ========================================
export function SOSJShape({ 
  variant = 'large', // large, medium, small, tiny
  color = '#00abec',
  position = 'right',
  className = ''
}) {
  const sizes = {
    large: { width: 180, height: 320 },
    medium: { width: 140, height: 240 },
    small: { width: 80, height: 140 },
    tiny: { width: 60, height: 100 }
  }
  
  const { width, height } = sizes[variant]
  
  return (
    <div 
      className={`sos-j-shape sos-j-shape-${position} ${className}`}
      style={{ 
        width, 
        height,
        background: color
      }}
    />
  )
}

// ========================================
// THREE LINES DECORATION
// ========================================
export function SOSThreeLines({
  color = '#00abec',
  position = 'left'
}) {
  return (
    <div className={`sos-three-lines sos-three-lines-${position}`}>
      <div className="sos-line sos-line-long" style={{ background: color }}></div>
      <div className="sos-line sos-line-medium" style={{ background: color }}></div>
      <div className="sos-line sos-line-short" style={{ background: color }}></div>
    </div>
  )
}

// Alternative: Horizontal three lines
export function SOSThreeLinesHorizontal({
  color = '#00abec',
  position = 'top'
}) {
  return (
    <div className={`sos-three-lines-horizontal sos-three-lines-${position}`}>
      <div className="sos-line-h sos-line-h-long" style={{ background: color }}></div>
      <div className="sos-line-h sos-line-h-medium" style={{ background: color }}></div>
      <div className="sos-line-h sos-line-h-short" style={{ background: color }}></div>
    </div>
  )
}

// ========================================
// SPEECH BUBBLE DECORATION
// ========================================
export function SOSSpeechBubble({
  size = 'large',
  color = '#00abec',
  position = 'top-right',
  opacity = 0.06
}) {
  const sizes = {
    large: { width: 350, height: 300 },
    medium: { width: 250, height: 220 },
    small: { width: 180, height: 160 }
  }
  
  const { width, height } = sizes[size]
  
  return (
    <div 
      className={`sos-speech-bubble sos-speech-bubble-${position}`}
      style={{ 
        width, 
        height,
        background: color,
        opacity
      }}
    />
  )
}

// ========================================
// COMBINED DECORATIONS
// ========================================
export function SOSDecorations({ showJ = true, showLines = true, showBubble = true }) {
  return (
    <div className="sos-decorations">
      {showBubble && (
        <>
          <SOSSpeechBubble size="large" position="top-right" color="#00abec" />
          <SOSSpeechBubble size="small" position="bottom-left" color="#de5a6c" opacity={0.04} />
        </>
      )}
      {showJ && <SOSJShape variant="large" position="right" />}
      {showLines && <SOSThreeLines position="left" />}
    </div>
  )
}

export default SOSDecorations
