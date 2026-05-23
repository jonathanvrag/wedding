/**
 * AddGuestModal - Modal para agregar nuevos invitados
 * Permite agregar múltiples acompañantes de forma individual
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'

export function AddGuestModal({ isOpen, onClose, onSubmit }) {
  const [newGuest, setNewGuest] = useState({
    nombre: '',
    categoria: 'Amigos de la novia',
    acompanantes: [], // array of companion names
    prioridad: 'Importante',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...newGuest,
      acompanantes: JSON.stringify(newGuest.acompanantes.filter(Boolean)),
    }
    await onSubmit(payload)
    resetForm()
  }

  const resetForm = () => {
    setNewGuest({
      nombre: '',
      categoria: 'Amigos de la novia',
      acompanantes: [],
      prioridad: 'Importante',
    })
  }

  const addCompanion = () => {
    setNewGuest((prev) => ({
      ...prev,
      acompanantes: [...prev.acompanantes, ''],
    }))
  }

  const removeCompanion = (index) => {
    setNewGuest((prev) => ({
      ...prev,
      acompanantes: prev.acompanantes.filter((_, i) => i !== index),
    }))
  }

  const updateCompanion = (index, value) => {
    setNewGuest((prev) => {
      const updated = [...prev.acompanantes]
      updated[index] = value
      return { ...prev, acompanantes: updated }
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
                    Nombre del invitado
                  </label>
                  <input
                    type='text'
                    required
                    value={newGuest.nombre}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, nombre: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, categoria: e.target.value })
                    }
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
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, prioridad: e.target.value })
                    }
                    className='input'
                  >
                    <option value='Indispensable'>Indispensable</option>
                    <option value='Importante'>Importante</option>
                    <option value='opcional'>Opcional</option>
                  </select>
                </div>

                {/* Acompañantes */}
                <div className='pt-2'>
                  <div className='flex items-center justify-between mb-3'>
                    <label className='text-sm text-secondary font-medium'>
                      Acompañantes
                    </label>
                    <button
                      type='button'
                      onClick={addCompanion}
                      className='flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider hover:text-primary/80 transition-colors'
                    >
                      <Plus className='w-3.5 h-3.5' />
                      Agregar acompañante
                    </button>
                  </div>

                  {newGuest.acompanantes.length === 0 && (
                    <p className='text-xs text-tertiary/60 italic'>
                      Sin acompañantes. El invitado asistirá solo.
                    </p>
                  )}

                  <div className='space-y-2'>
                    {newGuest.acompanantes.map((name, index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <input
                          type='text'
                          value={name}
                          onChange={(e) =>
                            updateCompanion(index, e.target.value)
                          }
                          className='input flex-1'
                          placeholder={`Nombre del acompañante ${index + 1}`}
                        />
                        <button
                          type='button'
                          onClick={() => removeCompanion(index)}
                          className='p-2 text-secondary/50 hover:text-red-500 transition-colors'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

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
