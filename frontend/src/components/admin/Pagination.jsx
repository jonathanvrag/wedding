/**
 * Pagination - Componente de paginación
 * Controles anterior/siguiente con información de página actual
 */
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className='flex items-center justify-between mt-4 px-2'>
      <p className='text-sm text-secondary'>
        Mostrando {start} - {end} de {totalItems}
      </p>
      <div className='flex items-center gap-2'>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='p-2 rounded-lg border border-surface-container-low hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <span className='text-sm text-secondary px-2'>
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='p-2 rounded-lg border border-surface-container-low hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>
    </div>
  )
}
