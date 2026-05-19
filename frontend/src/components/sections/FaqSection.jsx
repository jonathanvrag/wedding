/**
 * FaqSection - Preguntas frecuentes
 * Accordion interactivo: pregunta visible, respuesta colapsable
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from '../ui/Section'
import { Card } from '../ui/Card'
import { Plus, Minus } from 'lucide-react'

const DEFAULT_FAQS = [
  {
    q: '¿Cuál es el código de vestimenta?',
    a: 'El Dress Code para nuestra boda es formal. Para los hombres, recomendamos traje; para las mujeres, vestido largo o de córtel.',
  },
  {
    q: '¿Podemos ir con niños?',
    a: 'Aunque nos encantan los niños, hemos decidido celebrar una boda solo para adultos para que todos podáis disfrutar de la noche sin preocupaciones.',
  },
  {
    q: '¿Habrá servicio de transporte?',
    a: 'Sí, pondremos a vuestra disposición un servicio de autobuses que saldrá desde el centro de la ciudad.',
  },
]

export function FaqSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)

  let faqsList = DEFAULT_FAQS

  if (faqs && faqs.trim()) {
    try {
      const parsed = JSON.parse(faqs)
      if (Array.isArray(parsed) && parsed.length > 0) {
        faqsList = parsed
      }
    } catch (e) {
      faqsList = DEFAULT_FAQS
    }
  }

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <Section className='bg-surface-container-low'>
      <div className='max-w-3xl mx-auto'>
        <h2 className='text-4xl font-serif text-primary text-center mb-20 italic'>
          Preguntas Frecuentes
        </h2>
        <div className='space-y-4'>
          {faqsList.map((faq, i) => (
            <Card key={i} className='p-0 overflow-hidden border border-primary/5'>
              <button
                onClick={() => toggleFaq(i)}
                className='w-full p-8 flex items-center justify-between text-left hover:bg-surface-container-low/30 transition-colors'
              >
                <span className='font-serif text-2xl text-primary pr-4'>
                  {faq.q}
                </span>
                <span className='flex-shrink-0 ml-4'>
                  {openIndex === i ? (
                    <Minus className='text-primary w-6 h-6' />
                  ) : (
                    <Plus className='text-tertiary w-6 h-6' />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className='px-8 pb-8 pt-2 text-secondary text-lg leading-relaxed font-light border-t border-primary/5'>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  )
}
