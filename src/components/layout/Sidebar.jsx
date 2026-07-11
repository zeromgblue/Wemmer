import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, StickyNote, Target, Timer, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const NAV = [
  { to: '/',         icon: Home,        label: 'Dashboard' },
  { to: '/calendar', icon: CalendarDays, label: 'ปฏิทิน'    },
  { to: '/notes',    icon: StickyNote,  label: 'โน้ต'      },
  { to: '/habits',   icon: Target,      label: 'นิสัย'     },
  { to: '/focus',    icon: Timer,       label: 'โฟกัส'     },
]

export default function Sidebar() {
  const { theme, toggle } = useTheme()

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">wemmer</div>

      <nav className="sidebar-nav">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={toggle}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
    </aside>
  )
}
