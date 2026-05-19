/**
 * StatCard - Tarjeta de estadísticas del dashboard
 * Muestra métricas con colores semánticos
 */
export function StatCard({ label, value, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  }

  return (
    <div className='card hover:scale-[1.02] transition-transform duration-300'>
      <p className={`text-3xl font-display ${colorClasses[color]}`}>{value}</p>
      <p className='text-sm text-secondary mt-1'>{label}</p>
    </div>
  )
}
