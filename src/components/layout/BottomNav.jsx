import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, StickyNote, Target, Timer } from 'lucide-react'
import { useLanguage } from '../../context/LangContext'

export default function BottomNav() {
  const { t } = useLanguage()

  const NAV = [
    { to: '/',         icon: Home,         key: 'navHome'     },
    { to: '/calendar', icon: CalendarDays, key: 'navCalendar' },
    { to: '/notes',    icon: StickyNote,   key: 'navNotes'    },
    { to: '/habits',   icon: Target,       key: 'navHabits'   },
    { to: '/focus',    icon: Timer,        key: 'navTimer'    },
  ]

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="bottom-nav-icon"><Icon size={22} /></span>
            <span className="bottom-nav-label">{t(key)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
