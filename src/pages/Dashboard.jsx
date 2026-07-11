import { useState, useEffect, useMemo } from 'react'
import { format, subDays, startOfMonth, eachDayOfInterval } from 'date-fns'
import { th as thLocale } from 'date-fns/locale'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Check, CheckCircle2, ListTodo, Timer, Flame, X } from 'lucide-react'
import { db } from '../lib/storage'
import { useLanguage } from '../context/LangContext'

const todayStr = () => format(new Date(), 'yyyy-MM-dd')

function AddTaskModal({ onClose, onAdd, t }) {
  const [title, setTitle] = useState('')
  const [date,  setDate]  = useState(todayStr())
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-accent-bar" />
        <div className="modal-inner">
          <div className="modal-header">
            <h2>{t('addNewTask')}</h2>
            <button className="btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
          <div className="modal-body">
            <div>
              <label className="label">{t('taskName')}</label>
              <input className="input" placeholder={t('taskPlaceholder')} value={title}
                onChange={e => setTitle(e.target.value)} autoFocus
                onKeyDown={e => e.key === 'Enter' && title.trim() && onAdd({ title: title.trim(), date })} />
            </div>
            <div>
              <label className="label">{t('dateLabel')}</label>
              <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>{t('cancelBtn')}</button>
            <button className="btn btn-primary" onClick={() => title.trim() && onAdd({ title: title.trim(), date })}>
              <Plus size={15} /> {t('addTaskBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { t, lang } = useLanguage()
  const dateLocale   = lang === 'th' ? thLocale : undefined

  const [tasks,     setTasks]     = useState([])
  const [habits,    setHabits]    = useState([])
  const [sessions,  setSessions]  = useState([])
  const [allTasks,  setAllTasks]  = useState([])
  const [showModal, setShowModal] = useState(false)
  const [period,    setPeriod]    = useState('week')

  useEffect(() => { loadAll() }, [])

  function loadAll() {
    const today     = todayStr()
    const rawTasks  = db.tasks.getAll()
    const allLogs   = db.habitLogs.getAll()
    const allSess   = db.sessions.getAll()
    const allHabits = db.habits.getAll()

    setAllTasks(rawTasks)
    setTasks(rawTasks.filter(t => t.date === today).sort((a, b) => a.order_index - b.order_index))
    setSessions(allSess.filter(s => s.completed_at.startsWith(today)))
    setHabits(allHabits.map(h => ({
      ...h,
      doneToday: allLogs.some(l => l.habit_id === h.id && l.date === today),
    })))
  }

  function addTask({ title, date }) {
    const today  = todayStr()
    const record = db.tasks.insert({ title, date, completed: false, order_index: tasks.length })
    if (date === today) setTasks(prev => [...prev, record])
    setAllTasks(prev => [...prev, record])
    setShowModal(false)
  }

  function toggleTask(task) {
    db.tasks.update(task.id, { completed: !task.completed })
    setTasks(prev => prev.map(tk => tk.id === task.id ? { ...tk, completed: !tk.completed } : tk))
    setAllTasks(prev => prev.map(tk => tk.id === task.id ? { ...tk, completed: !tk.completed } : tk))
  }

  function deleteTask(id) {
    db.tasks.delete(id)
    setTasks(prev => prev.filter(tk => tk.id !== id))
    setAllTasks(prev => prev.filter(tk => tk.id !== id))
  }

  const todayDone  = tasks.filter(tk => tk.completed).length
  const todayTotal = tasks.length
  const habitsDone = habits.filter(h => h.doneToday).length

  const chartData = useMemo(() => {
    const doneKey  = t('completed')
    const totalKey = t('total')

    if (period === 'week') {
      return Array.from({ length: 7 }, (_, i) => {
        const d   = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
        const day = allTasks.filter(tk => tk.date === d)
        return {
          day: format(subDays(new Date(), 6 - i), 'EEE', { locale: dateLocale }),
          [totalKey]: day.length,
          [doneKey]:  day.filter(tk => tk.completed).length,
        }
      })
    }
    if (period === 'month') {
      const start = startOfMonth(new Date())
      return eachDayOfInterval({ start, end: new Date() }).map(date => {
        const d   = format(date, 'yyyy-MM-dd')
        const day = allTasks.filter(tk => tk.date === d)
        return {
          day: format(date, 'd'),
          [totalKey]: day.length,
          [doneKey]:  day.filter(tk => tk.completed).length,
        }
      })
    }
    // today
    const d   = todayStr()
    const day = allTasks.filter(tk => tk.date === d)
    return [
      { day: t('completed'), [totalKey]: 0, [doneKey]: day.filter(tk => tk.completed).length },
      { day: lang === 'th' ? 'ค้างอยู่' : 'Pending', [totalKey]: day.filter(tk => !tk.completed).length, [doneKey]: 0 },
    ]
  }, [allTasks, period, lang])

  const doneKey  = t('completed')
  const totalKey = t('total')

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>{t('welcome')} 👋</h1>
          <p style={{ marginTop: 4 }}>
            {format(new Date(), 'EEEE, d MMMM yyyy', { locale: dateLocale })}
          </p>
        </div>
      </div>

      {/* CTA Card */}
      <div className="cta-card" onClick={() => setShowModal(true)}>
        <div>
          <div className="cta-title">{t('ctaTitle')}</div>
          <div className="cta-sub">{t('ctaSub')}</div>
        </div>
        <div className="cta-plus">
          <Plus size={24} strokeWidth={2.5} />
        </div>
      </div>

      {/* Today's tasks */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>{t('todayTasks')}</h3>
          <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
            {todayDone}/{todayTotal} {t('doneOf')}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <CheckCircle2 size={32} style={{ opacity: 0.3 }} />
            <p style={{ marginTop: 8, fontSize: 13 }}>{t('noTasksToday')}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tasks.map(task => (
              <div key={task.id} className={`task-item${task.completed ? ' completed' : ''}`}>
                <div className={`checkbox${task.completed ? ' checked' : ''}`} onClick={() => toggleTask(task)}>
                  {task.completed && <Check size={12} color="white" strokeWidth={3} />}
                </div>
                <span className="task-title">{task.title}</span>
                <div className="task-actions">
                  <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => deleteTask(task.id)}>
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { icon: ListTodo,     value: todayTotal,               label: t('statTasks'),  bg: 'var(--accent-bg)',  color: 'var(--accent)'  },
          { icon: CheckCircle2, value: todayDone,                label: t('statDone'),   bg: 'var(--green-bg)',   color: 'var(--green)'   },
          { icon: Flame,        value: `${habitsDone}/${habits.length}`, label: t('statHabits'), bg: 'var(--orange-bg)', color: 'var(--orange)'  },
          { icon: Timer,        value: sessions.length,          label: t('statTimer'),  bg: 'var(--accent-bg)',  color: 'var(--accent)'  },
        ].map(({ icon: Icon, value, label, bg, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: bg, color }}><Icon size={20} /></div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3>{t('progress')}</h3>
          <select className="chart-period-select" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="today">{t('periodToday')}</option>
            <option value="week">{t('periodWeek')}</option>
            <option value="month">{t('periodMonth')}</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={4} barCategoryGap={period === 'month' ? '20%' : '35%'}>
            <XAxis dataKey="day"
              tick={{ fontSize: period === 'month' ? 10 : 12, fill: 'var(--text-2)' }}
              axisLine={false} tickLine={false}
              interval={period === 'month' ? 3 : 0} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13 }}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey={totalKey} fill="var(--bg-3)"   radius={[4,4,0,0]} />
            <Bar dataKey={doneKey}  fill="var(--accent)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} onAdd={addTask} t={t} />}
    </div>
  )
}
