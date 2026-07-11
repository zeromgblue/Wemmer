import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LangProvider } from './context/LangContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import CalendarView from './pages/CalendarView'
import Notes from './pages/Notes'
import Habits from './pages/Habits'
import Focus from './pages/Focus'

export default function App() {
  return (
    <LangProvider>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/focus" element={<Focus />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </LangProvider>
  )
}
