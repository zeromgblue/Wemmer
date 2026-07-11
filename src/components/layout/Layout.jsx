import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="app-shell">
      <div className="bg-orbs" aria-hidden="true">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>
      <TopBar />
      <main className="page-content animate-in"><Outlet /></main>
      <BottomNav />
    </div>
  )
}
