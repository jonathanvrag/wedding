/**
 * RsvpSection - Formulario de confirmación de asistencia
 * Maneja el envío de RSVP con validaciones
 * 
 * Estados:
 * - yaConfirmo: el invitado ya confirmó asistencia
 * - expired: el plazo de confirmación venceu
 * - normal: muestra el formulario
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Section } from '../ui/Section'
import { Mail, Flower2, CheckCircle } from 'lucide-react'
import { API_URL, formatDateToSpanish } from '../../lib/utils'

export function RsvpSection({
  codigo,
  guestName,
  maxCantidad = 1,
  fechaLimite = '1 de Mayo',
  yaConfirmo = false,
  fechaLimiteISO = null,
}) {
  const [formData, setFormData] = useState({
    nombre: guestName || '',
    cantidad: maxCantidad || 1,
    restricciones: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [expired, setExpired] = useState(false)

  // Verificar si ya pasó la fecha límite al cargar
  useEffect(() => {
    if (fechaLimiteISO) {
      const fechaLimiteDt = new Date(fechaLimiteISO + 'T23:59:59')
      if (new Date() > fechaLimiteDt) {
        setExpired(true)
      }
    }
  }, [fechaLimiteISO])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/invitacion/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo,
          confirmo: 'si',
          cantidad: formData.cantidad,
          acompanantes: formData.restricciones || null,
        }),
      })

      if (res.status === 410) {
        setExpired(true)
        setError('El plazo de confirmación ha finalizado.')
        return
      }

      if (!res.ok) throw new Error('Error al confirmar')

      setSubmitted(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Estado 1: Ya confirmó anteriormente
  if (yaConfirmo && !submitted) {
    return (
      <Section id='rsvp' className='bg-primary text-surface'>
        <div className='max-w-4xl mx-auto relative z-10'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center p-20 bg-surface-container-lowest/5 rounded-[2rem]'
          >
            <CheckCircle className='mx-auto mb-8 w-20 h-20 text-green-400' />
            <h3 className='text-4xl font-serif mb-6'>¡Ya Confirmaste!</h3>
            <p className='text-xl opacity-70 mb-4'>
              Ya nos confirmaste tu asistencia. ¡Nos vemos en la boda!
            </p>
            <p className='text-lg opacity-50'>
              Si necesitas modificar algo, contactanos directamente.
            </p>
          </motion.div>
        </div>

        <div className='absolute -top-40 -left-40 opacity-10 pointer-events-none'>
          <Flower2 size={600} className='text-surface stroke-[0.5px]' />
        </div>
      </Section>
    )
  }

  // Estado 2: Plazo vencido
  if (expired) {
    return (
      <Section id='rsvp' className='bg-primary text-surface'>
        <div className='max-w-4xl mx-auto relative z-10'>
          <div className='text-center mb-20'>
            <Mail className='mx-auto mb-10 w-14 h-14 stroke-[1px] opacity-80' />
            <h2 className='text-5xl md:text-7xl font-serif italic mb-8'>
              Confirmar Asistencia
            </h2>
            <p className='font-light text-xl opacity-70 max-w-lg mx-auto leading-relaxed'>
              El plazo de confirmación ha finalizado. Gracias por tu interés en nuestra boda.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center p-20 bg-surface-container-lowest/5 rounded-[2rem]'
          >
            <Flower2 className='mx-auto mb-8 w-20 h-20 opacity-50' />
            <h3 className='text-4xl font-serif mb-6 text-tertiary'>Plazo Finalizado</h3>
            <p className='text-xl opacity-60 max-w-md mx-auto'>
              Lo sentimos, el plazo para confirmar asistencia ha terminado. 
              Si tienes alguna consulta, por favor contacta directamente a los novios.
            </p>
          </motion.div>
        </div>

        <div className='absolute -top-40 -left-40 opacity-10 pointer-events-none'>
          <Flower2 size={600} className='text-surface stroke-[0.5px]' />
        </div>
      </Section>
    )
  }

  // Estado normal: Mostrar formulario
  return (
    <Section id='rsvp' className='bg-primary text-surface'>
      <div className='max-w-4xl mx-auto relative z-10'>
        <div className='text-center mb-20'>
          <Mail className='mx-auto mb-10 w-14 h-14 stroke-[1px] opacity-80' />
          <h2 className='text-5xl md:text-7xl font-serif italic mb-8'>
            Confirmar Asistencia
          </h2>
          <p className='font-light text-xl opacity-70 max-w-lg mx-auto leading-relaxed'>
            Por favor, confírmanos antes del {fechaLimite} para poder organizar todos los detalles con cariño.
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center p-20 bg-surface-container-lowest/5 rounded-[2rem]'
          >
            <Flower2 className='mx-auto mb-8 w-20 h-20' />
            <h3 className='text-4xl font-serif mb-6'>¡Gracias!</h3>
            <p className='text-xl opacity-70'>Tu confirmación ha sido recibida.</p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-12 bg-surface-container-lowest/5 p-12 md:p-20 rounded-[2rem] backdrop-blur-md border border-surface/10'
          >
            <div className='space-y-4'>
              <label className='block text-xs uppercase tracking-[0.2em] opacity-60 font-bold'>
                Nombre Completo
              </label>
              <input
                type='text'
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                className='w-full bg-transparent border-b border-surface/20 py-5 focus:outline-none focus:border-surface transition-colors text-surface placeholder:text-surface/20 text-lg'
                placeholder='Tu nombre'
              />
            </div>
            <div className='space-y-4'>
              <label className='block text-xs uppercase tracking-[0.2em] opacity-60 font-bold'>
                Número de acompañantes (máx {maxCantidad})
              </label>
              <input
                type='number'
                value={formData.cantidad}
                onChange={(e) => {
                  const val = parseInt(e.target.value)
                  if (val >= 1 && val <= maxCantidad) {
                    setFormData({ ...formData, cantidad: val })
                  }
                }}
                min='1'
                max={maxCantidad}
                className='w-full bg-transparent border-b border-surface/20 py-5 focus:outline-none focus:border-surface transition-colors text-surface text-lg'
              />
            </div>
            <div className='md:col-span-2 space-y-4'>
              <label className='block text-xs uppercase tracking-[0.2em] opacity-60 font-bold'>
                Restricciones Alimentarias / Alergias
              </label>
              <input
                type='text'
                value={formData.restricciones}
                onChange={(e) =>
                  setFormData({ ...formData, restricciones: e.target.value })
                }
                className='w-full bg-transparent border-b border-surface/20 py-5 focus:outline-none focus:border-surface transition-colors text-surface placeholder:text-surface/20 text-lg'
                placeholder='Ej: Celíaco, Vegano, Alergia frutos secos...'
              />
            </div>
            {error && (
              <div className='md:col-span-2 text-center text-red-300 text-lg'>
                {error}
              </div>
            )}
            <div className='md:col-span-2 pt-12 text-center'>
              <motion.button
                type='submit'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting}
                className='w-full md:w-auto px-24 py-6 bg-surface text-primary rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl transition-all disabled:opacity-50'
              >
                {submitting ? 'Enviando...' : 'Enviar Confirmación'}
              </motion.button>
            </div>
          </form>
        )}
      </div>

      <div className='absolute -top-40 -left-40 opacity-10 pointer-events-none'>
        <Flower2 size={600} className='text-surface stroke-[0.5px]' />
      </div>
    </Section>
  )
}
