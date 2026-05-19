/**
 * Badge - Indicador visual de estado
 * Variantes: default, success, warning, error, primary
 */
const variants = {
  default: 'bg-surface-container-low text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
  primary: 'bg-primary/10 text-primary',
}

export function Badge({ children, variant = 'default' }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${variants[variant]}`}>
      {children}
    </span>
  )
}
