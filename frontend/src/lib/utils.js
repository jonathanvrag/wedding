import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const API_URL = '/api/v1'

/**
 * Convierte fecha ISO (YYYY-MM-DD) a formato legible en español
 * Ej: "2025-05-01" → "1 de Mayo de 2025"
 */
export function formatDateToSpanish(isoDate) {
  if (!isoDate || isoDate.length !== 10) return isoDate
  
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  
  const año = isoDate.substring(0, 4)
  const mes = parseInt(isoDate.substring(5, 7), 10)
  const dia = parseInt(isoDate.substring(8, 10), 10)
  
  return `${dia} de ${meses[mes - 1]} de ${año}`
}