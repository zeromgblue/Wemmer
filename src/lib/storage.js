const KEY = {
  tasks:     'wemmer_tasks',
  notes:     'wemmer_notes',
  habits:    'wemmer_habits',
  habitLogs: 'wemmer_habit_logs',
  sessions:  'wemmer_sessions',
}

function get(key)      { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } }
function set(key, val) { localStorage.setItem(key, JSON.stringify(val)) }
function uid()         { return crypto.randomUUID() }
function now()         { return new Date().toISOString() }

export const db = {
  tasks: {
    getAll: () => get(KEY.tasks),
    insert(item) {
      const record = { ...item, id: uid(), created_at: now() }
      set(KEY.tasks, [...get(KEY.tasks), record])
      return record
    },
    update(id, updates) {
      const all = get(KEY.tasks).map(t => t.id === id ? { ...t, ...updates } : t)
      set(KEY.tasks, all)
      return all.find(t => t.id === id)
    },
    delete(id) { set(KEY.tasks, get(KEY.tasks).filter(t => t.id !== id)) },
  },

  notes: {
    getAll: () => get(KEY.notes),
    insert(item) {
      const record = { ...item, id: uid(), created_at: now(), updated_at: now() }
      set(KEY.notes, [record, ...get(KEY.notes)])
      return record
    },
    update(id, updates) {
      const all = get(KEY.notes).map(n => n.id === id ? { ...n, ...updates, updated_at: now() } : n)
      set(KEY.notes, all)
      return all.find(n => n.id === id)
    },
    delete(id) { set(KEY.notes, get(KEY.notes).filter(n => n.id !== id)) },
  },

  habits: {
    getAll: () => get(KEY.habits),
    insert(item) {
      const record = { ...item, id: uid(), created_at: now() }
      set(KEY.habits, [...get(KEY.habits), record])
      return record
    },
    delete(id) {
      set(KEY.habits,    get(KEY.habits).filter(h => h.id !== id))
      set(KEY.habitLogs, get(KEY.habitLogs).filter(l => l.habit_id !== id))
    },
  },

  habitLogs: {
    getAll: () => get(KEY.habitLogs),
    insert(item) {
      const record = { ...item, id: uid() }
      set(KEY.habitLogs, [...get(KEY.habitLogs), record])
      return record
    },
    delete(id) { set(KEY.habitLogs, get(KEY.habitLogs).filter(l => l.id !== id)) },
  },

  sessions: {
    getAll: () => get(KEY.sessions),
    insert(item) {
      const record = { ...item, id: uid(), completed_at: now() }
      set(KEY.sessions, [record, ...get(KEY.sessions)])
      return record
    },
  },
}
