/**
 * AccommodationSection - Carrusel de hoteles
 * Usa animación CSS para scroll infinito con duplicación
 */
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Building2 } from 'lucide-react'

const DEFAULT_HOTELS = [
  { name: 'Hotel El Mirador', dist: 'A 5 min del lugar', desc: 'Un espacio boutique con vistas increíble.', imagen: '', url: '' },
  { name: 'Villa Serena', dist: 'A 10 min del lugar', desc: 'Encanto rústico y jardines privados.', imagen: '', url: '' },
  { name: 'Grand Plaza Suites', dist: 'A 15 min del lugar', desc: 'Opción moderna en el centro histórico.', imagen: '', url: '' },
]

function HotelCard({ hotel, isDuplicate = false }) {
  return (
    <Card
      key={isDuplicate ? `${hotel.name}-dup` : hotel.name}
      className='flex-shrink-0 w-[300px] md:w-[320px] overflow-hidden group'
    >
      <div className='h-48 md:h-56 overflow-hidden rounded-lg bg-surface-container mb-6'>
        {hotel.imagen ? (
          <img
            src={hotel.imagen}
            alt={hotel.name}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        ) : (
          <div className='w-full h-full bg-primary/5 flex items-center justify-center'>
            <Building2 className='text-primary/30 w-12 h-12' />
          </div>
        )}
      </div>
      <h4 className='text-2xl font-serif text-primary mb-3'>{hotel.name}</h4>
      <p className='text-xs text-tertiary mb-4 uppercase tracking-widest'>
        {hotel.dist}
      </p>
      <p className='text-base text-secondary mb-6 leading-relaxed font-light line-clamp-2'>
        {hotel.desc}
      </p>
      {hotel.url ? (
        <a
          href={hotel.url}
          target='_blank'
          rel='noopener noreferrer'
          className='block text-center py-4 border border-primary/10 rounded-full text-xs uppercase tracking-widest font-bold text-primary hover:bg-primary hover:text-surface transition-all duration-300'
        >
          Ver alojamiento
        </a>
      ) : (
        <span className='block text-center py-4 border border-primary/5 rounded-full text-xs uppercase tracking-widest font-bold text-tertiary/50'>
          Ver alojamiento
        </span>
      )}
    </Card>
  )
}

export function AccommodationSection({ hoteles }) {
  let hotels = DEFAULT_HOTELS

  if (hoteles && hoteles.trim()) {
    try {
      const parsed = JSON.parse(hoteles)
      if (Array.isArray(parsed) && parsed.length > 0) {
        hotels = parsed
      }
    } catch (e) {
      hotels = DEFAULT_HOTELS
    }
  }

  // Only use animation if we have hotels
  if (!hotels || hotels.length === 0) {
    hotels = DEFAULT_HOTELS
  }

  return (
    <Section id='alojamiento'>
      <div className='text-center mb-20'>
        <h2 className='text-4xl md:text-5xl font-serif text-primary italic mb-6'>
          Alojamiento
        </h2>
        <p className='text-lg text-tertiary font-light max-w-md mx-auto'>
          Hemos seleccionado estos hoteles cercanos para vuestra comodidad.
        </p>
      </div>

      {/* Auto-scrolling Carousel */}
      <div className='relative overflow-hidden'>
        {/* Gradient masks */}
        <div className='absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none' />
        <div className='absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none' />

        <div className='overflow-hidden'>
          <div className='flex animate-scroll gap-8 w-max'>
            {/* First set */}
            {hotels.map((hotel, i) => (
              <HotelCard key={`hotel-1-${i}`} hotel={hotel} />
            ))}
            {/* Duplicate for seamless loop */}
            {hotels.map((hotel, i) => (
              <HotelCard key={`hotel-2-${i}`} hotel={hotel} isDuplicate />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
