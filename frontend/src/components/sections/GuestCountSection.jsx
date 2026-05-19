/**
 * GuestCountSection - Indicador de plazas disponibles
 * Muestra cuántas personas incluye la invitación
 */
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Flower2 } from 'lucide-react'

export function GuestCountSection({ cantidad = 1 }) {
  return (
    <Section>
      <div className='max-w-2xl mx-auto'>
        <Card className='p-16 text-center'>
          <Flower2 className='text-primary mx-auto mb-8 w-10 h-10 stroke-[1px]' />
          <h3 className='font-serif italic text-4xl text-secondary mb-6'>
            Un lugar para ti
          </h3>
          <div className='h-px w-16 bg-primary/20 mx-auto mb-6' />
          <p className='text-xl text-secondary font-light'>
            Esta invitación es válida para{' '}
            <span className='font-bold text-primary px-2'>{cantidad}</span>{' '}
            personas.
          </p>
        </Card>
      </div>
    </Section>
  )
}
