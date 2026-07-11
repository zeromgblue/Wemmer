import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { th as thLocale } from 'date-fns/locale'
import { Plus, Search, X } from 'lucide-react'
import { db } from '../lib/storage'
import { useLanguage } from '../context/LangContext'

function NoteModal({ note, onClose, onSave, t }) {
  const [title,   setTitle]   = useState(note?.title   ?? '')
  const [content, setContent] = useState(note?.content ?? '')
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-accent-bar" />
        <div className="modal-inner">
          <div className="modal-header">
            <h2>{note?.id ? t('editNote') : t('newNote')}</h2>
            <button className="btn-icon" onClick={onClose}><X size={16} /></button>
          </div>
          <div className="modal-body">
            <div>
              <label className="label">{t('noteTitleLabel')}</label>
              <input className="input" placeholder={t('noteTitlePH')} value={title}
                onChange={e => setTitle(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="label">{t('noteContentLabel')}</label>
              <textarea className="input" placeholder={t('noteContentPH')} value={content}
                onChange={e => setContent(e.target.value)} rows={7} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>{t('cancelBtn')}</button>
            <button className="btn btn-primary"
              onClick={() => title.trim() && onSave({ ...note, title: title.trim(), content })}>
              {note?.id ? t('saveBtn') : t('createBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Notes() {
  const { t, lang }  = useLanguage()
  const dateLocale   = lang === 'th' ? thLocale : undefined
  const [notes,  setNotes]  = useState([])
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(null)

  useEffect(() => { setNotes(db.notes.getAll()) }, [])

  function saveNote(note) {
    if (note.id) {
      const updated = db.notes.update(note.id, { title: note.title, content: note.content })
      setNotes(prev => prev.map(n => n.id === updated.id ? updated : n))
    } else {
      const record = db.notes.insert({ title: note.title, content: note.content })
      setNotes(prev => [record, ...prev])
    }
    setModal(null)
  }

  function deleteNote(id, e) {
    e.stopPropagation()
    if (!confirm(lang === 'th' ? 'ลบโน้ตนี้?' : 'Delete this note?')) return
    db.notes.delete(id)
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.content ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1>{t('notesTitle')}</h1>
        <button className="btn btn-primary" onClick={() => setModal({})}>
          <Plus size={16} /> {t('newNote')}
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
        <input className="input" placeholder={t('searchPlaceholder')} value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 38 }} />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>{search ? t('noNotesSearch') : t('noNotes')}</p>
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map(note => (
            <div key={note.id} className="note-card" onClick={() => setModal(note)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div className="note-title">{note.title}</div>
                <button className="btn-icon" style={{ width: 26, height: 26, flexShrink: 0 }}
                  onClick={e => deleteNote(note.id, e)}><X size={13} /></button>
              </div>
              {note.content && <div className="note-content">{note.content}</div>}
              <div className="note-date">
                {format(new Date(note.updated_at), lang === 'th' ? 'd MMM yyyy, HH:mm น.' : 'd MMM yyyy, HH:mm', { locale: dateLocale })}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal !== null && <NoteModal note={modal} onClose={() => setModal(null)} onSave={saveNote} t={t} />}
    </div>
  )
}
