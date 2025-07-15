import React, { useState } from 'react'
import { saveSession } from '../utils/storage'

const SessionForm = ({ onSessionAdded }) => {
  const [formData, setFormData] = useState({
    subject: 'Quantitative',
    duration: '',
    topic: '',
    score: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const subjects = [
    'Quantitative',
    'Verbal',
    'Integrated Reasoning',
    'Analytical Writing',
    'Full Practice Test'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.duration) {
      alert('Please enter study duration')
      return
    }

    setLoading(true)
    
    try {
      const session = {
        ...formData,
        duration: parseInt(formData.duration),
        score: formData.score ? parseInt(formData.score) : null,
        date: new Date().toISOString(),
        timestamp: Date.now()
      }

      await saveSession(session)
      
      // Reset form
      setFormData({
        subject: 'Quantitative',
        duration: '',
        topic: '',
        score: '',
        notes: ''
      })

      onSessionAdded()
      
    } catch (error) {
      console.error('Error saving session:', error)
      alert('Failed to save session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const quickAdd = async (subject, duration) => {
    setLoading(true)
    
    try {
      const session = {
        subject,
        duration,
        topic: '',
        score: null,
        notes: '',
        date: new Date().toISOString(),
        timestamp: Date.now()
      }

      await saveSession(session)
      onSessionAdded()
      
    } catch (error) {
      console.error('Error saving quick session:', error)
      alert('Failed to save session. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3 className="mb-3">Log Study Session</h3>
      
      {/* Quick Add Buttons */}
      <div className="mb-4">
        <h4 className="mb-2" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Quick Add:
        </h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => quickAdd('Quantitative', 30)}
            disabled={loading}
            style={{ fontSize: '0.9rem', padding: '8px 12px' }}
          >
            Quant 30min
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => quickAdd('Verbal', 45)}
            disabled={loading}
            style={{ fontSize: '0.9rem', padding: '8px 12px' }}
          >
            Verbal 45min
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => quickAdd('Integrated Reasoning', 20)}
            disabled={loading}
            style={{ fontSize: '0.9rem', padding: '8px 12px' }}
          >
            IR 20min
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
        <h4 className="mb-3" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
          Custom Session:
        </h4>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="form-control"
              required
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 30"
              min="1"
              max="600"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Topic (optional)</label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Algebra, Reading Comprehension"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Score (optional)</label>
            <input
              type="number"
              name="score"
              value={formData.score}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 85"
              min="0"
              max="100"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes (optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              placeholder="How did it go? Any insights?"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Saving...' : 'Save Session'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SessionForm
