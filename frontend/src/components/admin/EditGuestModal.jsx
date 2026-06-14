import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Check, User, HelpCircle } from 'lucide-react'

function parseList(str) {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function derivePersonStatus(name, confirmo, confirmados) {
  if (confirmo === 'no') return 'no'
  if (confirmo === 'pendiente') return 'pendiente'
  if (confirmo === 'si') {
    return confirmados.includes(name) ? 'si' : 'no'
  }
  return 'pendiente'
}

const STATUS_OPTIONS = [
  { value: 'pendiente', label: '?', title: 'Pendiente', className: 'border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300' },
  { value: 'si', label: '✓', title: 'Confirmado', className: 'border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300' },
  { value: 'no', label: '✗', title: 'Rechazado', className: 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300' },
]

function PersonStatusToggle({ name, isMain, status, onChange }) {
  return (
    <div className='flex items-center justify-between p-4 rounded-xl border border-surface-container-low bg-surface-container-low/30'>
      <div className='flex items-center gap-3 min-w-0'>
        <div className='w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center shrink-0'>
          <User className='w-4 h-4 text-secondary' />
        </div>
        <div className='min-w-0'>
          <span className='text-sm font-medium truncate block'>{name}</span>
          {isMain && (
            <span className='text-[10px] uppercase tracking-wider text-tertiary font-semibold'>
              Titular
            </span>
          )}
        </div>
      </div>

      <div className='flex gap-1 shrink-0' role='radiogroup'>
        {STATUS_OPTIONS.map((opt) => {
          const active = status === opt.value
          return (
            <button
              key={opt.value}
              type='button'
              role='radio'
              aria-checked={active}
              title={opt.title}
              onClick={() => onChange(name, opt.value)}
              className={`w-10 h-10 rounded-lg border-2 text-sm font-bold transition-all ${
                active
                  ? opt.className + ' shadow-sm'
                  : 'border-transparent text-secondary/40 hover:text-secondary hover:border-surface-container-low'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function EditGuestModal({ isOpen, guest, onClose, onSubmit, onUpdateConfirmacion }) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: 'Amigos de la novia',
    acompanantes: [],
    prioridad: 'Importante',
    fecha_limite: '',
  })

  const [personStatus, setPersonStatus] = useState({})

  useEffect(() => {
    if (isOpen && guest) {
      const confirmados = parseList(guest.confirmados)
      const comps = parseList(guest.acompanantes)
      const allPeople = [guest.nombre, ...comps]

      const initial = {}
      allPeople.forEach((name) => {
        initial[name] = derivePersonStatus(name, guest.confirmo, confirmados)
      })

      setForm({
        nombre: guest.nombre || '',
        categoria: guest.categoria || 'Amigos de la novia',
        acompanantes: comps,
        prioridad: guest.prioridad || 'Importante',
        fecha_limite: guest.fecha_limite || '',
      })
      setPersonStatus(initial)
    }
  }, [isOpen, guest])

  const personas = [form.nombre, ...form.acompanantes]

  const confirmedCount = Object.values(personStatus).filter((s) => s === 'si').length
  const declinedCount = Object.values(personStatus).filter((s) => s === 'no').length
  const pendingCount = Object.values(personStatus).filter((s) => s === 'pendiente').length

  const setStatus = (name, value) => {
    setPersonStatus((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      acompanantes: JSON.stringify(form.acompanantes.filter(Boolean)),
    }
    await onSubmit(payload)
  }

  const handleSaveStatus = () => {
    const confirmados = Object.entries(personStatus)
      .filter(([, s]) => s === 'si')
      .map(([name]) => name)

    const hasSi = confirmedCount > 0
    const hasNo = declinedCount > 0
    const allPendiente = pendingCount === personas.length

    let confirmo
    if (allPendiente) confirmo = 'pendiente'
    else if (hasSi && !hasNo) confirmo = 'si'
    else if (hasNo && !hasSi) confirmo = 'no'
    else confirmo = 'si'

    onUpdateConfirmacion({
      confirmo,
      cantidad: confirmados.length,
      confirmados: confirmados.length > 0 ? JSON.stringify(confirmados) : '',
    })
  }

  const addCompanion = () => {
    setForm((prev) => ({
      ...prev,
      acompanantes: [...prev.acompanantes, ''],
    }))
  }

  const removeCompanion = (index) => {
    const removed = form.acompanantes[index]
    setPersonStatus((prev) => {
      const next = { ...prev }
      delete next[removed]
      return next
    })
    setForm((prev) => ({
      ...prev,
      acompanantes: prev.acompanantes.filter((_, i) => i !== index),
    }))
  }

  const updateCompanion = (index, value) => {
    const oldName = form.acompanantes[index]
    setForm((prev) => {
      const updated = [...prev.acompanantes]
      updated[index] = value
      return { ...prev, acompanantes: updated }
    })
    if (oldName !== value) {
      setPersonStatus((prev) => {
        const next = { ...prev }
        if (oldName) {
          next[value] = next[oldName]
          delete next[oldName]
        } else {
          next[value] = 'pendiente'
        }
        return next
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className='bg-surface-container-lowest rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-6'>
              <h2 className='font-display text-xl text-primary mb-1'>
                Editar Invitado
              </h2>
              <p className='text-sm text-secondary mb-6'>
                {guest?.nombre}
              </p>

              <form onSubmit={handleSubmit} className='space-y-5'>
                <div className='bg-surface-container-low/40 rounded-xl p-4 space-y-4'>
                  <h3 className='text-xs uppercase tracking-widest text-tertiary font-bold'>
                    Información
                  </h3>
                  <div>
                    <label className='block text-sm text-secondary mb-1'>
                      Nombre
                    </label>
                    <input
                      type='text'
                      required
                      value={form.nombre}
                      onChange={(e) => {
                        const old = form.nombre
                        setForm({ ...form, nombre: e.target.value })
                        setPersonStatus((prev) => {
                          const next = { ...prev }
                          next[e.target.value] = next[old] || 'pendiente'
                          delete next[old]
                          return next
                        })
                      }}
                      className='input'
                      placeholder='Juan Pérez'
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div>
                      <label className='block text-sm text-secondary mb-1'>
                        Categoría
                      </label>
                      <select
                        value={form.categoria}
                        onChange={(e) =>
                          setForm({ ...form, categoria: e.target.value })
                        }
                        className='input'
                      >
                        <option value='Familia del Novio'>Familia del Novio</option>
                        <option value='Familia de la Novia'>Familia de la Novia</option>
                        <option value='Amigos del novio'>Amigos del novio</option>
                        <option value='Amigos de la novia'>Amigos de la novia</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm text-secondary mb-1'>
                        Prioridad
                      </label>
                      <select
                        value={form.prioridad}
                        onChange={(e) =>
                          setForm({ ...form, prioridad: e.target.value })
                        }
                        className='input'
                      >
                        <option value='Indispensable'>Indispensable</option>
                        <option value='Importante'>Importante</option>
                        <option value='opcional'>Opcional</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm text-secondary mb-1'>
                      Fecha límite de confirmación
                    </label>
                    <input
                      type='date'
                      value={form.fecha_limite}
                      onChange={(e) =>
                        setForm({ ...form, fecha_limite: e.target.value })
                      }
                      className='input'
                    />
                  </div>
                </div>

                <div className='bg-surface-container-low/40 rounded-xl p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-xs uppercase tracking-widest text-tertiary font-bold'>
                      Estado individual
                    </h3>
                    <div className='flex items-center gap-3 text-xs text-secondary'>
                      <span className='flex items-center gap-1'>
                        <Check className='w-3 h-3 text-green-600' />
                        {confirmedCount}
                      </span>
                      <span className='flex items-center gap-1'>
                        <X className='w-3 h-3 text-red-500' />
                        {declinedCount}
                      </span>
                      <span className='flex items-center gap-1'>
                        <HelpCircle className='w-3 h-3 text-amber-500' />
                        {pendingCount}
                      </span>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    {personas.map((name) =>
                      name ? (
                        <PersonStatusToggle
                          key={name}
                          name={name}
                          isMain={name === form.nombre}
                          status={personStatus[name] || 'pendiente'}
                          onChange={setStatus}
                        />
                      ) : null
                    )}
                  </div>

                  {personas.length === 0 && (
                    <p className='text-xs text-tertiary/60 italic text-center py-4'>
                      Sin personas registradas.
                    </p>
                  )}

                  <button
                    type='button'
                    onClick={handleSaveStatus}
                    className='btn-primary w-full mt-2'
                  >
                    Guardar Estado
                  </button>
                </div>

                <div className='bg-surface-container-low/40 rounded-xl p-4 space-y-3'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-xs uppercase tracking-widest text-tertiary font-bold'>
                      Acompañantes
                    </h3>
                    <button
                      type='button'
                      onClick={addCompanion}
                      className='flex items-center gap-1 text-xs text-primary font-bold uppercase tracking-wider hover:text-primary/80 transition-colors'
                    >
                      <Plus className='w-3.5 h-3.5' />
                      Agregar
                    </button>
                  </div>

                  {form.acompanantes.length === 0 && (
                    <p className='text-xs text-tertiary/60 italic text-center py-4'>
                      Sin acompañantes.
                    </p>
                  )}

                  <div className='space-y-2'>
                    {form.acompanantes.map((name, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={name}
                          onChange={(e) => updateCompanion(index, e.target.value)}
                          className='input flex-1'
                          placeholder={`Acompañante ${index + 1}`}
                        />
                        <button
                          type='button'
                          onClick={() => removeCompanion(index)}
                          className='p-2 text-secondary/50 hover:text-red-500 transition-colors shrink-0'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex gap-3 pt-2'>
                  <button
                    type='button'
                    onClick={onClose}
                    className='btn-secondary flex-1'
                  >
                    Cancelar
                  </button>
                  <button type='submit' className='btn-primary flex-1'>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
