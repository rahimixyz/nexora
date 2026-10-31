import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Mode = 'light' | 'dark'
export type Accent = 'red' | 'blue' | 'violet' | 'emerald' | 'amber'

export const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: 'red', label: 'Red', swatch: '#e11d48' },
  { id: 'blue', label: 'Blue', swatch: '#2563eb' },
  { id: 'violet', label: 'Violet', swatch: '#7c3aed' },
  { id: 'emerald', label: 'Emerald', swatch: '#059669' },
  { id: 'amber', label: 'Amber', swatch: '#d97706' },
]

interface ThemeState {
  mode: Mode
  accent: Accent
  setMode: (m: Mode) => void
  toggleMode: () => void
  setAccent: (a: Accent) => void
}

const ThemeContext = createContext<ThemeState | null>(null)

// localStorage can be unavailable (private mode, sandboxed iframes), so every access is guarded.
function read<T extends string>(key: string, fallback: T): T {
  try {
    return (localStorage.getItem(key) as T) || fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => read<Mode>('nexora-mode', 'light'))
  const [accent, setAccent] = useState<Accent>(() => read<Accent>('nexora-accent', 'red'))

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    write('nexora-mode', mode)
  }, [mode])

  useEffect(() => {
    document.documentElement.dataset.accent = accent
    write('nexora-accent', accent)
  }, [accent])

  return (
    <ThemeContext.Provider
      value={{
        mode,
        accent,
        setMode,
        setAccent,
        toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
