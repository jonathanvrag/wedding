/**
 * WeddingMap - Interactive map using Leaflet + OpenStreetMap
 * Shows ceremony and reception locations with custom markers
 */
import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

/**
 * Creates a custom marker divIcon using inline SVG.
 * This avoids the default Leaflet marker icon issues with webpack/vite.
 */
function createMarkerIcon(type) {
  const isChurch = type === 'church'
  const color = isChurch ? '#8B6F47' : '#B8860B'
  const icon = isChurch
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V8.25L12 4L6 8.25V20H18Z"/><path d="M12 4V2"/><path d="M8 14h8"/><path d="M12 10v8"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>'

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 44px; height: 44px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    ">${icon}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  })
}

/**
 * Auto-fits the map bounds to show all markers,
 * then zooms in if all markers are close together.
 */
function FitBounds({ markers }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length === 0) return
    const bounds = L.latLngBounds(markers.map(m => m.coords))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 })
  }, [map, markers])

  return null
}

/**
 * Recenter button that re-fits the map to all markers
 */
function RecenterControl({ markers }) {
  const map = useMap()

  const handleRecenter = () => {
    if (markers.length === 0) return
    const bounds = L.latLngBounds(markers.map(m => m.coords))
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 })
  }

  return (
    <div className='absolute top-4 right-4 z-[1000]'>
      <button
        onClick={handleRecenter}
        className='bg-white w-10 h-10 rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'
        title='Centrar mapa'
      >
        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#5b6143' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <circle cx='12' cy='12' r='3'/>
          <path d='M12 2v4'/>
          <path d='M12 18v4'/>
          <path d='M2 12h4'/>
          <path d='M18 12h4'/>
        </svg>
      </button>
    </div>
  )
}

/**
 * WeddingMap - renders an interactive Leaflet map
 *
 * Props:
 *   ceremony:  { coords: [lat, lng], name, address }
 *   reception: { coords: [lat, lng], name, address }
 *   className: optional extra classes
 */
export function WeddingMap({ ceremony, reception, className = '' }) {
  const markers = [ceremony, reception].filter(Boolean)

  // Default center: Medellín
  const defaultCenter = [6.247, -75.57]
  const defaultZoom = 13

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className='w-full h-full rounded-xl z-0'
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <FitBounds markers={markers} />
        <RecenterControl markers={markers} />

        {ceremony && (
          <Marker
            position={ceremony.coords}
            icon={createMarkerIcon('church')}
          >
            <Popup>
              <div className='font-sans min-w-[180px]'>
                <p className='font-bold text-sm mb-1'>La Ceremonia</p>
                <p className='text-xs text-gray-600'>{ceremony.name}</p>
                <p className='text-xs text-gray-500'>{ceremony.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${ceremony.coords[0]},${ceremony.coords[1]}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block mt-2 text-xs text-blue-600 hover:underline'
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        )}

        {reception && (
          <Marker
            position={reception.coords}
            icon={createMarkerIcon('reception')}
          >
            <Popup>
              <div className='font-sans min-w-[180px]'>
                <p className='font-bold text-sm mb-1'>La Fiesta</p>
                <p className='text-xs text-gray-600'>{reception.name}</p>
                <p className='text-xs text-gray-500'>{reception.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${reception.coords[0]},${reception.coords[1]}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='block mt-2 text-xs text-blue-600 hover:underline'
                >
                  Abrir en Google Maps →
                </a>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
