/**
 * Input - Input controlado para el admin
 */
export function Input({ label, value, onChange, type = 'text', rows, className = '' }) {
  return (
    <div className={className}>
      <label className='block text-sm text-secondary mb-2'>{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className='input min-h-[100px]'
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='input'
        />
      )}
    </div>
  )
}

/**
 * Section - Sección de configuración agrupada
 */
export function ConfigSection({ title, icon: Icon, children }) {
  return (
    <div className='card mb-6'>
      <div className='flex items-center gap-3 mb-6'>
        <Icon className='text-primary w-5 h-5' />
        <h3 className='font-display text-xl text-primary'>{title}</h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>{children}</div>
    </div>
  )
}
