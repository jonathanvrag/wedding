/**
 * Footer - Pie de página de la invitación
 * Componente simple con información de la boda
 */
import { Heart, PartyPopper } from 'lucide-react'

export function Footer({ nombresNovios = 'Jonathan & Valentina' }) {
  return (
    <footer className='bg-surface py-24 px-8 border-t border-primary/5'>
      <div className='flex flex-col items-center space-y-12 text-center'>
        <div className='text-4xl font-serif italic text-primary'>
          {nombresNovios}
        </div>
        <p className='font-serif italic text-xl text-tertiary max-w-md'>
          "Donde hay amor, hay vida."
        </p>
        <div className='flex space-x-16'>
          <a
            href='#'
            className='text-secondary/60 hover:text-primary transition-colors text-xs uppercase tracking-[0.3em] font-bold flex items-center space-x-3'
          >
            <Heart size={16} />
            <span>Nuestra Boda</span>
          </a>
          <a
            href='#'
            className='text-secondary/60 hover:text-primary transition-colors text-xs uppercase tracking-[0.3em] font-bold flex items-center space-x-3'
          >
            <PartyPopper size={16} />
            <span>Save the Date</span>
          </a>
        </div>
        <div className='h-px w-40 bg-primary/10' />
        <p className='text-xs uppercase tracking-[0.4em] text-tertiary/40'>
          {nombresNovios} — 2025. Diseñado con amor.
        </p>
      </div>
    </footer>
  )
}
