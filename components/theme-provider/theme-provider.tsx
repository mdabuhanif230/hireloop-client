"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = Exclude<Theme, "system">

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "theme"
const ThemeContext = React.createContext<ThemeContextValue>({
  resolvedTheme: "light",
  setTheme: () => {},
})
const themeListeners = new Set<() => void>()

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"

  const theme = localStorage.getItem(STORAGE_KEY)
  return theme === "light" || theme === "dark" || theme === "system"
    ? theme
    : "system"
}

function getResolvedTheme(): ResolvedTheme {
  const theme = getStoredTheme()
  if (theme !== "system") return theme

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener)
  window.addEventListener("storage", listener)

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  mediaQuery.addEventListener("change", listener)

  return () => {
    themeListeners.delete(listener)
    window.removeEventListener("storage", listener)
    mediaQuery.removeEventListener("change", listener)
  }
}

function setStoredTheme(theme: Theme) {
  localStorage.setItem(STORAGE_KEY, theme)
  themeListeners.forEach((listener) => listener())
}

function ThemeProvider({ children }: React.PropsWithChildren) {
  const resolvedTheme = React.useSyncExternalStore(
    subscribeToTheme,
    getResolvedTheme,
    (): ResolvedTheme => "light"
  )

  const setTheme = React.useCallback((theme: Theme) => {
    setStoredTheme(theme)
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
    document.documentElement.style.colorScheme = resolvedTheme
  }, [resolvedTheme])

  const value = React.useMemo(
    () => ({ resolvedTheme, setTheme }),
    [resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = React.useContext(ThemeContext)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (typeof event.key !== "string" || event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider }
