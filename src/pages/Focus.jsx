import { useState, useEffect, useRef, useCallback } from 'react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { Play, Pause, RotateCcw, Check, Bell, BellOff } from 'lucide-react'
import { db } from '../lib/storage'

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [660, 880, 1100]
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.frequency.value = freq; osc.type = 'sine'
      gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.25)
      osc.start(ctx.currentTime + i * 0.3)
      osc.stop(ctx.currentTime + i * 0.3 + 0.25)
    })
  } catch {}
}

function sendNotif(label) {
  if (Notification?.permission !== 'granted') return
  new Notification('⏱ Wemmer — หมดเวลาแล้ว!', {
    body: label ? `"${label}" ครบเวลาแล้ว` : 'จับเวลาเสร็จแล้ว',
    icon: '/vite.svg',
    tag:  'wemmer-timer',
  })
}

export default function Focus() {
  const [label,     setLabel]     = useState('')
  const [hrs,       setHrs]       = useState(0)
  const [mins,      setMins]      = useState(25)
  const [secs,      setSecs]      = useState(0)
  const [total,     setTotal]     = useState(25 * 60)
  const [remaining, setRemaining] = useState(25 * 60)
  const [running,   setRunning]   = useState(false)
  const [finished,  setFinished]  = useState(false)
  const [notifOk,   setNotifOk]   = useState(() => Notification?.permission === 'granted')
  const [sessions,  setSessions]  = useState([])

  const intervalRef = useRef(null)
  const totalRef    = useRef(25 * 60)
  const labelRef    = useRef('')
  const today       = format(new Date(), 'yyyy-MM-dd')

  const isPaused  = !running && remaining < total && remaining > 0 && !finished
  const isSetup   = !running && !isPaused && !finished

  useEffect(() => {
    setSessions(db.sessions.getAll().filter(s => s.completed_at?.startsWith(today)))
  }, [])

  const handleFinish = useCallback(() => {
    clearInterval(intervalRef.current)
    playBeep()
    sendNotif(labelRef.current)
    const record = db.sessions.insert({
      task_id:          null,
      task_title:       labelRef.current || 'ไม่ระบุ',
      work_minutes:     Math.ceil(totalRef.current / 60),
      duration_seconds: totalRef.current,
    })
    setSessions(prev => [record, ...prev])
    setFinished(true)
    setRunning(false)
  }, [])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { handleFinish(); return 0 }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, handleFinish])

  function setPreset(h, m, s) {
    const t = h * 3600 + m * 60 + s
    setHrs(h); setMins(m); setSecs(s)
    setTotal(t); setRemaining(t)
  }

  function updateTime(h, m, s) {
    const t = h * 3600 + m * 60 + s
    setTotal(t); setRemaining(t)
  }

  function handleMainBtn() {
    if (finished) { reset(); return }
    if (running)  { setRunning(false); return }
    if (isPaused) { setRunning(true);  return }
    const t = hrs * 3600 + mins * 60 + secs
    if (t === 0) return
    totalRef.current = t
    labelRef.current = label
    setTotal(t); setRemaining(t)
    setRunning(true)
  }

  function reset() {
    clearInterval(intervalRef.current)
    setRunning(false); setFinished(false)
    const t = hrs * 3600 + mins * 60 + secs || 25 * 60
    setTotal(t); setRemaining(t)
  }

  async function toggleNotif() {
    if (notifOk) { setNotifOk(false); return }
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifOk(perm === 'granted')
  }

  const radius     = 110
  const circ       = 2 * Math.PI * radius
  const progress   = total > 0 ? remaining / total : 1
  const dashOffset = circ * progress
  const showHours  = total >= 3600

  const dispH  = String(Math.floor(remaining / 3600)).padStart(2, '0')
  const dispM  = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0')
  const dispS  = String(remaining % 60).padStart(2, '0')
  const timeStr = showHours ? `${dispH}:${dispM}:${dispS}` : `${dispM}:${dispS}`

  const mainDisabled = isSetup && (hrs * 3600 + mins * 60 + secs) === 0

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>จับเวลา</h1>
        <button className="btn-icon" onClick={toggleNotif}
          title={notifOk ? 'ปิดการแจ้งเตือน' : 'เปิดการแจ้งเตือน'}>
          {notifOk
            ? <Bell size={18} color="var(--accent)" />
            : <BellOff size={18} />}
        </button>
      </div>

      <div className="focus-page">

        {/* Activity label */}
        {isSetup && (
          <div style={{ width: '100%', maxWidth: 400 }}>
            <input className="input" placeholder="กำลังจับเวลาทำอะไร? เช่น อ่านหนังสือ, ออกกำลังกาย..."
              value={label} onChange={e => setLabel(e.target.value)}
              style={{ textAlign: 'center', fontSize: 15 }} />
          </div>
        )}

        {(running || isPaused) && labelRef.current && (
          <div style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500, letterSpacing: 0.3 }}>
            กำลัง: <span style={{ color: 'var(--accent)' }}>{labelRef.current}</span>
          </div>
        )}

        {/* Time digit inputs — only in setup state */}
        {isSetup && (
          <div className="time-digits">
            <div className="time-digit-col">
              <input type="number" min={0} max={99} className="time-digit-input" value={hrs}
                onChange={e => { const v = Math.max(0, parseInt(e.target.value) || 0); setHrs(v); updateTime(v, mins, secs) }} />
              <span className="time-digit-label">ชม.</span>
            </div>
            <span className="time-digit-sep">:</span>
            <div className="time-digit-col">
              <input type="number" min={0} max={59} className="time-digit-input" value={mins}
                onChange={e => { const v = Math.min(59, Math.max(0, parseInt(e.target.value) || 0)); setMins(v); updateTime(hrs, v, secs) }} />
              <span className="time-digit-label">นาที</span>
            </div>
            <span className="time-digit-sep">:</span>
            <div className="time-digit-col">
              <input type="number" min={0} max={59} className="time-digit-input" value={secs}
                onChange={e => { const v = Math.min(59, Math.max(0, parseInt(e.target.value) || 0)); setSecs(v); updateTime(hrs, mins, v) }} />
              <span className="time-digit-label">วิ.</span>
            </div>
          </div>
        )}

        {/* Quick presets */}
        {isSetup && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: '5 นาที',    h: 0, m: 5,  s: 0 },
              { label: '10 นาที',   h: 0, m: 10, s: 0 },
              { label: '25 นาที',   h: 0, m: 25, s: 0 },
              { label: '45 นาที',   h: 0, m: 45, s: 0 },
              { label: '1 ชั่วโมง', h: 1, m: 0,  s: 0 },
            ].map(p => (
              <button key={p.label} className="btn btn-ghost"
                style={{ fontSize: 13, padding: '6px 14px' }}
                onClick={() => setPreset(p.h, p.m, p.s)}>
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* SVG Ring */}
        <div className="timer-ring">
          <svg width="260" height="260" viewBox="0 0 260 260">
            <circle cx="130" cy="130" r={radius} fill="none"
              stroke="var(--bg-3)" strokeWidth="12" />
            <circle cx="130" cy="130" r={radius} fill="none"
              stroke={finished ? 'var(--green)' : 'var(--accent)'}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ - dashOffset}
              style={{
                transition: running ? 'stroke-dashoffset 1s linear' : 'none',
                transform: 'rotate(-90deg)', transformOrigin: '130px 130px',
              }}
            />
          </svg>
          <div className="timer-text">
            {finished ? (
              <>
                <div style={{ fontSize: 40, lineHeight: 1 }}>✅</div>
                <div className="timer-mode" style={{ color: 'var(--green)', marginTop: 8, fontSize: 15 }}>
                  ครบเวลาแล้ว!
                </div>
              </>
            ) : (
              <>
                <div className="timer-time">{timeStr}</div>
                {isPaused && (
                  <div className="timer-mode" style={{ color: 'var(--orange)' }}>หยุดชั่วคราว</div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="timer-controls">
          <button className="timer-btn timer-btn-secondary" onClick={reset} title="รีเซ็ต">
            <RotateCcw size={20} />
          </button>
          <button className="timer-btn timer-btn-primary"
            onClick={handleMainBtn} disabled={mainDisabled}
            style={{ opacity: mainDisabled ? 0.35 : 1 }}>
            {running
              ? <Pause size={28} />
              : finished
                ? <RotateCcw size={26} />
                : <Play size={28} />}
          </button>
        </div>

        {/* Notification hint when not enabled */}
        {isSetup && !notifOk && 'Notification' in window && (
          <button className="btn btn-ghost" style={{ fontSize: 12, gap: 6 }} onClick={toggleNotif}>
            <Bell size={14} /> เปิดการแจ้งเตือนเมื่อครบเวลา
          </button>
        )}

        {/* Session log */}
        {sessions.length > 0 && (
          <div style={{ width: '100%', maxWidth: 480 }}>
            <p className="section-title">บันทึกวันนี้ ({sessions.length})</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessions.map(s => {
                const dur = s.duration_seconds || (s.work_minutes * 60) || 0
                const dM  = String(Math.floor(dur / 60)).padStart(2, '0')
                const dS  = String(dur % 60).padStart(2, '0')
                return (
                  <div key={s.id} className="card"
                    style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--green-bg)', color: 'var(--green)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Check size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                        {s.task_title ?? 'ไม่ระบุ'}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                        {dM}:{dS} • {format(new Date(s.completed_at), 'HH:mm น.', { locale: th })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
