// Mock data for the application
export const moods = [
  { value: 'excellent', label: 'Excellent', icon: 'Sparkles', color: '#10b981', gradient: 'from-emerald-500 to-green-600' },
  { value: 'good', label: 'Good', icon: 'SmilePlus', color: '#22c55e', gradient: 'from-green-500 to-emerald-600' },
  { value: 'okay', label: 'Okay', icon: 'Minus', color: '#eab308', gradient: 'from-yellow-500 to-amber-600' },
  { value: 'bad', label: 'Bad', icon: 'CloudRain', color: '#f97316', gradient: 'from-orange-500 to-red-600' },
  { value: 'terrible', label: 'Terrible', icon: 'CloudRainWind', color: '#ef4444', gradient: 'from-red-500 to-rose-600' },
];

export const mockMoodData = [
  { date: '2026-01-10', mood: 'good', reasons: ['Exercise', 'Good sleep'], note: 'Had a productive day!' },
  { date: '2026-01-11', mood: 'excellent', reasons: ['Social time', 'Achievement'], note: 'Completed my project!' },
  { date: '2026-01-12', mood: 'okay', reasons: ['Stress'], note: 'Work was challenging' },
  { date: '2026-01-13', mood: 'good', reasons: ['Exercise', 'Meditation'], note: 'Felt balanced' },
  { date: '2026-01-14', mood: 'bad', reasons: ['Poor sleep', 'Stress'], note: 'Tired and overwhelmed' },
  { date: '2026-01-15', mood: 'good', reasons: ['Good sleep', 'Nature walk'], note: 'Recharged energy' },
  { date: '2026-01-16', mood: 'excellent', reasons: ['Social time', 'Achievement', 'Exercise'], note: 'Amazing day overall!' },
  { date: '2026-01-17', mood: 'good', reasons: ['Meditation', 'Good sleep'], note: 'Feeling peaceful' },
];

export const mockJournalEntries = [
  {
    id: '1',
    date: '2026-01-17',
    title: 'Morning Reflections',
    content: 'Today I woke up feeling grateful for the small things in life. The sunrise was beautiful, and I took a moment to meditate before starting my day.',
    mood: 'excellent',
    tags: ['gratitude', 'meditation', 'morning']
  },
  {
    id: '2',
    date: '2026-01-16',
    title: 'Productive Day',
    content: 'Completed my major project today! Feeling accomplished and proud of myself. Celebrated with friends in the evening.',
    mood: 'excellent',
    tags: ['achievement', 'celebration', 'work']
  },
  {
    id: '3',
    date: '2026-01-15',
    title: 'Nature Walk',
    content: 'Went for a long walk in the park. Nature really helps clear my mind and reduce stress. Need to do this more often.',
    mood: 'good',
    tags: ['nature', 'exercise', 'wellness']
  },
];

export const mockHabits = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: 'Meditate for 10 minutes every morning',
    icon: 'brain',
    color: '#dc2626',
    category: 'mindfulness',
    target: 7,
    completed: [
      '2026-01-11', '2026-01-12', '2026-01-13', '2026-01-14', '2026-01-15', '2026-01-16', '2026-01-17'
    ],
    streak: 7
  },
  {
    id: '2',
    name: 'Exercise',
    description: 'At least 30 minutes of physical activity',
    icon: 'dumbbell',
    color: '#dc2626',
    category: 'fitness',
    target: 5,
    completed: [
      '2026-01-13', '2026-01-14', '2026-01-16', '2026-01-17'
    ],
    streak: 2
  },
  {
    id: '3',
    name: 'Gratitude Journal',
    description: 'Write 3 things I\'m grateful for',
    icon: 'heart',
    color: '#dc2626',
    category: 'health',
    target: 7,
    completed: [
      '2026-01-11', '2026-01-13', '2026-01-15', '2026-01-16', '2026-01-17'
    ],
    streak: 2
  },
  {
    id: '4',
    name: 'Read Before Bed',
    description: 'Read for 20 minutes before sleeping',
    icon: 'book',
    color: '#dc2626',
    category: 'learning',
    target: 7,
    completed: [
      '2026-01-12', '2026-01-13', '2026-01-14', '2026-01-15', '2026-01-17'
    ],
    streak: 1
  },
];

export const mockSleepData = [
  { date: '2026-01-10', hours: 7.5, quality: 'good', bedtime: '23:00', wakeup: '06:30' },
  { date: '2026-01-11', hours: 8, quality: 'excellent', bedtime: '22:30', wakeup: '06:30' },
  { date: '2026-01-12', hours: 6, quality: 'poor', bedtime: '01:00', wakeup: '07:00' },
  { date: '2026-01-13', hours: 7, quality: 'good', bedtime: '23:30', wakeup: '06:30' },
  { date: '2026-01-14', hours: 5.5, quality: 'poor', bedtime: '01:30', wakeup: '07:00' },
  { date: '2026-01-15', hours: 8.5, quality: 'excellent', bedtime: '22:00', wakeup: '06:30' },
  { date: '2026-01-16', hours: 7.5, quality: 'good', bedtime: '23:00', wakeup: '06:30' },
  { date: '2026-01-17', hours: 8, quality: 'excellent', bedtime: '22:30', wakeup: '06:30' },
];

export const mockUserProfile = {
  name: 'Alex Johnson',
  email: 'alex@reveura.com',
  joinedDate: '2025-12-01',
  timezone: 'America/New_York',
  notifications: {
    moodReminder: true,
    habitReminder: true,
    sleepReminder: true,
    weeklyInsights: true
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    weekStart: 'monday'
  }
};
