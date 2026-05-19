/**
 * GuestTable - Tabla de invitados con paginación
 * Muestra la lista de invitados con badges de estado
 */
import { Badge } from '../ui/Badge'

export function GuestTable({ guests, onRowClick }) {
  const getCategoriaBadge = (cat) => {
    const badges = {
      'Familia del Novio': 'primary',
      'Familia de la Novia': 'default',
      'Amigos del novio': 'default',
      'Amigos de la novia': 'default',
    }
    return badges[cat] || 'default'
  }

  const getConfirmoBadge = (confirmo) => {
    const badges = {
      si: 'success',
      no: 'error',
      pendiente: 'default',
    }
    return badges[confirmo] || 'default'
  }

  const getConfirmoLabel = (confirmo) => {
    const labels = {
      si: 'Confirmado',
      no: 'No va',
      pendiente: 'Pendiente',
    }
    return labels[confirmo] || confirmo
  }

  return (
    <div className='bg-surface-container-lowest rounded-xl overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-surface-container-low text-sm text-secondary'>
            <tr>
              <th className='text-left p-4 font-medium'>Nombre</th>
              <th className='text-left p-4 font-medium'>Categoría</th>
              <th className='text-left p-4 font-medium'>Estado</th>
              <th className='text-left p-4 font-medium'>Código</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-surface-container-low'>
            {guests.map((inv) => (
              <tr
                key={inv.id}
                className='hover:bg-surface-container-low/50 transition-colors cursor-pointer'
                onClick={() => onRowClick?.(inv)}
              >
                <td className='p-4'>
                  <div>
                    <p className='font-medium text-primary'>{inv.nombre}</p>
                    {inv.nombre_pareja && (
                      <p className='text-sm text-secondary'>+ {inv.nombre_pareja}</p>
                    )}
                  </div>
                </td>
                <td className='p-4'>
                  <Badge variant={getCategoriaBadge(inv.categoria)}>
                    {inv.categoria}
                  </Badge>
                </td>
                <td className='p-4'>
                  <Badge variant={getConfirmoBadge(inv.confirmo)}>
                    {getConfirmoLabel(inv.confirmo)}
                  </Badge>
                </td>
                <td className='p-4'>
                  <code className='text-xs bg-surface-container-low px-2 py-1 rounded'>
                    {inv.codigo}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
