import { useRef, useState, useEffect } from 'react'
import { Music, VolumeX } from 'lucide-react'

export function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)

  useEffect(() => {
    if (!src || !audioRef.current) return

    const tryAutoplay = () => {
      audioRef.current.volume = 0.3
      audioRef.current.loop = true
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }

    if (userInteracted) {
      tryAutoplay()
    } else {
      const handler = () => {
        setUserInteracted(true)
        tryAutoplay()
        document.removeEventListener('click', handler)
        document.removeEventListener('touchstart', handler)
      }
      document.addEventListener('click', handler)
      document.addEventListener('touchstart', handler)
      return () => {
        document.removeEventListener('click', handler)
        document.removeEventListener('touchstart', handler)
      }
    }
  }, [src, userInteracted])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  if (!src) return null

  return (
    <>
      <audio ref={audioRef} src={src} preload='auto' />
      <button
        onClick={toggle}
        className='fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-surface-container-lowest shadow-lg flex items-center justify-center hover:scale-105 transition-all'
        title={playing ? 'Pausar música' : 'Reproducir música'}
      >
        {playing ? <Music className='w-5 h-5 text-primary' /> : <VolumeX className='w-5 h-5 text-secondary' />}
      </button>
    </>
  )
}
