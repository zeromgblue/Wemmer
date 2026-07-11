import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function TopBar() {
  const { theme, toggle } = useTheme()

  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span className="logo-wem">Wem</span><span className="logo-mer">mer</span>
      </div>

      <button className="topbar-btn" onClick={toggle} title="Toggle theme">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  )
}
