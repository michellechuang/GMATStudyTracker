import React, { useState, useEffect } from 'react'
import { generateInsights, getStudyRecommendations } from '../utils/analytics'

const AIInsights = ({ sessions }) => {
  const [insights, setInsights] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (sessions.length > 0) {
      generateAIInsights()
    }
  }, [sessions])

  const generateAIInsights = () => {
    setLoading(true)
    
    try {
      const newInsights = generateInsights(sessions)
      const newRecommendations = getStudyRecommendations(sessions)
      
      setInsights(newInsights)
      setRecommendations(newRecommendations)
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      case 'goal':
        return '🎯'
      default:
        return '💡'
    }
  }

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'var(--success-color)'
      case 'warning':
        return 'var(--warning-color)'
      case 'info':
        return 'var(--primary-color)'
      case 'goal':
        return 'var(--secondary-color)'
      default:
        return 'var(--text-secondary)'
    }
  }

  if (sessions.length === 0) {
    return (
      <div className="card">
        <h3 className="mb-3">AI Insights</h3>
        <div className="text-center" style={{ padding: '20px', color: 'var(--text-secondary)' }}>
          <p>Start logging study sessions to get personalized insights and recommendations!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="mb-3">AI Insights</h3>
      
      {loading && (
        <div className="text-center mb-3" style={{ color: 'var(--text-secondary)' }}>
          Analyzing your study patterns...
        </div>
      )}

      {insights.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-3" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Study Pattern Analysis:
          </h4>
          {insights.map((insight, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              padding: '10px',
              marginBottom: '10px',
              borderLeft: `3px solid ${getInsightColor(insight.type)}`,
              backgroundColor: 'rgba(0, 102, 204, 0.05)',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '1.2rem' }}>
                {getInsightIcon(insight.type)}
              </span>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                  {insight.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {insight.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <h4 className="mb-3" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            Personalized Recommendations:
          </h4>
          {recommendations.map((rec, index) => (
            <div key={index} style={{
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: 'rgba(40, 167, 69, 0.05)',
              borderRadius: '4px',
              borderLeft: '3px solid var(--success-color)'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '4px', color: 'var(--success-color)' }}>
                🎯 {rec.title}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {rec.description}
              </div>
              {rec.action && (
                <div style={{ 
                  fontSize: '0.9rem', 
                  marginTop: '8px',
                  padding: '6px 10px',
                  backgroundColor: 'rgba(40, 167, 69, 0.1)',
                  borderRadius: '3px',
                  fontStyle: 'italic'
                }}>
                  💡 Action: {rec.action}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && insights.length === 0 && recommendations.length === 0 && (
        <div className="text-center" style={{ padding: '20px', color: 'var(--text-secondary)' }}>
          <p>Keep studying to unlock insights about your progress patterns!</p>
        </div>
      )}
    </div>
  )
}

export default AIInsights
