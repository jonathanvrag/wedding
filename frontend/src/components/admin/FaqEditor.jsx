/**
 * FaqEditor - Editor de preguntas frecuentes
 * Permite agregar, editar y eliminar FAQs
 */
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DEFAULT_FAQS = [
  { q: '¿Cuál es el código de vestimenta?', a: 'El Dress Code para nuestra boda es formal.' },
  { q: '¿Podemos ir con niños?', a: 'Aunque nos encantan los niños, hemos decidido celebrar una boda solo para adultos.' },
  { q: '¿Habrá servicio de transporte?', a: 'Sí, pondremos un servicio de autobuses.' },
]

export function FaqEditor({ faqs, onChange }) {
  const [faqsList, setFaqsList] = useState(DEFAULT_FAQS)

  // Load FAQs from props when available
  useEffect(() => {
    if (faqs && faqs.trim()) {
      try {
        const parsed = JSON.parse(faqs)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFaqsList(parsed)
        }
      } catch (e) {
        // Keep default
      }
    }
  }, [faqs])

  const addFaq = () => {
    const newFaqs = [...faqsList, { q: '', a: '' }]
    setFaqsList(newFaqs)
    onChange(JSON.stringify(newFaqs))
  }

  const updateFaq = (index, field, value) => {
    const updated = [...faqsList]
    updated[index][field] = value
    setFaqsList(updated)
    onChange(JSON.stringify(updated))
  }

  const removeFaq = (index) => {
    const newFaqs = faqsList.filter((_, i) => i !== index)
    setFaqsList(newFaqs)
    onChange(JSON.stringify(newFaqs))
  }

  return (
    <div className='space-y-4'>
      {faqsList.map((faq, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='p-4 bg-surface-container rounded-lg'
        >
          <div className='grid grid-cols-1 gap-3 mb-3'>
            <input
              value={faq.q}
              onChange={(e) => updateFaq(i, 'q', e.target.value)}
              placeholder='Pregunta'
              className='input'
            />
          </div>
          <div className='flex gap-2'>
            <textarea
              value={faq.a}
              onChange={(e) => updateFaq(i, 'a', e.target.value)}
              placeholder='Respuesta'
              className='input flex-1 min-h-[80px]'
            />
            <button
              onClick={() => removeFaq(i)}
              className='text-tertiary hover:text-red-500 p-2 self-start'
            >
              ✕
            </button>
          </div>
        </motion.div>
      ))}
      <button onClick={addFaq} className='btn-secondary w-full'>
        + Agregar Pregunta
      </button>
    </div>
  )
}
