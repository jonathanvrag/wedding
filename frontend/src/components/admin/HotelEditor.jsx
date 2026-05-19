/**
 * HotelEditor - Editor de lista de hoteles para el admin
 * Permite agregar, editar y eliminar hoteles
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DEFAULT_HOTELS = [
  { name: 'Hotel El Mirador', dist: 'A 5 min del lugar', desc: 'Un espacio boutique con vistas increíble.', imagen: '', url: '' },
  { name: 'Villa Serena', dist: 'A 10 min del lugar', desc: 'Encanto rústico y jardines privados.', imagen: '', url: '' },
  { name: 'Grand Plaza Suites', dist: 'A 15 min del lugar', desc: 'Opción moderna en el centro histórico.', imagen: '', url: '' },
]

export function HotelEditor({ hoteles, onChange }) {
  const [hotels, setHotels] = useState(DEFAULT_HOTELS)

  // Load hotels from props when available
  useEffect(() => {
    if (hoteles && hoteles.trim()) {
      try {
        const parsed = JSON.parse(hoteles)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHotels(parsed)
        }
      } catch (e) {
        // Keep default
      }
    }
  }, [hoteles])

  const addHotel = () => {
    const newHotels = [...hotels, { name: '', dist: '', desc: '', imagen: '', url: '' }]
    setHotels(newHotels)
    onChange(JSON.stringify(newHotels))
  }

  const updateHotel = (index, field, value) => {
    const updated = [...hotels]
    updated[index][field] = value
    setHotels(updated)
    onChange(JSON.stringify(updated))
  }

  const removeHotel = (index) => {
    const newHotels = hotels.filter((_, i) => i !== index)
    setHotels(newHotels)
    onChange(JSON.stringify(newHotels))
  }

  return (
    <div className='space-y-4'>
      {hotels.map((hotel, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 bg-surface-container rounded-lg'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
            <input
              value={hotel.name}
              onChange={(e) => updateHotel(i, 'name', e.target.value)}
              placeholder='Nombre del hotel'
              className='input'
            />
            <input
              value={hotel.dist}
              onChange={(e) => updateHotel(i, 'dist', e.target.value)}
              placeholder='Distancia (ej: A 5 min)'
              className='input'
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3 mb-3'>
            <input
              value={hotel.desc}
              onChange={(e) => updateHotel(i, 'desc', e.target.value)}
              placeholder='Descripción'
              className='input'
            />
            <input
              value={hotel.url || ''}
              onChange={(e) => updateHotel(i, 'url', e.target.value)}
              placeholder='URL del hotel'
              className='input'
            />
          </div>
          <div className='flex gap-2'>
            <input
              value={hotel.imagen || ''}
              onChange={(e) => updateHotel(i, 'imagen', e.target.value)}
              placeholder='URL de imagen'
              className='input flex-1'
            />
            <button
              onClick={() => removeHotel(i)}
              className='text-tertiary hover:text-red-500 p-2'
            >
              ✕
            </button>
          </div>
        </motion.div>
      ))}
      <button onClick={addHotel} className='btn-secondary w-full'>
        + Agregar Hotel
      </button>
    </div>
  )
}
