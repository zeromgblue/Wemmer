import { useState, useEffect } from 'react'
import { format, subDays, eachDayOfInterval } from 'date-fns'
import { Plus, Check, X, Flame } from 'lucide-react'
import { db } from '../lib/storage'
import { useLanguage } from '../context/LangContext'

const COLORS = ['#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#db2777']

function calcStreak(logs) {
  if (!logs.length) return 0
  const dates  = [...new Set(logs.map(l => l.date))].sort((a, b) => b.localeCompare(a))
  const todayS = format(new Date(), 'yyyy-MM-dd')
  const yestS  = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  if (dates[0] !== todayS && dates[0] !== yestS) return 0
  let streak = 0
  let check  = dates[0]
  for (const d of dates) {
    if (d === check) {
      streak++
      check = format(subDays(new Date(check + 'T12:00:00'), 1), 'yyyy-MM-dd')
    } else break
  }
  return streak
}

function AddModal({ onClose, onAdd, t }) {
  const [name,  setName]  = useState('')
  const [color, setColor] = useState(COLORS[0])
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-accent-bar" />
        <div className="modal-inner">
          <div className="modal-header">
            <h2>{t('addHabitTitle')}</h2>
            <button className="btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
          <div className="modal-body">
            <div>
              <label className="label">{t('habitNameLabel')}</label>
              <input className="input" placeholder={t('habitPH')} value={name}
                onChange={e => setName(e.target.value)} autoFocus
                onKeyDown={e => e.key === 'Enter' && name.trim() && onAdd({ name: name.trim(), color })} />
            </div>
            <div>
              <label className="label">{t('colorLabel')}</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)} style={{
                    width: 32, height: 32, borderRadius: '50%', background: c,
                    border: 'none', cursor: 'pointer',
                    outline: color === c ? `3px solid ${c}` : 'none', outlineOffset: 3,
                    transition: 'transform 0.15s', transform: color === c ? 'scale(1.2)' : 'scale(1)',
                  }} />
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>{t('cancelBtn')}</button>
            <button className="btn btn-primary" onClick={() => name.trim() && onAdd({ name: name.trim(), color })}>
              <Plus size={15} /> {t('addHabitBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Habits() {
  const { t, lang }    = useLanguage()
  const [habits,    setHabits]    = useState([])
  const [allLogs,   setAllLogs]   = useState([])
  const [showModal, setShowModal] = useState(false)
  const today  = format(new Date(), 'yyyy-MM-dd')
  const last30 = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() })
    .map(d => format(d, 'yyyy-MM-dd'))

  useEffect(() => {
    setHabits(db.habits.getAll())
    setAllLogs(db.habitLogs.getAll())
  }, [])

  function toggleToday(habit) {
    const existing = allLogs.find(l => l.habit_id === habit.id && l.date === today)
    if (existing) {
      db.habitLogs.delete(existing.id)
      setAllLogs(prev => prev.filter(l => l.id !== existing.id))
    } else {
      const record = db.habitLogs.insert({ habit_id: habit.id, date: today })
      setAllLogs(prev => [...prev, record])
    }
  }

  function addHabit({ name, color }) {
    const record = db.habits.insert({ name, color })
    setHabits(prev => [...prev, record])
    setShowModal(false)
  }

  function deleteHabit(id) {
    if (!confirm(lang === 'th' ? 'ลบกิจกรรมนี้?' : 'Delete this activity?')) return
    db.habits.delete(id)
    setHabits(prev => prev.filter(h => h.id !== id))
    setAllLogs(prev => prev.filter(l => l.habit_id !== id))
  }

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>{t('habitsTitle')}</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> {t('addHabitBtn')}
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <p style={{ fontWeight: 500, color: 'var(--text-2)', marginBottom: 6 }}>{t('noHabitsLine1')}</p>
          <p style={{ fontSize: 13 }}>{t('noHabitsLine2')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {habits.map(habit => {
            const logs      = allLogs.filter(l => l.habit_id === habit.id)
            const doneToday = logs.some(l => l.date === today)
            const streak    = calcStreak(logs)
            return (
              <div key={habit.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: habit.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{habit.name}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={14} color="var(--orange)" /> {streak} {t('daysUnit')}
                  </span>
                  <button className={`habit-check-btn${doneToday ? ' done' : ''}`} onClick={() => toggleToday(habit)}>
                    {doneToday && <Check size={14} />}
                  </button>
                  <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => deleteHabit(habit.id)}>
                    <X size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {last30.map(d => (
                    <div key={d} title={d} style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: logs.some(l => l.date === d) ? habit.color : 'var(--bg-3)',
                      transition: 'background 0.2s',
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{t('last30')}</div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={addHabit} t={t} />}
    </div>
  )
}
