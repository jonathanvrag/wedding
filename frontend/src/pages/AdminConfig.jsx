/**
 * AdminConfig - Página de configuración del evento
 * 
 * Este archivo SOLO contiene lógica de estado y composición.
 * Los componentes UI viven en /components/admin
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_URL } from '../lib/utils'
import { toast, ToastContainer } from '../components/ui/Toast'
import {
  Settings,
  Heart,
  MapPin,
  Clock,
  Building2,
  Save,
  RotateCcw,
  Mail,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Music,
} from 'lucide-react'

// Componentes separados
import { Input, ConfigSection } from '../components/admin/ConfigForm'
import { HotelEditor } from '../components/admin/HotelEditor'
import { FaqEditor } from '../components/admin/FaqEditor'

export default function AdminConfig() {
  const navigate = useNavigate()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const token = localStorage.getItem('admin_token')

  // Fetch de configuración
  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/config`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Error al cargar')
      const data = await res.json()
      setConfig(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/admin/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(config),
      })

      if (!res.ok) throw new Error('Error al guardar')
      toast('Configuración guardada correctamente')
    } catch (err) {
      toast(err.message, 'error')
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const goBack = () => {
    navigate('/admin')
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

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
        <div className='max-w-4xl mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <button
              onClick={goBack}
              className='text-primary hover:text-secondary transition-colors'
              title='Volver al dashboard'
            >
              <ArrowLeft className='w-5 h-5' />
            </button>
            <Settings className='text-primary w-5 h-5' />
            <h1 className='font-display text-xl text-primary'>Configuración</h1>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={logout}
              className='text-sm text-secondary hover:text-primary'
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 py-8'>
        {/* Error */}
        {error && (
          <div className='mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2'>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Novios */}
        <ConfigSection title='Los Novios' icon={Heart}>
          <Input
            label='Nombres de los novios'
            value={config?.nombres_novios || ''}
            onChange={(v) => updateField('nombres_novios', v)}
            className='md:col-span-2'
          />
          <Input
            label='Fecha del evento'
            value={config?.fecha_evento || ''}
            onChange={(v) => updateField('fecha_evento', v)}
          />
        </ConfigSection>

        {/* Ceremonia */}
        <ConfigSection title='Ceremonia' icon={MapPin}>
          <Input
            label='Hora'
            value={config?.hora_ceremonia || ''}
            onChange={(v) => updateField('hora_ceremonia', v)}
          />
          <Input
            label='Lugar'
            value={config?.lugar_ceremonia || ''}
            onChange={(v) => updateField('lugar_ceremonia', v)}
          />
          <Input
            label='Dirección'
            value={config?.direccion_ceremonia || ''}
            onChange={(v) => updateField('direccion_ceremonia', v)}
            className='md:col-span-2'
          />
          <Input
            label='URL de imagen'
            value={config?.imagen_ceremonia || ''}
            onChange={(v) => updateField('imagen_ceremonia', v)}
            className='md:col-span-2'
          />
        </ConfigSection>

        {/* Recepción */}
        <ConfigSection title='Recepción' icon={Clock}>
          <Input
            label='Hora'
            value={config?.hora_recepcion || ''}
            onChange={(v) => updateField('hora_recepcion', v)}
          />
          <Input
            label='Lugar'
            value={config?.lugar_recepcion || ''}
            onChange={(v) => updateField('lugar_recepcion', v)}
          />
          <Input
            label='Dirección'
            value={config?.direccion_recepcion || ''}
            onChange={(v) => updateField('direccion_recepcion', v)}
            className='md:col-span-2'
          />
          <Input
            label='URL de imagen'
            value={config?.imagen_recepcion || ''}
            onChange={(v) => updateField('imagen_recepcion', v)}
            className='md:col-span-2'
          />
        </ConfigSection>

        {/* Mensaje */}
        <ConfigSection title='Mensaje de Bienvenida' icon={Mail}>
          <Input
            label='Mensaje'
            value={config?.mensaje_bienvenida || ''}
            onChange={(v) => updateField('mensaje_bienvenida', v)}
            rows={4}
            className='md:col-span-2'
          />
          <Input
            label='Fecha límite por defecto para nuevos invitados (YYYY-MM-DD)'
            value={config?.fecha_limite_confirmacion || ''}
            onChange={(v) => updateField('fecha_limite_confirmacion', v)}
            type='date'
          />
          <p className='text-xs text-secondary/60 md:col-span-2 -mt-2'>
            Esta fecha se asigna automáticamente a cada invitado nuevo
          </p>
        </ConfigSection>

        {/* Hoteles */}
        <ConfigSection title='Hoteles' icon={Building2}>
          <div className='md:col-span-2'>
            <label className='block text-sm text-secondary mb-2'>
              Lista de hoteles
            </label>
            <HotelEditor
              hoteles={config?.hoteles}
              onChange={(v) => updateField('hoteles', v)}
            />
          </div>
        </ConfigSection>

        {/* FAQs */}
        <ConfigSection title='Preguntas Frecuentes' icon={HelpCircle}>
          <div className='md:col-span-2'>
            <label className='block text-sm text-secondary mb-2'>
              Lista de preguntas
            </label>
            <FaqEditor
              faqs={config?.faqs}
              onChange={(v) => updateField('faqs', v)}
            />
          </div>
        </ConfigSection>

        {/* Música */}
        <ConfigSection title='Música de Fondo' icon={Music}>
          <div className='md:col-span-2 space-y-3'>
            <label className='block text-sm text-secondary mb-1'>
              Archivo de audio (MP3)
            </label>
            <input
              type='file'
              accept='.mp3,.ogg,.wav'
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const form = new FormData()
                form.append('file', file)
                try {
                  const res = await fetch(`${API_URL}/admin/upload-audio`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: form,
                  })
                  if (!res.ok) throw new Error('Error al subir')
                  const data = await res.json()
                  updateField('audio_url', data.url)
                  toast('Audio subido correctamente')
                } catch {
                  toast('Error al subir el audio', 'error')
                }
              }}
              className='block w-full text-sm text-secondary file:mr-4 file:py-2 file:px-6 file:rounded-full file:border-0 file:bg-primary file:text-surface file:text-xs file:font-bold file:uppercase file:tracking-wider hover:file:bg-primary-light transition-colors'
            />
            {config?.audio_url && (
              <div className='flex items-center gap-2 text-xs text-secondary'>
                <span>✓ Audio configurado</span>
                <button
                  onClick={() => updateField('audio_url', '')}
                  className='text-error hover:underline'
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </ConfigSection>

        {/* Save Button */}
        <div className='flex gap-4'>
          <button
            onClick={handleSave}
            disabled={saving}
            className='btn-primary flex-1 flex items-center justify-center gap-2'
          >
            {saving ? (
              <>
                <RotateCcw className='animate-spin w-4 h-4' />
                Guardando...
              </>
            ) : (
              <>
                <Save className='w-4 h-4' />
                Guardar Configuración
              </>
            )}
          </button>
          <button onClick={fetchConfig} className='btn-secondary'>
            <RotateCcw className='w-4 h-4' />
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
