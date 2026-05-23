/**
 * Footer - Pie de página de la invitación
 */
import logoSrc from '../../assets/logo.png'

export function Footer({ nombresNovios = 'Jonathan & Valentina' }) {
  return (
    <footer className='bg-surface py-16 px-8 border-t border-primary/5'>
      <div className='flex flex-col items-center gap-6'>
        <img
          src={logoSrc}
          alt='Logo'
          className='w-16 h-16 object-contain opacity-40'
        />
        <p className='text-xs uppercase tracking-[0.4em] text-tertiary/40 text-center'>
          {nombresNovios} — 2026. Diseñado con amor.
        </p>
      </div>
    </footer>
  );
}
