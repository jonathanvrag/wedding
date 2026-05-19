/**
 * DetailsSection - Información de ceremonia y recepción
 * Muestra hora y lugar de ambos eventos con imágenes
 */
import { motion } from 'framer-motion'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Church, UtensilsCrossed, ArrowRight } from 'lucide-react'

export function DetailsSection({
  horaCeremonia = '4:00 PM',
  lugarCeremonia = 'Sede San Patricio',
  direccionCeremonia = 'Bogotá, Colombia',
  imagenCeremonia,
  horaRecepcion = '6:00 PM',
  lugarRecepcion = 'Sede San Patricio',
  direccionRecepcion = 'Bogotá, Colombia',
  imagenRecepcion,
}) {
  return (
    <Section id='detalles'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-24 items-start'>
        {/* Ceremony */}
        <div className='space-y-12'>
          <div className='relative'>
            <div className='aspect-[4/5] overflow-hidden rounded-xl bg-surface-container editorial-shadow'>
              {imagenCeremonia ? (
                <img
                  src={imagenCeremonia}
                  alt={lugarCeremonia}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-primary/5 flex items-center justify-center'>
                  <Church className='text-primary/30 w-32 h-32' />
                </div>
              )}
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className='absolute -bottom-10 -right-6 md:-right-12 p-12 bg-surface-container-lowest rounded-xl editorial-shadow max-w-xs'
            >
              <h3 className='text-3xl font-serif text-primary mb-4'>La Ceremonia</h3>
              <p className='text-xs text-tertiary uppercase tracking-widest mb-6'>
                {horaCeremonia || '4:00 PM'}
              </p>
              <p className='text-lg text-secondary leading-relaxed font-light'>
                {lugarCeremonia || 'Sede San Patricio'}
                <br />
                {direccionCeremonia || 'Bogotá, Colombia'}
              </p>
            </motion.div>
          </div>
          <div className='pt-12'>
            <a
              href='#'
              className='inline-flex items-center space-x-4 text-primary font-bold tracking-widest text-xs uppercase group'
            >
              <span>Ver ubicación en mapas</span>
              <ArrowRight
                size={18}
                className='transition-transform group-hover:translate-x-2'
              />
            </a>
          </div>
        </div>

        {/* Reception */}
        <div className='space-y-12 md:mt-48'>
          <div className='relative'>
            <div className='aspect-[4/5] overflow-hidden rounded-xl bg-surface-container editorial-shadow'>
              {imagenRecepcion ? (
                <img
                  src={imagenRecepcion}
                  alt={lugarRecepcion}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-primary/5 flex items-center justify-center'>
                  <UtensilsCrossed className='text-primary/30 w-32 h-32' />
                </div>
              )}
            </div>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className='absolute -bottom-10 -left-6 md:-left-12 p-12 bg-surface-container-lowest rounded-xl editorial-shadow max-w-xs'
            >
              <h3 className='text-3xl font-serif text-primary mb-4'>La Fiesta</h3>
              <p className='text-xs text-tertiary uppercase tracking-widest mb-6'>
                {horaRecepcion || '6:00 PM'}
              </p>
              <p className='text-lg text-secondary leading-relaxed font-light'>
                {lugarRecepcion || 'Sede San Patricio'}
                <br />
                {direccionRecepcion || 'Bogotá, Colombia'}
              </p>
            </motion.div>
          </div>
          <div className='pt-12'>
            <a
              href='#'
              className='inline-flex items-center space-x-4 text-primary font-bold tracking-widest text-xs uppercase group'
            >
              <span>Ver ubicación en mapas</span>
              <ArrowRight
                size={18}
                className='transition-transform group-hover:translate-x-2'
              />
            </a>
          </div>
        </div>
      </div>
    </Section>
  )
}
