import React, { useEffect, useRef, useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import './Map.css'

// SOS Villages coordinates in Tunisia
const villagesCoordinates = {
  gammarth: { lat: 36.9167, lng: 10.3000, name: 'Village Gammarth' },
  siliana: { lat: 36.0833, lng: 9.3667, name: 'Village Siliana' },
  mahres: { lat: 34.5167, lng: 10.5000, name: 'Village Mahrès' },
  akouda: { lat: 35.8667, lng: 10.5667, name: 'Village Akouda' }
}

function Map({ reports = [], onMarkerClick, height = '400px', showUserLocation = true }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const { profile } = useProfile()
  const [mapLoaded, setMapLoaded] = useState(false)

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if Leaflet is already loaded
    if (window.L) {
      setMapLoaded(true)
      return
    }

    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)

    // Load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => setMapLoaded(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(script)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.L) return

    // Tunisia center coordinates
    const tunisiaCenter = [34.0, 9.0]

    // Create map instance
    const map = window.L.map(mapRef.current).setView(tunisiaCenter, 6)
    mapInstanceRef.current = map

    // Add tile layer (OpenStreetMap)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map)

    // Add SOS villages markers
    Object.entries(villagesCoordinates).forEach(([id, coords]) => {
      const marker = window.L.marker([coords.lat, coords.lng], {
        icon: createSOSIcon(window.L, 'village')
      })
        .addTo(map)
        .bindPopup(`<b>${coords.name}</b><br>Centre SOS`)
      
      markersRef.current.push(marker)
    })

    // Add user location if available
    if (showUserLocation && profile.location) {
      const userMarker = window.L.marker([profile.location.lat, profile.location.lng], {
        icon: createSOSIcon(window.L, 'user')
      })
        .addTo(map)
        .bindPopup('<b>Votre position</b>')
      
      markersRef.current.push(userMarker)
      map.setView([profile.location.lat, profile.location.lng], 10)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [mapLoaded, profile.location, showUserLocation])

  // Update markers when reports change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return

    // Clear existing report markers
    markersRef.current.forEach(marker => {
      if (marker.reportId) {
        marker.remove()
      }
    })
    markersRef.current = markersRef.current.filter(m => !m.reportId)

    // Add new report markers
    reports.forEach(report => {
      if (report.location) {
        const marker = window.L.marker([report.location.lat, report.location.lng], {
          icon: createSOSIcon(window.L, getReportStatus(report.status))
        })
          .addTo(mapInstanceRef.current)
          .bindPopup(`
            <b>Signalement #${report.id}</b><br>
            Statut: ${report.status}<br>
            <small>${new Date(report.date).toLocaleDateString('fr-FR')}</small>
          `)
        
        marker.reportId = report.id
        
        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(report))
        }
        
        markersRef.current.push(marker)
      }
    })
  }, [reports, onMarkerClick])

  const createSOSIcon = (L, type) => {
    const colors = {
      village: '#00abec',
      user: '#1c325d',
      nouveau: '#ffa726',
      en_cours: '#00abec',
      traite: '#4ecdc4',
      urgent: '#de5a6c'
    }

    const color = colors[type] || colors.nouveau

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            ${type === 'village' 
              ? '<path d="M12 2L2 22h20L12 2zm0 3.5L18.5 20h-13L12 5.5z"/>'
              : type === 'user'
              ? '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>'
              : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
            }
          </svg>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }

  const getReportStatus = (status) => {
    switch (status) {
      case 'Nouveau': return 'nouveau'
      case 'En cours': return 'en_cours'
      case 'Traité': return 'traite'
      case 'Urgent': return 'urgent'
      default: return 'nouveau'
    }
  }

  return (
    <div className="map-container" style={{ height }}>
      <div ref={mapRef} className="map-element" />
      {!mapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Chargement de la carte...</p>
        </div>
      )}
    </div>
  )
}

export default Map
