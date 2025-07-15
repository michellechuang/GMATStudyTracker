import React, { useState, useEffect } from 'react'
import SessionForm from './SessionForm'
import ProgressChart from './ProgressChart'
import AIInsights from './AIInsights'
import { getStoredSessions, getStorageStats } from '../utils/storage'
import { calculateStreak, getWeeklyProgress } from '../utils/analytics'

const Dashboard = () => {
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHours: 0,
    currentStreak: 0,
    weeklyProgress: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const storedSessions = await getStoredSessions()
      setSessions(storedSessions)
      
      const storageStats = await getStorageStats()
      const currentStreak = calculateStreak(storedSessions)
      const weeklyProgress = getWeeklyProgress(storedSessions)
      
      setStats({
        ...storageStats,
        currentStreak,
        weeklyProgress
      })
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSessionAdded = () => {
    loadData() // Reload data when a new session is added
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your study progress...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="grid grid-3 mb-4">
        <div className="card text-center">
          <h3>Total Sessions</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
            {stats.totalSessions}
          </div>
        </div>
        <div className="card text-center">
          <h3>Total Hours</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
            {stats.totalHours.toFixed(1)}
          </div>
        </div>
        <div className="card text-center">
          <h3>Current Streak</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning-color)' }}>
            {stats.currentStreak} days
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div>
          <SessionForm onSessionAdded={handleSessionAdded} />
          <AIInsights sessions={sessions} />
        </div>
        <div>
          <ProgressChart sessions={sessions} weeklyProgress={stats.weeklyProgress} />
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3">Recent Sessions</h3>
        {sessions.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            No study sessions yet. Add your first session above!
          </p>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {sessions.slice(0, 10).map((session, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderBottom: index < 9 ? '1px solid var(--border-color)' : 'none'
              }}>
                <div>
                  <strong>{session.subject}</strong>
                  {session.topic && <span> - {session.topic}</span>}
                  {session.score && <span className="text-success"> (Score: {session.score})</span>}
                </div>
                <div style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                  <div>{session.duration} min</div>
                  <div style={{ fontSize: '0.9rem' }}>
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
