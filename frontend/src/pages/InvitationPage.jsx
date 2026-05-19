/**
 * InvitationPage - Página de invitación a la boda
 * 
 * Este archivo SOLO contiene composición de componentes.
 * Cada componente vive en su propio archivo en /components
 * 
 * Arquitectura limpia siguiendo:
 * - Atomic Design (atoms, molecules, organisms)
 * - Single Responsibility Principle
 * - Composición sobre herencia
 */
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

// Componentes importados desde sus archivos separados
// Esto hace que el archivo sea legible y mantenible
import { BotanicalTop, BotanicalBottom } from '../components/Botanical'
import { Navigation, Footer } from '../components/layout'
import { 
  HeroSection, 
  WelcomeSection, 
  GuestCountSection,
  DetailsSection, 
  MapSection, 
  AccommodationSection, 
  FaqSection,
  RsvpSection 
} from '../components/sections'

import { API_URL, formatDateToSpanish } from '../lib/utils'

/**
 * Estado de carga cuando sefetchan datos
 */
function LoadingState() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-surface'>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className='w-8 h-8 border border-primary/30 border-t-primary rounded-full'
      />
    </div>
  )
}

/**
 * Estado de error cuando la invitación no existe
 */
function ErrorState({ message }) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-surface p-6'>
      <div className='text-center'>
        <h1 className='font-serif text-2xl text-primary mb-4'>
          Invitación no encontrada
        </h1>
        <p className='text-secondary'>{message}</p>
      </div>
    </div>
  )
}

/**
 * Componente principal de la página de invitación
 * Solo maneja:
 * 1. Obtención de datos del código de invitación
 * 2. Renderizado de secciones mediante composición
 * 3. Estados de carga y error
 */
export default function InvitationPage() {
  const { codigo } = useParams()
  const [invitacion, setInvitacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch de datos de la invitación
  useEffect(() => {
    fetch(`${API_URL}/invitacion/${codigo}`)
      .then(res => {
        if (!res.ok) throw new Error('Invitación no encontrada')
        return res.json()
      })
      .then(setInvitacion)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [codigo])

  // Handler para scroll al RSVP
  const handleRsvpClick = () => {
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Estados de carga/error
  if (loading) return <LoadingState />
  if (error || !invitacion) return <ErrorState message={error} />

  // Renderizado de la página mediante composición
  return (
    <div className='min-h-screen page-enter'>
      {/* Elementos decorativos botanical */}
      <BotanicalTop className='hidden md:block' />
      <BotanicalBottom className='hidden md:block' />

      {/* Navegación fija */}
      <Navigation 
        onRsvpClick={handleRsvpClick}
        nombresNovios={invitacion.nombres_novios}
      />

      {/* Secciones de la invitación */}
      <HeroSection 
        guestName={invitacion.nombre}
        nombresNovios={invitacion.nombres_novios}
        fecha={invitacion.fecha_evento}
      />
      
      <WelcomeSection mensaje={invitacion.mensaje_bienvenida} />
      
      <GuestCountSection cantidad={invitacion.tiene_pareja ? 2 : 1} />
      
      <DetailsSection 
        horaCeremonia={invitacion.hora_ceremonia}
        lugarCeremonia={invitacion.lugar_ceremonia}
        direccionCeremonia={invitacion.direccion_ceremonia}
        imagenCeremonia={invitacion.imagen_ceremonia}
        horaRecepcion={invitacion.hora_recepcion}
        lugarRecepcion={invitacion.lugar_recepcion}
        direccionRecepcion={invitacion.direccion_recepcion}
        imagenRecepcion={invitacion.imagen_recepcion}
      />
      
      <MapSection 
        lugarCeremonia={invitacion.lugar_ceremonia}
        direccionCeremonia={invitacion.direccion_ceremonia}
      />
      
      <AccommodationSection hoteles={invitacion.hoteles} />
      
      <RsvpSection
        codigo={codigo}
        guestName={invitacion.nombre}
        maxCantidad={invitacion.tiene_pareja ? 2 : 1}
        fechaLimite={formatDateToSpanish(invitacion.fecha_limite_confirmacion)}
        yaConfirmo={invitacion.confirmo === 'si'}
        fechaLimiteISO={invitacion.fecha_limite_confirmacion}
      />
      
      <FaqSection faqs={invitacion.faqs} />
      
      <Footer nombresNovios={invitacion.nombres_novios} />
    </div>
  )
}
