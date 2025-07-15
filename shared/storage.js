// Shared storage utilities for cross-platform data management
// Used by both Extension and PWA

export const STORAGE_KEYS = {
  SESSIONS: 'gmat_study_sessions',
  SETTINGS: 'gmat_study_settings',
  STREAK: 'gmat_study_streak',
  LAST_STUDY_DATE: 'gmat_last_study_date'
}

export const STORAGE_TYPES = {
  CHROME: 'chrome',
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage'
}

// Unified storage interface that works across platforms
export class UnifiedStorage {
  constructor() {
    this.storageType = this.detectStorageType()
  }

  detectStorageType() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      return STORAGE_TYPES.CHROME
    }
    return STORAGE_TYPES.LOCAL
  }

  async get(key) {
    try {
      switch (this.storageType) {
        case STORAGE_TYPES.CHROME:
          const result = await chrome.storage.local.get([key])
          return result[key] || null
        
        case STORAGE_TYPES.LOCAL:
        default:
          const stored = localStorage.getItem(key)
          return stored ? JSON.parse(stored) : null
      }
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  async set(key, value) {
    try {
      switch (this.storageType) {
        case STORAGE_TYPES.CHROME:
          await chrome.storage.local.set({ [key]: value })
          break
        
        case STORAGE_TYPES.LOCAL:
        default:
          localStorage.setItem(key, JSON.stringify(value))
          break
      }
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  async remove(key) {
    try {
      switch (this.storageType) {
        case STORAGE_TYPES.CHROME:
          await chrome.storage.local.remove([key])
          break
        
        case STORAGE_TYPES.LOCAL:
        default:
          localStorage.removeItem(key)
          break
      }
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  async clear() {
    try {
      switch (this.storageType) {
        case STORAGE_TYPES.CHROME:
          await chrome.storage.local.clear()
          break
        
        case STORAGE_TYPES.LOCAL:
        default:
          localStorage.clear()
          break
      }
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }
}

// Session management functions
export const SessionManager = {
  storage: new UnifiedStorage(),

  async saveSessions(sessions) {
    return await this.storage.set(STORAGE_KEYS.SESSIONS, sessions)
  },

  async getSessions() {
    const sessions = await this.storage.get(STORAGE_KEYS.SESSIONS)
    return sessions || []
  },

  async addSession(session) {
    const sessions = await this.getSessions()
    const newSessions = [session, ...sessions]
    return await this.saveSessions(newSessions)
  },

  async updateStreak(sessions) {
    const streak = this.calculateStreak(sessions)
    await this.storage.set(STORAGE_KEYS.STREAK, streak)
    await this.storage.set(STORAGE_KEYS.LAST_STUDY_DATE, new Date().toDateString())
    return streak
  },

  async getStreak() {
    return await this.storage.get(STORAGE_KEYS.STREAK) || 0
  },

  calculateStreak(sessions) {
    if (!sessions || sessions.length === 0) return 0
    
    const uniqueDays = [...new Set(sessions.map(session => 
      new Date(session.date).toDateString()
    ))].sort((a, b) => new Date(b) - new Date(a))
    
    let streak = 0
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
    
    // Check if studied today or yesterday
    if (uniqueDays.includes(today)) {
      streak = 1
      let checkDate = new Date()
      checkDate.setDate(checkDate.getDate() - 1)
      
      while (uniqueDays.includes(checkDate.toDateString())) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    } else if (uniqueDays.includes(yesterday)) {
      streak = 1
      let checkDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      checkDate.setDate(checkDate.getDate() - 1)
      
      while (uniqueDays.includes(checkDate.toDateString())) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }
    
    return streak
  }
}

// Settings management
export const SettingsManager = {
  storage: new UnifiedStorage(),

  async getSettings() {
    const settings = await this.storage.get(STORAGE_KEYS.SETTINGS)
    return {
      theme: 'light',
      notifications: true,
      syncEnabled: true,
      dailyGoal: 60, // minutes
      reminderTime: '19:00',
      ...settings
    }
  },

  async updateSettings(newSettings) {
    const currentSettings = await this.getSettings()
    const updatedSettings = { ...currentSettings, ...newSettings }
    return await this.storage.set(STORAGE_KEYS.SETTINGS, updatedSettings)
  }
}

// Cross-platform sync utility
export const SyncManager = {
  async syncData() {
    try {
      // If we're in an extension context, try to sync with PWA
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const sessions = await SessionManager.getSessions()
        const settings = await SettingsManager.getSettings()
        
        // Store in localStorage as backup
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
        }
      }
      
      // If we're in a web context, try to sync with extension
      if (typeof localStorage !== 'undefined' && typeof chrome !== 'undefined' && chrome.storage) {
        const sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSIONS) || '[]')
        const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}')
        
        await chrome.storage.local.set({
          [STORAGE_KEYS.SESSIONS]: sessions,
          [STORAGE_KEYS.SETTINGS]: settings
        })
      }
      
      return true
    } catch (error) {
      console.error('Sync error:', error)
      return false
    }
  }
}
