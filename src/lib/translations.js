const th = {
  // BottomNav
  navHome:     'หน้าหลัก',
  navCalendar: 'ปฏิทิน',
  navNotes:    'โน้ต',
  navHabits:   'กิจกรรม',
  navTimer:    'จับเวลา',

  // Dashboard
  welcome:      'ยินดีต้อนรับ',
  ctaTitle:     'เพิ่มงานหรือกิจกรรม',
  ctaSub:       'ทำวันนี้ให้มีความหมาย เพิ่มสิ่งที่อยากทำ',
  todayTasks:   'งานวันนี้',
  doneOf:       'เสร็จแล้ว',
  noTasksToday: 'ยังไม่มีงานวันนี้ กดการ์ดด้านบนเพื่อเพิ่มครับ',
  statTasks:    'งานวันนี้',
  statDone:     'เสร็จแล้ว',
  statHabits:   'กิจกรรมวันนี้',
  statTimer:    'จับเวลา',
  progress:     'ความคืบหน้า',
  periodToday:  'วันนี้',
  periodWeek:   'อาทิตย์นี้',
  periodMonth:  'เดือนนี้',
  total:        'ทั้งหมด',
  completed:    'เสร็จแล้ว',

  // AddTask modal
  addNewTask:       'เพิ่มงานใหม่',
  taskName:         'ชื่องาน',
  taskPlaceholder:  'เช่น ประชุมทีม, ส่งรายงาน...',
  dateLabel:        'วันที่',
  cancelBtn:        'ยกเลิก',
  addTaskBtn:       'เพิ่มงาน',

  // Calendar
  calendarTitle:    'ปฏิทิน',
  todayBtn:         'วันนี้',
  addTask:          'เพิ่มงาน',
  noTasksDay:       'ไม่มีงานวันนี้',
  calTaskPlaceholder: 'เพิ่มงานหรือกิจกรรม...',

  // Notes
  notesTitle:         'โน้ต',
  newNote:            'โน้ตใหม่',
  searchPlaceholder:  'ค้นหาโน้ต...',
  noNotesSearch:      'ไม่พบโน้ตที่ค้นหา',
  noNotes:            'ยังไม่มีโน้ต กด "โน้ตใหม่" เพื่อเริ่มต้นครับ',
  editNote:           'แก้ไขโน้ต',
  noteTitleLabel:     'หัวข้อ',
  noteTitlePH:        'หัวข้อโน้ต...',
  noteContentLabel:   'เนื้อหา',
  noteContentPH:      'เขียนโน้ตที่นี่...',
  saveBtn:            'บันทึก',
  createBtn:          'สร้าง',

  // Habits / Activities
  habitsTitle:      'กิจกรรมประจำ',
  addHabitBtn:      'เพิ่มกิจกรรม',
  addHabitTitle:    'เพิ่มกิจกรรมประจำใหม่',
  habitNameLabel:   'ชื่อกิจกรรม',
  habitPH:          'เช่น ออกกำลังกาย, อ่านหนังสือ...',
  colorLabel:       'สี',
  noHabitsLine1:    'กรุณาเพิ่มกิจกรรมก่อน',
  noHabitsLine2:    'เช่น ออกกำลังกาย, อ่านหนังสือ, นั่งสมาธิ',
  daysUnit:         'วัน',
  last30:           '30 วันล่าสุด',

  // Timer / Focus
  timerTitle:       'จับเวลา',
  timerPH:          'กำลังจับเวลาทำอะไร? เช่น อ่านหนังสือ, ออกกำลังกาย...',
  workingOn:        'กำลัง:',
  pausedLabel:      'หยุดชั่วคราว',
  timesUp:          'ครบเวลาแล้ว!',
  enableNotif:      'เปิดการแจ้งเตือนเมื่อครบเวลา',
  todayLog:         'บันทึกวันนี้',
  unspecified:      'ไม่ระบุ',
  hUnit:            'ชม.',
  mUnit:            'นาที',
  sUnit:            'วิ.',
  minUnit:          'นาที',
  hrUnit:           'ชั่วโมง',
  notifTitle:       '⏱ Wemmer — หมดเวลาแล้ว!',
  notifDone:        'จับเวลาเสร็จแล้ว',
  notifWith:        (l) => `"${l}" ครบเวลาแล้ว`,
}

const en = {
  navHome:     'Home',
  navCalendar: 'Calendar',
  navNotes:    'Notes',
  navHabits:   'Activities',
  navTimer:    'Timer',

  welcome:      'Welcome',
  ctaTitle:     'Add Task or Activity',
  ctaSub:       'Make today count. Add what you want to do.',
  todayTasks:   "Today's Tasks",
  doneOf:       'done',
  noTasksToday: 'No tasks today. Tap the card above to add one.',
  statTasks:    'Tasks Today',
  statDone:     'Completed',
  statHabits:   "Today's Activities",
  statTimer:    'Timer',
  progress:     'Progress',
  periodToday:  'Today',
  periodWeek:   'This Week',
  periodMonth:  'This Month',
  total:        'Total',
  completed:    'Done',

  addNewTask:       'Add New Task',
  taskName:         'Task Name',
  taskPlaceholder:  'e.g. Team meeting, Submit report...',
  dateLabel:        'Date',
  cancelBtn:        'Cancel',
  addTaskBtn:       'Add Task',

  calendarTitle:      'Calendar',
  todayBtn:           'Today',
  addTask:            'Add Task',
  noTasksDay:         'No tasks this day',
  calTaskPlaceholder: 'Add task or activity...',

  notesTitle:         'Notes',
  newNote:            'New Note',
  searchPlaceholder:  'Search notes...',
  noNotesSearch:      'No matching notes found',
  noNotes:            'No notes yet. Tap "New Note" to get started.',
  editNote:           'Edit Note',
  noteTitleLabel:     'Title',
  noteTitlePH:        'Note title...',
  noteContentLabel:   'Content',
  noteContentPH:      'Write your note here...',
  saveBtn:            'Save',
  createBtn:          'Create',

  habitsTitle:      'Regular Activities',
  addHabitBtn:      'Add Activity',
  addHabitTitle:    'Add New Activity',
  habitNameLabel:   'Activity Name',
  habitPH:          'e.g. Exercise, Reading, Meditation...',
  colorLabel:       'Color',
  noHabitsLine1:    'No activities yet',
  noHabitsLine2:    'e.g. Exercise, Reading, Meditation',
  daysUnit:         'days',
  last30:           'Last 30 days',

  timerTitle:       'Timer',
  timerPH:          'What are you timing? e.g. Reading, Working out...',
  workingOn:        'Working on:',
  pausedLabel:      'Paused',
  timesUp:          "Time's up!",
  enableNotif:      'Enable notifications when timer ends',
  todayLog:         "Today's Log",
  unspecified:      'Unspecified',
  hUnit:            'hr',
  mUnit:            'min',
  sUnit:            'sec',
  minUnit:          'min',
  hrUnit:           'hour',
  notifTitle:       "⏱ Wemmer — Time's up!",
  notifDone:        'Timer finished',
  notifWith:        (l) => `"${l}" is complete`,
}

export const translations = { th, en }

export function createT(lang) {
  const dict = translations[lang] ?? translations.th
  return (key, ...args) => {
    const val = dict[key] ?? translations.th[key] ?? key
    return typeof val === 'function' ? val(...args) : val
  }
}
