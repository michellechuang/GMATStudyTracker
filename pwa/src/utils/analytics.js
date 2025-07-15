// Analytics and insights utilities

export const calculateStreak = (sessions) => {
  if (!sessions || sessions.length === 0) return 0
  
  // Sort sessions by date
  const sortedSessions = sessions
    .map(session => ({
      ...session,
      dateOnly: new Date(session.date).toDateString()
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
  
  // Get unique study days
  const uniqueDays = [...new Set(sortedSessions.map(session => session.dateOnly))]
  
  let streak = 0
  const today = new Date().toDateString()
  let currentDate = new Date()
  
  for (let i = 0; i < uniqueDays.length; i++) {
    const dayToCheck = currentDate.toDateString()
    
    if (uniqueDays.includes(dayToCheck)) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else if (i === 0 && dayToCheck !== today) {
      // If the first day to check is not today, check yesterday
      currentDate.setDate(currentDate.getDate() - 1)
      const yesterday = currentDate.toDateString()
      
      if (uniqueDays.includes(yesterday)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    } else {
      break
    }
  }
  
  return streak
}

export const getWeeklyProgress = (sessions) => {
  if (!sessions || sessions.length === 0) return []
  
  const weeks = {}
  const now = new Date()
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.date)
    const weekStart = new Date(sessionDate)
    weekStart.setDate(sessionDate.getDate() - sessionDate.getDay()) // Start of week (Sunday)
    
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = {
        weekStart: weekKey,
        sessions: 0,
        totalMinutes: 0,
        hours: 0,
        subjects: new Set()
      }
    }
    
    weeks[weekKey].sessions++
    weeks[weekKey].totalMinutes += session.duration
    weeks[weekKey].hours = Math.round((weeks[weekKey].totalMinutes / 60) * 10) / 10
    weeks[weekKey].subjects.add(session.subject)
  })
  
  // Convert to array and sort by week
  return Object.values(weeks)
    .map((week, index) => ({
      ...week,
      week: index + 1,
      subjects: Array.from(week.subjects)
    }))
    .sort((a, b) => new Date(a.weekStart) - new Date(b.weekStart))
    .slice(-8) // Last 8 weeks
}

export const generateInsights = (sessions) => {
  if (!sessions || sessions.length === 0) return []
  
  const insights = []
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  
  // Recent activity analysis
  const recentSessions = sessions.filter(s => new Date(s.date) >= oneWeekAgo)
  const previousWeekSessions = sessions.filter(s => {
    const date = new Date(s.date)
    return date >= twoWeeksAgo && date < oneWeekAgo
  })
  
  // Activity trend
  if (recentSessions.length > previousWeekSessions.length) {
    insights.push({
      type: 'positive',
      title: 'Increased Study Activity',
      description: `You've studied ${recentSessions.length} times this week, up from ${previousWeekSessions.length} last week. Great momentum!`
    })
  } else if (recentSessions.length < previousWeekSessions.length && previousWeekSessions.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Decreased Study Activity',
      description: `Your study sessions have decreased from ${previousWeekSessions.length} to ${recentSessions.length} this week. Consider getting back on track.`
    })
  }
  
  // Subject balance analysis
  const subjectCounts = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + 1
    return acc
  }, {})
  
  const subjects = Object.keys(subjectCounts)
  const maxCount = Math.max(...Object.values(subjectCounts))
  const minCount = Math.min(...Object.values(subjectCounts))
  
  if (subjects.length > 1 && maxCount > minCount * 2) {
    const dominantSubject = Object.keys(subjectCounts).find(key => subjectCounts[key] === maxCount)
    const neglectedSubjects = Object.keys(subjectCounts).filter(key => subjectCounts[key] === minCount)
    
    insights.push({
      type: 'warning',
      title: 'Unbalanced Subject Focus',
      description: `You're focusing heavily on ${dominantSubject} but may need more practice with ${neglectedSubjects.join(', ')}.`
    })
  }
  
  // Session length analysis
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
  
  if (avgDuration > 60) {
    insights.push({
      type: 'positive',
      title: 'Great Session Length',
      description: `Your average study session is ${Math.round(avgDuration)} minutes. This is excellent for deep learning!`
    })
  } else if (avgDuration < 30) {
    insights.push({
      type: 'info',
      title: 'Consider Longer Sessions',
      description: `Your average session is ${Math.round(avgDuration)} minutes. Try 45-60 minute sessions for better retention.`
    })
  }
  
  // Streak analysis
  const streak = calculateStreak(sessions)
  if (streak >= 7) {
    insights.push({
      type: 'positive',
      title: 'Amazing Consistency!',
      description: `You've maintained a ${streak}-day study streak. This consistency will pay off on test day!`
    })
  } else if (streak >= 3) {
    insights.push({
      type: 'positive',
      title: 'Building Good Habits',
      description: `You're on a ${streak}-day streak. Keep it up to build a strong study routine!`
    })
  }
  
  // Score analysis (if available)
  const sessionsWithScores = sessions.filter(s => s.score !== null && s.score !== undefined)
  if (sessionsWithScores.length >= 3) {
    const recentScores = sessionsWithScores.slice(0, 3).map(s => s.score)
    const olderScores = sessionsWithScores.slice(3, 6).map(s => s.score)
    
    if (olderScores.length > 0) {
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length
      const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length
      
      if (recentAvg > olderAvg + 5) {
        insights.push({
          type: 'positive',
          title: 'Improving Performance',
          description: `Your recent average score (${Math.round(recentAvg)}) is higher than before (${Math.round(olderAvg)}). Great progress!`
        })
      }
    }
  }
  
  return insights
}

export const getStudyRecommendations = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return [
      {
        title: 'Start Your GMAT Journey',
        description: 'Begin with a diagnostic test to understand your baseline and identify areas for improvement.',
        action: 'Take a full-length practice test or diagnostic quiz'
      }
    ]
  }
  
  const recommendations = []
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  // Subject balance recommendations
  const subjectTimes = sessions.reduce((acc, session) => {
    acc[session.subject] = (acc[session.subject] || 0) + session.duration
    return acc
  }, {})
  
  const subjects = Object.keys(subjectTimes)
  const totalTime = Object.values(subjectTimes).reduce((a, b) => a + b, 0)
  
  // Check for neglected subjects
  const coreSubjects = ['Quantitative', 'Verbal']
  const neglectedSubjects = coreSubjects.filter(subject => {
    const subjectTime = subjectTimes[subject] || 0
    return (subjectTime / totalTime) < 0.3 // Less than 30% of total time
  })
  
  if (neglectedSubjects.length > 0) {
    recommendations.push({
      title: 'Balance Your Study Focus',
      description: `You may want to spend more time on ${neglectedSubjects.join(' and ')} to maintain balanced preparation.`,
      action: `Schedule 2-3 sessions this week focusing on ${neglectedSubjects[0]}`
    })
  }
  
  // Consistency recommendations
  const recentSessions = sessions.filter(s => new Date(s.date) >= oneWeekAgo)
  if (recentSessions.length < 3) {
    recommendations.push({
      title: 'Increase Study Frequency',
      description: 'Consistent daily practice is key to GMAT success. Aim for at least 4-5 study sessions per week.',
      action: 'Schedule 30-minute study blocks in your calendar for the next week'
    })
  }
  
  // Session length recommendations
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length
  if (avgDuration < 45) {
    recommendations.push({
      title: 'Optimize Session Length',
      description: 'Consider longer study sessions (45-90 minutes) for better retention and deeper understanding.',
      action: 'Try combining two short topics into one longer, focused session'
    })
  }
  
  // Practice test recommendations
  const practiceTests = sessions.filter(s => s.subject === 'Full Practice Test')
  const daysSinceStart = Math.floor((now - new Date(sessions[sessions.length - 1].date)) / (1000 * 60 * 60 * 24))
  
  if (daysSinceStart > 14 && practiceTests.length === 0) {
    recommendations.push({
      title: 'Take a Practice Test',
      description: 'After two weeks of study, take a full-length practice test to gauge your progress.',
      action: 'Schedule a 3.5-hour practice test session this weekend'
    })
  } else if (practiceTests.length > 0) {
    const lastTest = new Date(practiceTests[0].date)
    const daysSinceTest = Math.floor((now - lastTest) / (1000 * 60 * 60 * 24))
    
    if (daysSinceTest > 21) {
      recommendations.push({
        title: 'Regular Practice Testing',
        description: 'Take practice tests every 2-3 weeks to track progress and maintain test-taking stamina.',
        action: 'Schedule your next full-length practice test'
      })
    }
  }
  
  // Advanced recommendations based on performance
  const sessionsWithScores = sessions.filter(s => s.score !== null && s.score !== undefined)
  if (sessionsWithScores.length >= 5) {
    const avgScore = sessionsWithScores.reduce((sum, s) => sum + s.score, 0) / sessionsWithScores.length
    
    if (avgScore < 60) {
      recommendations.push({
        title: 'Focus on Fundamentals',
        description: 'Your scores suggest focusing on basic concepts before moving to advanced topics.',
        action: 'Review fundamental concepts and practice easier problems before tackling complex questions'
      })
    } else if (avgScore > 80) {
      recommendations.push({
        title: 'Challenge Yourself',
        description: 'Your strong performance indicates you\'re ready for more challenging material.',
        action: 'Focus on 700+ level questions and advanced problem-solving techniques'
      })
    }
  }
  
  // Time management recommendations
  const shortSessions = sessions.filter(s => s.duration < 30).length
  const longSessions = sessions.filter(s => s.duration > 90).length
  
  if (shortSessions > sessions.length * 0.6) {
    recommendations.push({
      title: 'Extend Study Sessions',
      description: 'Many short sessions can be less effective than fewer, longer focused sessions.',
      action: 'Combine related topics into 60-90 minute study blocks'
    })
  }
  
  if (longSessions > sessions.length * 0.3) {
    recommendations.push({
      title: 'Include Active Breaks',
      description: 'Very long sessions can lead to diminishing returns. Include breaks to maintain focus.',
      action: 'Use the Pomodoro technique: 25-minute focused study + 5-minute breaks'
    })
  }
  
  return recommendations.slice(0, 4) // Return top 4 recommendations
}
