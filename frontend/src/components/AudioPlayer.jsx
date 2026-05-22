import { useRef, useState, useEffect } from 'react'
import { Music, VolumeX } from 'lucide-react'

export function AudioPlayer({ src }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!src || !audioRef.current) return

    let started = false

    const play = () => {
      if (started) return
      started = true
      audioRef.current.volume = 0.3
      audioRef.current.loop = true
      audioRef.current.play()
        .then(() => {
          setPlaying(true)
          document.removeEventListener('click', handleClick)
          document.removeEventListener('scroll', handleScroll)
        })
        .catch(() => { started = false })
    }

    const handleClick = () => play()

    const handleScroll = () => {
      audioRef.current.volume = 0.3
      audioRef.current.loop = true
      audioRef.current.play()
        .then(() => {
          setPlaying(true)
          document.removeEventListener('click', handleClick)
          document.removeEventListener('scroll', handleScroll)
          started = true
        })
        .catch(() => {})
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [src])

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
        className='fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center hover:scale-105 transition-all'
        title={playing ? 'Pausar música' : 'Reproducir música'}
      >
        {playing ? <Music className='w-5 h-5 text-surface' /> : <VolumeX className='w-5 h-5 text-surface' />}
      </button>
    </>
  )
}
