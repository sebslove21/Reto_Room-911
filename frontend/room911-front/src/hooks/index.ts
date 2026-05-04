import { useState, useEffect, useCallback } from 'react'

export function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open  = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(v => !v), [])
  return { isOpen, open, close, toggle }
}

export function useTimer(startTime: string | null): string {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    if (!startTime) return
    const start = new Date(startTime).getTime()
    const tick = () => setElapsed(
      Math.floor((Date.now() - start) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startTime])
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}