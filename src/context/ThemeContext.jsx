import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('wemmer-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('wemmer-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark') }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
