/**
 * RsvpSection - Confirmación de asistencia por persona
 * Cada invitado (titular + acompañantes) tiene su propio toggle
 *
 * Estados:
 * - yaConfirmo: el invitado ya confirmó
 * - expired: el plazo venció
 * - normal: formulario con toggles
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Section } from '../ui/Section'
import { Mail, Flower2, CheckCircle, User, X } from 'lucide-react'
import { API_URL, formatDateToSpanish } from '../../lib/utils'

function parseList(jsonStr) {
  if (!jsonStr) return []
  try {
    const parsed = JSON.parse(jsonStr)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

export function RsvpSection({
  codigo,
  guestName,
  acompanantes = '[]',
  confirmados = '',
  fechaLimite = '1 de Mayo',
  yaConfirmo = false,
  fechaLimiteISO = null,
}) {
  const comps = parseList(acompanantes)
  const yaConfirmados = parseList(confirmados)

  // Inicializar estado: todos los que ya confirmaron en "si"
  const [asistentes, setAsistentes] = useState(() => {
    const initial = {}
    // El titular
    initial[guestName] = yaConfirmados.includes(guestName)
    // Los acompañantes
    comps.forEach((c) => {
      initial[c] = yaConfirmados.includes(c)
    })
    return initial
  })

  const [restricciones, setRestricciones] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [expired, setExpired] = useState(false)

  // Si ya confirmó Y no está re-enviando, mostrar pantalla de "ya confirmaste"
  const allConfirmed =
    yaConfirmo &&
    !submitted &&
    Object.values(asistentes).some(Boolean)

  // Verificar fecha límite
  useEffect(() => {
    if (fechaLimiteISO) {
      const fechaLimiteDt = new Date(fechaLimiteISO + 'T23:59:59')
      if (new Date() > fechaLimiteDt) {
        setExpired(true)
      }
    }
  }, [fechaLimiteISO])

  const togglePersona = (name) => {
    setAsistentes((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const cantidad = Object.values(asistentes).filter(Boolean).length

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const asistentesList = Object.entries(asistentes)
      .filter(([, va]) => va)
      .map(([name]) => name)

    if (asistentesList.length === 0) {
      setError('Seleccioná al menos una persona que confirma asistencia.')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/invitacion/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo,
          confirmo: 'si',
          cantidad: asistentesList.length,
          asistentes: JSON.stringify(asistentesList),
          restricciones: restricciones || null,
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

  // Estado: ya confirmó anteriormente
  if (allConfirmed && !submitted) {
    const asistentesList = Object.entries(asistentes)
      .filter(([, va]) => va)
      .map(([name]) => name)

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
              Ya nos confirmaste tu asistencia.
            </p>
            <div className='flex flex-wrap justify-center gap-2 mb-6'>
              {asistentesList.map((name) => (
                <span
                  key={name}
                  className='inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface/10 text-surface text-sm'
                >
                  <User className='w-3.5 h-3.5' />
                  {name}
                </span>
              ))}
            </div>
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

  // Estado: plazo vencido
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
              El plazo de confirmación ha finalizado. Gracias por tu interés en
              nuestra boda.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='text-center p-20 bg-surface-container-lowest/5 rounded-[2rem]'
          >
            <Flower2 className='mx-auto mb-8 w-20 h-20 opacity-50' />
            <h3 className='text-4xl font-serif mb-6 text-tertiary'>
              Plazo Finalizado
            </h3>
            <p className='text-xl opacity-60 max-w-md mx-auto'>
              Lo sentimos, el plazo para confirmar asistencia ha terminado. Si
              tienes alguna consulta, por favor contacta directamente a los
              novios.
            </p>
          </motion.div>
        </div>

        <div className='absolute -top-40 -left-40 opacity-10 pointer-events-none'>
          <Flower2 size={600} className='text-surface stroke-[0.5px]' />
        </div>
      </Section>
    )
  }

  // Estado normal: formulario con toggles
  return (
    <Section id='rsvp' className='bg-primary text-surface'>
      <div className='max-w-4xl mx-auto relative z-10'>
        <div className='text-center mb-20'>
          <Mail className='mx-auto mb-10 w-14 h-14 stroke-[1px] opacity-80' />
          <h2 className='text-5xl md:text-7xl font-serif italic mb-8'>
            Confirmar Asistencia
          </h2>
          <p className='font-light text-xl opacity-70 max-w-lg mx-auto leading-relaxed'>
            Por favor, confírmanos antes del {fechaLimite} para poder organizar
            todos los detalles con cariño.
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
            <p className='text-xl opacity-70'>
              {cantidad === 1
                ? 'Tu asistencia ha sido confirmada.'
                : `Ustedes ${cantidad} han sido confirmados.`}
            </p>
            <div className='flex flex-wrap justify-center gap-2 mt-6'>
              {Object.entries(asistentes)
                .filter(([, va]) => va)
                .map(([name]) => (
                  <span
                    key={name}
                    className='inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface/10 text-surface text-sm'
                  >
                    <User className='w-3.5 h-3.5' />
                    {name}
                  </span>
                ))}
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className='max-w-2xl mx-auto space-y-10 bg-surface-container-lowest/5 p-12 md:p-16 rounded-[2rem] backdrop-blur-md border border-surface/10'
          >
            {/* Lista de personas */}
            <div className='space-y-4'>
              <label className='block text-xs uppercase tracking-[0.2em] opacity-60 font-bold text-center mb-6'>
                ¿Quiénes confirman?
              </label>

              {/* Titular */}
              <PersonToggle
                name={guestName}
                va={asistentes[guestName]}
                onToggle={() => togglePersona(guestName)}
                isMain
              />

              {/* Acompañantes */}
              {comps.map((name) => (
                <PersonToggle
                  key={name}
                  name={name}
                  va={asistentes[name]}
                  onToggle={() => togglePersona(name)}
                />
              ))}
            </div>

            {/* Contador */}
            <div className='text-center'>
              <p className='text-sm opacity-60 uppercase tracking-wider'>
                Asistirán{' '}
                <span className='text-xl font-bold text-surface'>
                  {cantidad}
                </span>{' '}
                {cantidad === 1 ? 'persona' : 'personas'}
              </p>
            </div>

            {/* Restricciones alimentarias */}
            <div className='space-y-4'>
              <label className='block text-xs uppercase tracking-[0.2em] opacity-60 font-bold'>
                Restricciones Alimentarias / Alergias
              </label>
              <input
                type='text'
                value={restricciones}
                onChange={(e) => setRestricciones(e.target.value)}
                className='w-full bg-transparent border-b border-surface/20 py-4 focus:outline-none focus:border-surface transition-colors text-surface placeholder:text-surface/20 text-lg'
                placeholder='Ej: Celíaco, Vegano, Alergia frutos secos...'
              />
            </div>

            {error && (
              <div className='text-center text-red-300 text-lg'>{error}</div>
            )}

            <div className='pt-6 text-center'>
              <motion.button
                type='submit'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting || cantidad === 0}
                className='w-full md:w-auto px-24 py-6 bg-surface text-primary rounded-full font-bold uppercase tracking-widest text-sm shadow-2xl transition-all disabled:opacity-30'
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

/**
 * PersonToggle - Tarjeta individual para cada persona
 * Muestra nombre y toggle sí/no con diseño tipo chip
 */
function PersonToggle({ name, va, onToggle, isMain = false }) {
  return (
    <button
      type='button'
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all duration-300 ${
        va
          ? 'bg-surface/10 border-surface/40'
          : 'bg-surface/5 border-transparent hover:bg-surface/[0.07]'
      }`}
    >
      <div className='flex items-center gap-4'>
        <div
          className={`p-2 rounded-full transition-colors ${
            va ? 'bg-surface/20' : 'bg-surface/5'
          }`}
        >
          {va ? (
            <CheckCircle className='w-5 h-5 text-green-300' />
          ) : (
            <X className='w-5 h-5 text-surface/40' />
          )}
        </div>
        <div className='text-left'>
          <span
            className={`text-lg transition-all ${
              va ? 'text-surface font-medium' : 'text-surface/50'
            }`}
          >
            {name}
          </span>
          {isMain && (
            <span className='ml-3 text-[10px] uppercase tracking-widest bg-surface/10 px-2 py-0.5 rounded-full opacity-60'>
              Invitado
            </span>
          )}
        </div>
      </div>

      <span
        className={`text-xs font-bold uppercase tracking-wider transition-all ${
          va ? 'text-green-300' : 'text-surface/30'
        }`}
      >
        {va ? 'Confirmado' : 'Declinado'}
      </span>
    </button>
  )
}
