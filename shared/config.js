// Application configuration and constants

export const APP_CONFIG = {
  name: 'GMAT Study Tracker',
  version: '1.0.0',
  description: 'Track your GMAT preparation progress with AI-powered insights',
  
  // URLs and endpoints
  urls: {
    pwa: 'http://localhost:5173',
    pwaProd: 'https://your-domain.com',
    github: 'https://github.com/yourusername/gmat-study-tracker',
    support: 'mailto:support@your-domain.com'
  },
  
  // Storage configuration
  storage: {
    prefix: 'gmat_',
    maxSessions: 10000, // Maximum sessions to store
    maxExportSize: 50 * 1024 * 1024, // 50MB max export file
    syncInterval: 5 * 60 * 1000, // 5 minutes
    backupInterval: 24 * 60 * 60 * 1000 // 24 hours
  },
  
  // Analytics configuration
  analytics: {
    minSessionsForInsights: 5,
    insightUpdateInterval: 24 * 60 * 60 * 1000, // 24 hours
    streakResetHours: 6, // Reset streak if no study after 6 AM
    weekStartDay: 0, // 0 = Sunday, 1 = Monday
    defaultChartDays: 30
  },
  
  // UI configuration
  ui: {
    theme: {
      primary: '#0066cc',
      secondary: '#004499',
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545'
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out'
    },
    responsive: {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    }
  },
  
  // Notification settings
  notifications: {
    enabled: true,
    types: {
      streak: true,
      daily_goal: true,
      weekly_goal: true,
      milestone: true,
      reminder: true
    },
    timing: {
      dailyReminder: '19:00',
      streakReminder: '22:00',
      goalCheck: '23:00'
    }
  },
  
  // Study session defaults
  session: {
    defaultDuration: {
      'Quantitative': 30,
      'Verbal': 45,
      'Integrated Reasoning': 20,
      'Analytical Writing': 30,
      'Full Practice Test': 210, // 3.5 hours
      'Review': 20
    },
    quickAddButtons: [
      { subject: 'Quantitative', duration: 30, label: 'Quant 30min' },
      { subject: 'Verbal', duration: 45, label: 'Verbal 45min' },
      { subject: 'Integrated Reasoning', duration: 20, label: 'IR 20min' }
    ]
  },
  
  // Goals and targets
  goals: {
    default: {
      dailyMinutes: 60,
      weeklyMinutes: 420, // 7 hours
      monthlyMinutes: 1800, // 30 hours
      streakTarget: 7
    },
    milestones: [
      { sessions: 10, title: 'Getting Started', reward: 'First milestone!' },
      { sessions: 50, title: 'Committed Learner', reward: 'Great consistency!' },
      { sessions: 100, title: 'Dedicated Student', reward: 'You\'re on fire!' },
      { sessions: 250, title: 'GMAT Warrior', reward: 'Incredible dedication!' },
      { sessions: 500, title: 'Study Master', reward: 'You\'re a legend!' }
    ]
  },
  
  // AI Insights configuration
  insights: {
    categories: [
      'consistency',
      'balance',
      'performance',
      'goals',
      'recommendations'
    ],
    priorities: ['high', 'medium', 'low'],
    maxActiveInsights: 5,
    dismissAfterDays: 7
  },
  
  // Chart configuration
  charts: {
    colors: {
      primary: '#0066cc',
      secondary: '#004499',
      success: '#28a745',
      warning: '#ffc107',
      info: '#17a2b8',
      subjects: [
        '#0066cc', // Quantitative
        '#28a745', // Verbal
        '#ffc107', // IR
        '#dc3545', // Writing
        '#6f42c1'  // Practice Tests
      ]
    },
    defaults: {
      animationDuration: 1000,
      responsive: true,
      maintainAspectRatio: false
    }
  },
  
  // Export/Import configuration
  export: {
    formats: ['json', 'csv'],
    filename: {
      prefix: 'gmat-study-data',
      dateFormat: 'YYYY-MM-DD',
      extension: {
        json: '.json',
        csv: '.csv'
      }
    },
    fields: {
      sessions: [
        'date',
        'subject',
        'duration',
        'topic',
        'score',
        'notes',
        'difficulty'
      ],
      summary: [
        'totalSessions',
        'totalHours',
        'currentStreak',
        'longestStreak',
        'averageScore'
      ]
    }
  },
  
  // Development configuration
  development: {
    debug: process.env.NODE_ENV === 'development',
    logLevel: 'info', // 'debug', 'info', 'warn', 'error'
    enableDevTools: process.env.NODE_ENV === 'development',
    mockData: false
  },
  
  // Feature flags
  features: {
    aiInsights: true,
    dataExport: true,
    notifications: true,
    sync: true,
    goals: true,
    themes: true,
    analytics: true,
    reminders: true
  },
  
  // API configuration (for future use)
  api: {
    baseUrl: 'https://api.your-domain.com',
    timeout: 10000,
    retries: 3,
    endpoints: {
      sync: '/sync',
      backup: '/backup',
      insights: '/insights'
    }
  },
  
  // Security settings
  security: {
    enableCSP: true,
    allowedOrigins: [
      'chrome-extension://*',
      'http://localhost:*',
      'https://your-domain.com'
    ],
    dataEncryption: false // Enable for sensitive data
  }
}

// Environment-specific overrides
export const getConfig = () => {
  const environment = process.env.NODE_ENV || 'development'
  
  const envConfigs = {
    development: {
      urls: {
        pwa: 'http://localhost:5173'
      },
      development: {
        debug: true,
        logLevel: 'debug',
        enableDevTools: true
      }
    },
    
    production: {
      urls: {
        pwa: 'https://your-domain.com'
      },
      development: {
        debug: false,
        logLevel: 'error',
        enableDevTools: false
      },
      analytics: {
        trackingEnabled: true
      }
    },
    
    test: {
      storage: {
        prefix: 'test_gmat_',
        maxSessions: 100
      },
      development: {
        debug: true,
        logLevel: 'warn',
        mockData: true
      }
    }
  }
  
  const envConfig = envConfigs[environment] || {}
  
  // Deep merge configurations
  return mergeDeep(APP_CONFIG, envConfig)
}

// Utility function for deep merging objects
function mergeDeep(target, source) {
  const output = Object.assign({}, target)
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  
  return output
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// Export the configured app config
export default getConfig()
