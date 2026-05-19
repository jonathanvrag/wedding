/**
 * MapSection - Sección de ubicación con mapa visual
 * Muestra la ubicación de la ceremonia con gradientes
 */
import { Section } from '../ui/Section'
import { MapPin, Church, UtensilsCrossed } from 'lucide-react'

export function MapSection({
  lugarCeremonia = 'Sede San Patricio',
  direccionCeremonia = 'Bogotá, Colombia',
}) {
  return (
    <Section id='ubicacion' className='bg-surface-container'>
      <div className='max-w-5xl mx-auto text-center'>
        <h2 className='text-4xl md:text-5xl font-serif text-primary mb-16 italic'>
          Cómo Llegar
        </h2>
        <div className='relative w-full h-[500px] rounded-2xl overflow-hidden editorial-shadow mb-16 bg-surface-container-low'>
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='bg-surface/90 p-12 rounded-xl backdrop-blur-sm editorial-shadow text-center max-w-sm'>
              <MapPin className='text-primary mx-auto mb-6 w-12 h-12 stroke-[1px]' />
              <p className='font-serif italic text-2xl text-secondary'>
                {lugarCeremonia}, {direccionCeremonia}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-col md:flex-row justify-center gap-6'>
          <a
            href='#'
            className='flex items-center justify-center space-x-4 px-12 py-6 bg-surface-container-lowest rounded-full hover:bg-primary/5 transition-all duration-300 editorial-shadow'
          >
            <Church className='text-primary w-6 h-6' />
            <span className='text-xs uppercase tracking-[0.2em] font-bold'>
              Ver ceremonia
            </span>
          </a>
          <a
            href='#'
            className='flex items-center justify-center space-x-4 px-12 py-6 bg-surface-container-lowest rounded-full hover:bg-primary/5 transition-all duration-300 editorial-shadow'
          >
            <UtensilsCrossed className='text-primary w-6 h-6' />
            <span className='text-xs uppercase tracking-[0.2em] font-bold'>
              Ver recepción
            </span>
          </a>
        </div>
      </div>
    </Section>
  )
}
