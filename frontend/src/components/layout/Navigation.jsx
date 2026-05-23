/**
 * Navigation - Barra de navegación fija
 * Es un molecule que usa organism para los links
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Flower2 } from 'lucide-react'

const navLinks = [
  { name: 'Historia', href: '#historia' },
  { name: 'Detalles', href: '#detalles' },
  { name: 'Ubicación', href: '#ubicacion' },
  { name: 'Alojamiento', href: '#alojamiento' },
]

export function Navigation({ onRsvpClick, nombresNovios = 'Jonathan & Valentina' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className='fixed top-0 w-full z-50 glass-nav border-b border-primary/5'>
      <div className='flex justify-between items-center px-8 py-5 max-w-7xl mx-auto'>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='text-3xl font-serif italic text-primary text-left'
        >
          {nombresNovios}
        </motion.button>

        <div className='hidden md:flex space-x-10 items-center'>
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              className='tracking-widest uppercase text-xs text-secondary hover:text-primary transition-colors duration-300'
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={onRsvpClick}
            className='bg-primary text-surface px-8 py-3 rounded-full tracking-widest uppercase text-xs font-bold hover:opacity-90 transition-opacity'
          >
            RSVP
          </button>
        </div>

        <button
          className='md:hidden text-primary'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='md:hidden bg-surface border-b border-primary/5 p-8 flex flex-col space-y-6 text-center'
          >
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className='tracking-widest uppercase text-base text-secondary'
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false)
                onRsvpClick()
              }}
              className='bg-primary text-surface px-8 py-4 rounded-full tracking-widest uppercase text-base font-bold'
            >
              RSVP
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
