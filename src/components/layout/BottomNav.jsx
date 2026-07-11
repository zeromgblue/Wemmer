import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, StickyNote, Target, Timer } from 'lucide-react'

const NAV = [
  { to: '/',         icon: Home,         label: 'หน้าหลัก' },
  { to: '/calendar', icon: CalendarDays, label: 'ปฏิทิน'  },
  { to: '/notes',    icon: StickyNote,   label: 'โน้ต'    },
  { to: '/habits',   icon: Target,       label: 'กิจกรรม' },
  { to: '/focus',    icon: Timer,        label: 'จับเวลา' },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="bottom-nav-icon"><Icon size={22} /></span>
            <span className="bottom-nav-label">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
