"use client"

import { useCallback, useRef, useSyncExternalStore } from "react"

const CHANGE_EVENT = "hireloop:demo-storage-change"

/** Small browser-only persistence seam for the client demo screens. */
export function useDemoStorage<T>(key: string, initialValue: T) {
  const initialRef = useRef(initialValue)
  const cache = useRef<{ raw: string | null; value: T }>({ raw: null, value: initialValue })

  const getSnapshot = useCallback(() => {
    const raw = window.localStorage.getItem(key)
    if (raw === cache.current.raw) return cache.current.value
    try {
      cache.current = { raw, value: raw ? JSON.parse(raw) as T : initialRef.current }
    } catch {
      cache.current = { raw: null, value: initialRef.current }
      window.localStorage.removeItem(key)
    }
    return cache.current.value
  }, [key])

  const getServerSnapshot = useCallback(() => initialRef.current, [])
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("storage", callback)
    window.addEventListener(CHANGE_EVENT, callback)
    return () => {
      window.removeEventListener("storage", callback)
      window.removeEventListener(CHANGE_EVENT, callback)
    }
  }, [])
  const subscribeReady = useCallback((callback: () => void) => {
    queueMicrotask(callback)
    return () => {}
  }, [])
  const getReadySnapshot = useCallback(() => true, [])
  const getReadyServerSnapshot = useCallback(() => false, [])

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ready = useSyncExternalStore(subscribeReady, getReadySnapshot, getReadyServerSnapshot)

  const setValue = useCallback((next: T | ((current: T) => T)) => {
    const current = getSnapshot()
    const resolved = typeof next === "function" ? (next as (current: T) => T)(current) : next
    const raw = JSON.stringify(resolved)
    window.localStorage.setItem(key, raw)
    cache.current = { raw, value: resolved }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [getSnapshot, key])

  return [value, setValue, ready] as const
}
