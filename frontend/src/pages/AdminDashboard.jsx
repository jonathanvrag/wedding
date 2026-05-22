/**
 * AdminDashboard - Panel de administración de invitados
 * 
 * Este archivo SOLO contiene lógica de estado y composición.
 * Los componentes UI viven en /components/admin
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../lib/utils'
import { Settings } from 'lucide-react'
import { toast, ToastContainer } from '../components/ui/Toast'

// Componentes separados
import { StatCard } from '../components/admin/StatCard'
import { FilterInput, FilterSelect } from '../components/admin/Filters'
import { GuestTable } from '../components/admin/GuestTable'
import { Pagination } from '../components/admin/Pagination'
import { AddGuestModal } from '../components/admin/AddGuestModal'

// Constantes
const ITEMS_PER_PAGE = 10

const CATEGORIAS = [
  { value: '', label: 'Todas las categorías' },
  { value: 'Familia del Novio', label: 'Familia del Novio' },
  { value: 'Familia de la Novia', label: 'Familia de la Novia' },
  { value: 'Amigos del novio', label: 'Amigos del novio' },
  { value: 'Amigos de la novia', label: 'Amigos de la novia' },
]

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'completado', label: 'Completados' },
  { value: 'pendiente', label: 'Pendientes' },
]

/**
 * Hook para obtener datos del API
 */
function useAdminData(token) {
  const [invitados, setInvitados] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` }

      const [invitadosRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/admin/invitados`, { headers }),
        fetch(`${API_URL}/admin/stats`, { headers }),
      ])

      if (!invitadosRes.ok || !statsRes.ok) {
        throw new Error('Error al cargar datos')
      }

      setInvitados(await invitadosRes.json())
      setStats(await statsRes.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addGuest = async (guestData) => {
    const res = await fetch(`${API_URL}/admin/invitados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(guestData),
    })
    if (!res.ok) throw new Error('Error al agregar')
    return res.json()
  }

  return { invitados, stats, loading, error, fetchData, addGuest }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('admin_token')

  // Estado
  const [showAddModal, setShowAddModal] = useState(false)
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [filtroConfirmo, setFiltroConfirmo] = useState('')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Hook de datos
  const { invitados, stats, loading, error, fetchData, addGuest } =
    useAdminData(token)

  // Efecto inicial
  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [])

  // Reset página cuando cambian filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [filtroCategoria, filtroConfirmo, search])

  // Filtrado de invitados (memoizado)
  const filteredInvitados = useMemo(() => {
    return invitados.filter((inv) => {
      if (filtroCategoria && inv.categoria !== filtroCategoria) return false
      if (filtroConfirmo === 'completado' && inv.confirmo === 'pendiente') return false
      if (filtroConfirmo && filtroConfirmo !== 'completado' && inv.confirmo !== filtroConfirmo) return false
      if (search && !inv.nombre.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [invitados, filtroCategoria, filtroConfirmo, search])

  // Guests paginados
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredInvitados.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredInvitados, currentPage])

  const totalPages = Math.ceil(filteredInvitados.length / ITEMS_PER_PAGE)

  // Handlers
  const handleAddGuest = async (guestData) => {
    try {
      await addGuest(guestData)
      toast('Invitado agregado correctamente')
      setShowAddModal(false)
      fetchData()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen bg-surface flex items-center justify-center'>
        <div className='text-secondary'>Cargando...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-surface'>
      {/* Header */}
      <header className='bg-surface-container-lowest border-b border-primary/10'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='font-display text-xl text-primary'>Dashboard</h1>
          <div className='flex items-center gap-4'>
            <Link
              to='/admin/config'
              className='text-sm text-secondary hover:text-primary flex items-center gap-2'
            >
              <Settings className='w-4 h-4' />
              Configuración
            </Link>
            <button
              onClick={handleLogout}
              className='text-sm text-secondary hover:text-primary'
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
          <StatCard label='Total' value={stats.total} color='primary' />
          <StatCard label='Completados' value={(stats.confirmados || 0) + (stats.rechazados || 0)} color='success' />
          <StatCard label='Pendientes' value={stats.pendientes} color='warning' />
        </div>

        {/* Filters */}
        <div className='flex flex-wrap gap-3 mb-6'>
          <FilterInput
            value={search}
            onChange={setSearch}
            placeholder='Buscar...'
          />
          <FilterSelect
            value={filtroCategoria}
            onChange={setFiltroCategoria}
            options={CATEGORIAS}
          />
          <FilterSelect
            value={filtroConfirmo}
            onChange={setFiltroConfirmo}
            options={ESTADOS}
          />
          <button
            onClick={() => setShowAddModal(true)}
            className='btn-primary'
          >
            + Agregar
          </button>
        </div>

        {/* Guest Table */}
        {filteredInvitados.length === 0 ? (
          <div className='p-8 text-center text-secondary'>
            No hay invitados que coincidan con los filtros
          </div>
        ) : (
          <GuestTable guests={paginatedGuests} />
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredInvitados.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add Modal */}
      <AddGuestModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddGuest}
      />
      <ToastContainer />
    </div>
  )
}
