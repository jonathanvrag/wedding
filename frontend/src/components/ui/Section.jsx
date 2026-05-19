/**
 * Section - Layout primitivo para secciones de contenido
 * Sigue el principio de atomic design: es un molecule
 */
export function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`py-20 md:py-32 px-8 ${className}`}>
      <div className='max-w-7xl mx-auto'>{children}</div>
    </section>
  )
}
