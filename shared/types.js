// Shared data types and structures for GMAT Study Tracker

// Study session data structure
export const SessionType = {
  subject: '', // string: 'Quantitative', 'Verbal', 'Integrated Reasoning', etc.
  duration: 0, // number: minutes spent studying
  topic: '', // string: optional specific topic
  score: null, // number|null: optional score (0-100)
  notes: '', // string: optional notes
  date: '', // string: ISO date string
  timestamp: 0, // number: Unix timestamp for sorting
  difficulty: '', // string: 'Easy', 'Medium', 'Hard' (optional)
  source: '', // string: 'Extension', 'PWA', 'Import' (for tracking)
  tags: [] // array: optional tags for categorization
}

// User settings structure
export const SettingsType = {
  theme: 'light', // 'light' | 'dark' | 'auto'
  notifications: true, // boolean: enable study reminders
  syncEnabled: true, // boolean: enable cross-platform sync
  dailyGoal: 60, // number: daily study goal in minutes
  reminderTime: '19:00', // string: time for daily reminder (HH:MM)
  weeklyGoal: 420, // number: weekly study goal in minutes (7 hours)
  preferredSessionLength: 45, // number: preferred session length in minutes
  autoStartTimer: false, // boolean: auto-start timer when logging
  soundEnabled: true, // boolean: enable notification sounds
  badgeEnabled: true, // boolean: show streak on extension badge
  exportFormat: 'json', // 'json' | 'csv': preferred export format
  language: 'en', // string: interface language
  timezone: 'auto' // string: timezone for date calculations
}

// Study streak information
export const StreakType = {
  current: 0, // number: current consecutive study days
  longest: 0, // number: longest streak achieved
  lastStudyDate: '', // string: last study date (YYYY-MM-DD)
  streakStartDate: '', // string: when current streak started
  totalStudyDays: 0 // number: total unique days studied
}

// Analytics data structure
export const AnalyticsType = {
  totalSessions: 0,
  totalMinutes: 0,
  totalHours: 0,
  averageSessionLength: 0,
  subjectBreakdown: {}, // object: subject -> minutes
  weeklyProgress: [], // array: weekly study data
  monthlyProgress: [], // array: monthly study data
  scoreProgress: [], // array: score trends over time
  studyFrequency: {}, // object: day of week -> session count
  productiveHours: {}, // object: hour of day -> session count
  topicAnalysis: {} // object: topic -> performance data
}

// Insight types for AI recommendations
export const InsightType = {
  id: '', // string: unique identifier
  type: '', // 'positive' | 'warning' | 'info' | 'goal' | 'achievement'
  title: '', // string: insight title
  description: '', // string: detailed description
  action: '', // string: recommended action (optional)
  priority: 'medium', // 'low' | 'medium' | 'high'
  category: '', // 'consistency' | 'balance' | 'performance' | 'goals'
  dateGenerated: '', // string: when insight was generated
  dismissed: false, // boolean: user dismissed this insight
  actionTaken: false // boolean: user acted on this insight
}

// Study goal structure
export const StudyGoalType = {
  id: '', // string: unique identifier
  type: '', // 'daily' | 'weekly' | 'monthly' | 'custom'
  target: 0, // number: target value (minutes, sessions, etc.)
  metric: '', // 'minutes' | 'sessions' | 'subjects'
  description: '', // string: goal description
  startDate: '', // string: goal start date
  endDate: '', // string: goal end date (optional)
  completed: false, // boolean: goal achieved
  progress: 0, // number: current progress (0-100%)
  reward: '' // string: reward for achieving goal (optional)
}

// Export/Import data structure
export const ExportDataType = {
  version: '1.0', // string: data format version
  exportDate: '', // string: when data was exported
  sessions: [], // array: all study sessions
  settings: {}, // object: user settings
  analytics: {}, // object: computed analytics
  goals: [], // array: study goals
  insights: [], // array: generated insights
  metadata: {} // object: additional metadata
}

// Subject configuration
export const SUBJECTS = [
  'Quantitative',
  'Verbal',
  'Integrated Reasoning',
  'Analytical Writing',
  'Full Practice Test',
  'Review',
  'Error Log'
]

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
]

// Common study topics by subject
export const STUDY_TOPICS = {
  'Quantitative': [
    'Arithmetic',
    'Algebra',
    'Geometry',
    'Word Problems',
    'Data Sufficiency',
    'Problem Solving',
    'Number Properties',
    'Statistics & Probability'
  ],
  'Verbal': [
    'Reading Comprehension',
    'Critical Reasoning',
    'Sentence Correction',
    'Grammar Rules',
    'Vocabulary',
    'Reading Speed',
    'Argument Analysis'
  ],
  'Integrated Reasoning': [
    'Graphics Interpretation',
    'Table Analysis',
    'Multi-Source Reasoning',
    'Two-Part Analysis',
    'Data Analysis',
    'Logic Puzzles'
  ],
  'Analytical Writing': [
    'Argument Essays',
    'Essay Structure',
    'Grammar & Style',
    'Time Management',
    'Practice Essays',
    'Critique Skills'
  ]
}

// Score ranges for different sections
export const SCORE_RANGES = {
  'Quantitative': { min: 6, max: 51 },
  'Verbal': { min: 6, max: 51 },
  'Integrated Reasoning': { min: 1, max: 8 },
  'Analytical Writing': { min: 0, max: 6 },
  'Total': { min: 200, max: 800 }
}

// Validation functions
export const validateSession = (session) => {
  const errors = []
  
  if (!session.subject || !SUBJECTS.includes(session.subject)) {
    errors.push('Invalid subject')
  }
  
  if (!session.duration || session.duration < 1 || session.duration > 600) {
    errors.push('Duration must be between 1 and 600 minutes')
  }
  
  if (session.score !== null && session.score !== undefined) {
    const range = SCORE_RANGES[session.subject]
    if (range && (session.score < range.min || session.score > range.max)) {
      errors.push(`Score must be between ${range.min} and ${range.max} for ${session.subject}`)
    }
  }
  
  if (!session.date || isNaN(new Date(session.date).getTime())) {
    errors.push('Invalid date')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validateSettings = (settings) => {
  const errors = []
  
  if (settings.dailyGoal < 0 || settings.dailyGoal > 1440) {
    errors.push('Daily goal must be between 0 and 1440 minutes')
  }
  
  if (settings.reminderTime && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(settings.reminderTime)) {
    errors.push('Invalid reminder time format (use HH:MM)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Data transformation utilities
export const transformLegacySession = (legacySession) => {
  return {
    subject: legacySession.subject || 'Quantitative',
    duration: legacySession.duration || 0,
    topic: legacySession.topic || '',
    score: legacySession.score || null,
    notes: legacySession.notes || '',
    date: legacySession.date || new Date().toISOString(),
    timestamp: legacySession.timestamp || Date.now(),
    difficulty: legacySession.difficulty || '',
    source: legacySession.source || 'Legacy',
    tags: legacySession.tags || []
  }
}

export const createSession = (sessionData) => {
  const session = {
    ...SessionType,
    ...sessionData,
    timestamp: sessionData.timestamp || Date.now(),
    date: sessionData.date || new Date().toISOString(),
    source: sessionData.source || 'Manual'
  }
  
  const validation = validateSession(session)
  if (!validation.isValid) {
    throw new Error(`Invalid session data: ${validation.errors.join(', ')}`)
  }
  
  return session
}
