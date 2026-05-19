/**
 * Card - Componente de contenido elevado
 * No tiene bordes, sigue la regla "No-Line" del diseño
 */
export function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl p-10 ${className}`}>
      {children}
    </div>
  )
}
