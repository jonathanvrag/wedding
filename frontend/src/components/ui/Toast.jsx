import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

let toastId = 0
let addToastFn = null

export function toast(message, type = 'success') {
  if (addToastFn) addToastFn({ id: ++toastId, message, type })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((t) => {
    setToasts((prev) => [...prev, t])
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== t.id))
    }, 3000)
  }, [])

  useEffect(() => {
    addToastFn = addToast
    return () => { addToastFn = null }
  }, [addToast])

  const icon = {
    success: '✓',
    error: '✗',
  }

  const bg = {
    success: 'bg-success/15 text-success border border-success/25',
    error: 'bg-error/15 text-error border border-error/25',
  }

  return (
    <div className='fixed bottom-6 right-6 z-[100] flex flex-col gap-2'>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 min-w-[280px] ${bg[t.type]}`}
          >
            <span className='text-lg leading-none'>{icon[t.type]}</span>
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
