import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, isSameDay } from 'date-fns'
import { th as thLocale } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Plus, Check, X, GripVertical } from 'lucide-react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { db } from '../lib/storage'
import { useLanguage } from '../context/LangContext'

function SortableTask({ task, onToggle, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className={`task-item${task.completed ? ' completed' : ''}`}
    >
      <button style={{ background: 'none', border: 'none', cursor: 'grab', color: 'var(--text-3)', padding: '0 2px', display: 'flex' }}
        {...attributes} {...listeners}>
        <GripVertical size={14} />
      </button>
      <div className={`checkbox${task.completed ? ' checked' : ''}`} onClick={() => onToggle(task)}>
        {task.completed && <Check size={12} color="white" strokeWidth={3} />}
      </div>
      <span className="task-title" style={{ flex: 1 }}>{task.title}</span>
      <div className="task-actions">
        <button className="btn-icon" style={{ width: 28, height: 28 }} onClick={() => onDelete(task.id)}>
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

function AddTaskModal({ date, onClose, onAdd, t }) {
  const [title, setTitle] = useState('')
  const { lang } = useLanguage()
  const dateLocale = lang === 'th' ? thLocale : undefined
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-accent-bar" />
        <div className="modal-inner">
          <div className="modal-header">
            <div>
              <h2>{t('addTask')}</h2>
              <p style={{ fontSize: 12, marginTop: 2 }}>
                {format(date, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
              </p>
            </div>
            <button className="btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
          <div className="modal-body">
            <div>
              <label className="label">{t('taskName')}</label>
              <input className="input" placeholder={t('calTaskPlaceholder')} value={title}
                onChange={e => setTitle(e.target.value)} autoFocus
                onKeyDown={e => e.key === 'Enter' && title.trim() && onAdd(title.trim())} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>{t('cancelBtn')}</button>
            <button className="btn btn-primary" onClick={() => title.trim() && onAdd(title.trim())}>
              <Plus size={15} /> {t('addTaskBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const DAY_LABELS_TH = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
const DAY_LABELS_EN = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']

export default function CalendarView() {
  const { t, lang }    = useLanguage()
  const dateLocale     = lang === 'th' ? thLocale : undefined
  const dayLabels      = lang === 'th' ? DAY_LABELS_TH : DAY_LABELS_EN

  const [current,   setCurrent]   = useState(new Date())
  const [selected,  setSelected]  = useState(new Date())
  const [allTasks,  setAllTasks]  = useState([])
  const [dayTasks,  setDayTasks]  = useState([])
  const [showModal, setShowModal] = useState(false)

  const monthStart  = startOfMonth(current)
  const monthEnd    = endOfMonth(current)
  const calDays     = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end:   endOfWeek(monthEnd,     { weekStartsOn: 1 }),
  })
  const selectedStr = format(selected, 'yyyy-MM-dd')
  const startStr    = format(monthStart, 'yyyy-MM-dd')
  const endStr      = format(monthEnd,   'yyyy-MM-dd')

  useEffect(() => {
    const all = db.tasks.getAll().filter(tk => tk.date >= startStr && tk.date <= endStr)
    setAllTasks(all)
  }, [current])

  useEffect(() => {
    setDayTasks(allTasks.filter(tk => tk.date === selectedStr).sort((a, b) => a.order_index - b.order_index))
  }, [selected, allTasks])

  function addTask(title) {
    const record = db.tasks.insert({ title, date: selectedStr, completed: false, order_index: dayTasks.length })
    setAllTasks(prev => [...prev, record])
    setDayTasks(prev => [...prev, record])
    setShowModal(false)
  }

  function toggleTask(task) {
    db.tasks.update(task.id, { completed: !task.completed })
    const upd = tk => tk.id === task.id ? { ...tk, completed: !tk.completed } : tk
    setAllTasks(prev => prev.map(upd))
    setDayTasks(prev => prev.map(upd))
  }

  function deleteTask(id) {
    db.tasks.delete(id)
    setAllTasks(prev => prev.filter(tk => tk.id !== id))
    setDayTasks(prev => prev.filter(tk => tk.id !== id))
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const reordered = arrayMove(
      dayTasks,
      dayTasks.findIndex(tk => tk.id === active.id),
      dayTasks.findIndex(tk => tk.id === over.id)
    )
    reordered.forEach((tk, i) => db.tasks.update(tk.id, { order_index: i }))
    setDayTasks(reordered)
    setAllTasks(prev => [...prev.filter(tk => tk.date !== selectedStr), ...reordered])
  }

  const doneSel  = dayTasks.filter(tk => tk.completed).length
  const totalSel = dayTasks.length

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1>{t('calendarTitle')}</h1>
          <p style={{ marginTop: 4, fontSize: 13 }}>{format(current, 'MMMM yyyy', { locale: dateLocale })}</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-icon" onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1))}>
            <ChevronLeft size={16} />
          </button>
          <button className="btn-icon" onClick={() => setCurrent(new Date())}
            style={{ width: 'auto', padding: '0 14px', fontSize: 13, fontFamily: 'inherit', fontWeight: 500 }}>
            {t('todayBtn')}
          </button>
          <button className="btn-icon" onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1))}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="cal-layout">
        <div className="card" style={{ padding: '20px 16px' }}>
          <div className="calendar-header">
            {dayLabels.map(d => <div key={d} className="cal-day-label">{d}</div>)}
          </div>
          <div className="calendar-grid">
            {calDays.map(day => {
              const dateStr    = format(day, 'yyyy-MM-dd')
              const dayAll     = allTasks.filter(tk => tk.date === dateStr)
              const dayDone    = dayAll.filter(tk => tk.completed).length
              const isSelected = isSameDay(day, selected)
              const todayDay   = isToday(day)
              const inMonth    = isSameMonth(day, current)
              const pct        = dayAll.length > 0 ? (dayDone / dayAll.length) * 100 : 0

              return (
                <div
                  key={dateStr}
                  className={`cal-day${todayDay ? ' today' : ''}${isSelected && !todayDay ? ' selected' : ''}${!inMonth ? ' other-month' : ''}`}
                  onClick={() => setSelected(day)}
                >
                  <div className="cal-day-num">{format(day, 'd')}</div>
                  {dayAll.length > 0 && (
                    <>
                      <div className="cal-task-badge">{dayAll.length}</div>
                      <div className="cal-done-bar">
                        <div className="cal-done-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="card cal-panel" style={{ position: 'sticky', top: 80 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                  {format(selected, 'd')}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 1 }}>
                  {format(selected, 'EEEE, MMMM yyyy', { locale: dateLocale })}
                </div>
              </div>
              <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 13 }}
                onClick={() => setShowModal(true)}>
                <Plus size={14} /> {t('addTask')}
              </button>
            </div>

            {totalSel > 0 && (
              <div style={{ marginTop: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-3)', marginBottom: 6 }}>
                  <span>{doneSel}/{totalSel} {t('doneOf')}</span>
                  <span>{Math.round((doneSel / totalSel) * 100)}%</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(doneSel / totalSel) * 100}%`, background: 'var(--green)', borderRadius: 2, transition: 'width 0.3s' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />

          {dayTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <p style={{ fontSize: 13 }}>{t('noTasksDay')}</p>
            </div>
          ) : (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={dayTasks.map(tk => tk.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {dayTasks.map(task => (
                    <SortableTask key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {showModal && <AddTaskModal date={selected} onClose={() => setShowModal(false)} onAdd={addTask} t={t} />}
    </div>
  )
}
