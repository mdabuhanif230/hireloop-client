"use client"

import { useEffect, useState } from "react"

/** Local-state debounce for the dashboard search boxes: the input stays
 *  responsive while the API request waits for a pause in typing. */
export function useDebouncedValue<T>(value: T, delayMs = 250) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
