import { createContext, useContext, useEffect, useState } from 'react'
import { createT } from '../lib/translations'

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('wemmer-lang') || 'th')

  useEffect(() => {
    localStorage.setItem('wemmer-lang', lang)
    document.documentElement.setAttribute('data-lang', lang)
    document.documentElement.style.fontFamily =
      lang === 'en'
        ? "'Space Grotesk', system-ui, sans-serif"
        : "'Kanit', system-ui, sans-serif"
  }, [lang])

  const t      = createT(lang)
  const toggle = () => setLang(l => l === 'th' ? 'en' : 'th')

  return (
    <LangContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLanguage = () => useContext(LangContext)
