/**
 * Footer - Pie de página de la invitación
 */
export function Footer({ nombresNovios = 'Jonathan & Valentina' }) {
  return (
    <footer className='bg-surface py-16 px-8 border-t border-primary/5'>
      <p className='text-xs uppercase tracking-[0.4em] text-tertiary/40 text-center'>
        {nombresNovios} — 2026. Diseñado con amor.
      </p>
    </footer>
  )
}
