/**
 * FilterInput - Input de búsqueda para filtros
 */
export function FilterInput({ value, onChange, placeholder }) {
  return (
    <input
      type='text'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className='input flex-1 min-w-[200px]'
    />
  )
}

/**
 * FilterSelect - Select para filtros
 */
export function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='input w-auto'
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
