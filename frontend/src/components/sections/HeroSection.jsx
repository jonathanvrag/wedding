/**
 * HeroSection - Sección hero de la invitación
 * El punto focal visual con los nombres de los novios
 */
import { motion } from 'framer-motion';
import { Flower2 } from 'lucide-react';
import logoSrc from '../../assets/logo.png';

export function HeroSection({
  guestName,
  nombresNovios = 'Jonathan & Valentina',
  fecha = '15 de Junio de 2025',
}) {
  return (
    <section className='relative h-screen flex items-center justify-center overflow-hidden pt-16'>
      <div className='absolute inset-0 z-0'>
        <div className='w-full h-full bg-primary/10' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className='relative z-10 text-center max-w-4xl px-6'>
        {/* Decorative flower - behind navbar */}
        <div className='absolute -top-16 -left-16 opacity-10 pointer-events-none'>
          <Flower2 size={250} className='text-primary stroke-[0.5px]' />
        </div>

        <div className='mb-8 inline-block'>
          <img
            src={logoSrc}
            alt='Logo'
            className='w-36 h-36 object-contain mx-auto'
          />
        </div>
        <h1 className='text-6xl md:text-8xl lg:text-9xl font-serif text-primary mb-8 tracking-tight'>
          {nombresNovios || 'Jonathan & Valentina'}
        </h1>
        <p className='text-2xl md:text-4xl font-serif italic text-secondary mb-8'>
          {fecha || '15 de Junio de 2025'}
        </p>
        <div className='h-px w-32 bg-primary/30 mx-auto mb-12' />
        <p className='text-xl md:text-2xl font-light text-secondary mb-16 max-w-2xl mx-auto leading-relaxed'>
          <span className='italic font-light'>"Andábamos sin buscarnos, pero sabiendo<br/>que andábamos para encontrarnos."</span>
          <span className='block text-base md:text-lg mt-4 tracking-wider'>— Julio Cortázar</span>
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() =>
            document
              .getElementById('rsvp')
              ?.scrollIntoView({ behavior: 'smooth' })
          }
          className='bg-primary text-surface px-14 py-6 rounded-full text-sm font-bold tracking-widest uppercase shadow-xl hover:shadow-2xl transition-all duration-300 inline-block'>
          Confirmar asistencia
        </motion.button>
      </motion.div>
    </section>
  );
}
