import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LangContext'

export default function TopBar() {
  const { theme, toggle: toggleTheme } = useTheme()
  const { lang, toggle: toggleLang }   = useLanguage()

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span className="logo-wem">Wem</span><span className="logo-mer">mer</span>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button className="topbar-btn lang-btn" onClick={toggleLang} title="เปลี่ยนภาษา / Change language">
          {lang === 'th' ? 'EN' : 'ไทย'}
        </button>
        <button className="topbar-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
