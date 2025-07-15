// Storage utilities for PWA
const STORAGE_KEY = 'gmat_study_sessions'

export const saveSession = async (session) => {
  try {
    const existingSessions = await getStoredSessions()
    const updatedSessions = [session, ...existingSessions]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSessions))
    
    // Also sync with extension if available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await syncWithExtension(updatedSessions)
    }
    
    return true
  } catch (error) {
    console.error('Error saving session:', error)
    throw error
  }
}

export const getStoredSessions = async () => {
  try {
    // First try to get from extension storage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const extensionSessions = await getFromExtension()
      if (extensionSessions && extensionSessions.length > 0) {
        // Sync back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(extensionSessions))
        return extensionSessions
      }
    }
    
    // Fallback to localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting stored sessions:', error)
    return []
  }
}

export const getStorageStats = async () => {
  try {
    const sessions = await getStoredSessions()
    
    const totalSessions = sessions.length
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0)
    const totalHours = totalMinutes / 60
    
    const subjectBreakdown = sessions.reduce((acc, session) => {
      acc[session.subject] = (acc[session.subject] || 0) + session.duration
      return acc
    }, {})
    
    return {
      totalSessions,
      totalHours,
      totalMinutes,
      subjectBreakdown
    }
  } catch (error) {
    console.error('Error calculating storage stats:', error)
    return {
      totalSessions: 0,
      totalHours: 0,
      totalMinutes: 0,
      subjectBreakdown: {}
    }
  }
}

export const clearAllSessions = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    
    // Also clear extension storage if available
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.clear()
    }
    
    return true
  } catch (error) {
    console.error('Error clearing sessions:', error)
    throw error
  }
}

// Extension sync utilities
const syncWithExtension = async (sessions) => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    return false
  }
  
  try {
    await chrome.storage.local.set({ [STORAGE_KEY]: sessions })
    return true
  } catch (error) {
    console.error('Error syncing with extension:', error)
    return false
  }
}

const getFromExtension = async () => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    return null
  }
  
  try {
    const result = await chrome.storage.local.get([STORAGE_KEY])
    return result[STORAGE_KEY] || null
  } catch (error) {
    console.error('Error getting from extension:', error)
    return null
  }
}

// Export and import utilities
export const exportSessions = async () => {
  try {
    const sessions = await getStoredSessions()
    const stats = await getStorageStats()
    
    const exportData = {
      sessions,
      stats,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gmat-study-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Error exporting sessions:', error)
    throw error
  }
}

export const importSessions = async (file) => {
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    if (!data.sessions || !Array.isArray(data.sessions)) {
      throw new Error('Invalid file format')
    }
    
    // Validate session structure
    const validSessions = data.sessions.filter(session => 
      session.subject && 
      session.duration && 
      session.date
    )
    
    if (validSessions.length === 0) {
      throw new Error('No valid sessions found in file')
    }
    
    // Merge with existing sessions (avoid duplicates by timestamp)
    const existingSessions = await getStoredSessions()
    const existingTimestamps = new Set(existingSessions.map(s => s.timestamp))
    
    const newSessions = validSessions.filter(s => 
      !existingTimestamps.has(s.timestamp)
    )
    
    const mergedSessions = [...newSessions, ...existingSessions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedSessions))
    
    // Sync with extension
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await syncWithExtension(mergedSessions)
    }
    
    return {
      imported: newSessions.length,
      total: mergedSessions.length
    }
  } catch (error) {
    console.error('Error importing sessions:', error)
    throw error
  }
}
