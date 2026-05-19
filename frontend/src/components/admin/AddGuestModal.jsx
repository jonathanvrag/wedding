/**
 * AddGuestModal - Modal para agregar nuevos invitados
 * Formulario con validaciones para crear invitados
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function AddGuestModal({ isOpen, onClose, onSubmit }) {
  const [newGuest, setNewGuest] = useState({
    nombre: '',
    categoria: 'Amigos de la novia',
    es_pareja: false,
    nombre_pareja: '',
    tiene_nino: false,
    nombres_ninos: '',
    prioridad: 'Importante',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newGuest)
  }

  const updateField = (field, value) => {
    setNewGuest((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setNewGuest({
      nombre: '',
      categoria: 'Amigos de la novia',
      es_pareja: false,
      nombre_pareja: '',
      tiene_nino: false,
      nombres_ninos: '',
      prioridad: 'Importante',
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
          onClick={() => {
            onClose()
            resetForm()
          }}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className='bg-surface-container-lowest rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-6'>
              <h2 className='font-display text-xl text-primary mb-6'>
                Agregar Invitado
              </h2>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                  <label className='block text-sm text-secondary mb-1'>
                    Nombre
                  </label>
                  <input
                    type='text'
                    required
                    value={newGuest.nombre}
                    onChange={(e) => updateField('nombre', e.target.value)}
                    className='input'
                    placeholder='Juan Pérez'
                  />
                </div>

                <div>
                  <label className='block text-sm text-secondary mb-1'>
                    Categoría
                  </label>
                  <select
                    value={newGuest.categoria}
                    onChange={(e) => updateField('categoria', e.target.value)}
                    className='input'
                  >
                    <option value='Familia del Novio'>Familia del Novio</option>
                    <option value='Familia de la Novia'>
                      Familia de la Novia
                    </option>
                    <option value='Amigos del novio'>Amigos del novio</option>
                    <option value='Amigos de la novia'>
                      Amigos de la novia
                    </option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm text-secondary mb-1'>
                    Prioridad
                  </label>
                  <select
                    value={newGuest.prioridad}
                    onChange={(e) => updateField('prioridad', e.target.value)}
                    className='input'
                  >
                    <option value='Indispensable'>Indispensable</option>
                    <option value='Importante'>Importante</option>
                    <option value='opcional'>Opcional</option>
                  </select>
                </div>

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='es_pareja'
                    checked={newGuest.es_pareja}
                    onChange={(e) => updateField('es_pareja', e.target.checked)}
                    className='rounded border-primary/30'
                  />
                  <label htmlFor='es_pareja' className='text-sm text-secondary'>
                    Tiene acompañante
                  </label>
                </div>

                {newGuest.es_pareja && (
                  <div>
                    <label className='block text-sm text-secondary mb-1'>
                      Nombre del acompañante
                    </label>
                    <input
                      type='text'
                      value={newGuest.nombre_pareja}
                      onChange={(e) =>
                        updateField('nombre_pareja', e.target.value)
                      }
                      className='input'
                    />
                  </div>
                )}

                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id='tiene_nino'
                    checked={newGuest.tiene_nino}
                    onChange={(e) =>
                      updateField('tiene_nino', e.target.checked)
                    }
                    className='rounded border-primary/30'
                  />
                  <label htmlFor='tiene_nino' className='text-sm text-secondary'>
                    Tiene niños
                  </label>
                </div>

                {newGuest.tiene_nino && (
                  <div>
                    <label className='block text-sm text-secondary mb-1'>
                      Nombres de los niños
                    </label>
                    <input
                      type='text'
                      value={newGuest.nombres_ninos}
                      onChange={(e) =>
                        updateField('nombres_ninos', e.target.value)
                      }
                      className='input'
                    />
                  </div>
                )}

                <div className='flex gap-3 pt-4'>
                  <button
                    type='button'
                    onClick={() => {
                      onClose()
                      resetForm()
                    }}
                    className='btn-secondary flex-1'
                  >
                    Cancelar
                  </button>
                  <button type='submit' className='btn-primary flex-1'>
                    Agregar
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
