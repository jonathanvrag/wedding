/**
 * MapSection - Sección de ubicación con mapa interactivo
 * Muestra ceremonia y recepción en un mapa Leaflet
 */
import { useEffect, useRef, useState } from 'react'
import { Section } from '../ui/Section'
import { WeddingMap } from '../WeddingMap'
import { MapPin, Church, UtensilsCrossed } from 'lucide-react'

function parseCoords(coordStr) {
  if (!coordStr) return null
  const parts = coordStr.split(',').map(Number)
  if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return null
  return parts
}

export function MapSection({
  lugarCeremonia = 'Sede San Patricio',
  direccionCeremonia = 'Bogotá, Colombia',
  coordCeremonia,
  lugarRecepcion = 'Sede San Patricio',
  direccionRecepcion = 'Bogotá, Colombia',
  coordRecepcion,
}) {
  const mapRef = useRef(null)
  const [activeMarker, setActiveMarker] = useState(null)

  const ceremonyCoords = parseCoords(coordCeremonia)
  const receptionCoords = parseCoords(coordRecepcion)

  const ceremony = ceremonyCoords
    ? { coords: ceremonyCoords, name: lugarCeremonia, address: direccionCeremonia }
    : null

  const reception = receptionCoords
    ? { coords: receptionCoords, name: lugarRecepcion, address: direccionRecepcion }
    : null

  return (
    <Section id='ubicacion'>
      <div className='max-w-5xl mx-auto text-center'>
        <h2 className='text-4xl md:text-5xl font-serif text-primary mb-6 italic'>
          Cómo Llegar
        </h2>
        <p className='text-secondary text-lg mb-16 max-w-xl mx-auto font-light leading-relaxed'>
          Toca los marcadores en el mapa para ver detalles y obtener indicaciones
        </p>

        {/* Map */}
        <div className='w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden editorial-shadow mb-12'>
          {(ceremony || reception) ? (
            <WeddingMap
              ceremony={ceremony}
              reception={reception}
              className='w-full h-full'
            />
          ) : (
            <div className='w-full h-full bg-surface-container-low flex items-center justify-center'>
              <div className='text-center'>
                <MapPin className='text-primary/40 mx-auto mb-4 w-12 h-12' />
                <p className='text-secondary/60'>Ubicaciones no disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Info cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto'>
          <div className='p-6 bg-surface-container-low rounded-xl editorial-shadow text-left'>
            <div className='flex items-start space-x-4'>
              <div className='p-3 rounded-full bg-primary/10 shrink-0'>
                <Church className='text-primary w-5 h-5' />
              </div>
              <div>
                <h3 className='font-serif text-lg text-primary mb-1'>La Ceremonia</h3>
                <p className='text-sm text-secondary font-medium'>{lugarCeremonia}</p>
                <p className='text-xs text-tertiary mt-1'>{direccionCeremonia}</p>
                {/* {ceremonyCoords && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${ceremonyCoords[0]},${ceremonyCoords[1]}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block mt-3 text-xs text-primary font-bold tracking-wider uppercase hover:underline'
                  >
                    Obtener indicaciones →
                  </a>
                )} */}
              </div>
            </div>
          </div>

          <div className='p-6 bg-surface-container-low rounded-xl editorial-shadow text-left'>
            <div className='flex items-start space-x-4'>
              <div className='p-3 rounded-full bg-primary/10 shrink-0'>
                <UtensilsCrossed className='text-primary w-5 h-5' />
              </div>
              <div>
                <h3 className='font-serif text-lg text-primary mb-1'>La Fiesta</h3>
                <p className='text-sm text-secondary font-medium'>{lugarRecepcion}</p>
                <p className='text-xs text-tertiary mt-1'>{direccionRecepcion}</p>
                {receptionCoords && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${receptionCoords[0]},${receptionCoords[1]}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-block mt-3 text-xs text-primary font-bold tracking-wider uppercase hover:underline'
                  >
                    Obtener indicaciones →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
