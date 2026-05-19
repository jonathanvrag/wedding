/**
 * WelcomeSection - Mensaje de bienvenida a los invitados
 * Contiene la carta personal de los novios
 */
import { motion } from 'framer-motion'
import { Section } from '../ui/Section'
import { Flower2 } from 'lucide-react'

export function WelcomeSection({
  mensaje = 'Queridos amigos y familia, no hay nada que nos haga más ilusión que compartir el día más importante de nuestras vidas con las personas que nos han visto crecer y amarnos. Queremos que esta celebración sea un reflejo de nuestra gratitud por vuestro cariño incondicional. Os esperamos paraivar por el amor, la risa y el futuro.',
}) {
  return (
    <Section id='historia' className='bg-surface-container-low relative'>
      <div className='max-w-3xl mx-auto text-center'>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className='text-xs uppercase tracking-[0.3em] text-tertiary mb-8 block'
        >
          Bienvenidos
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className='text-4xl md:text-5xl font-serif text-primary mb-12 italic'
        >
          Nuestra Alegría
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className='text-xl text-secondary leading-loose font-light'
        >
          {mensaje}
        </motion.p>
      </div>
      <div className='absolute top-10 left-10 opacity-5 rotate-45'>
        <Flower2 size={200} className='text-primary' />
      </div>
    </Section>
  )
}
