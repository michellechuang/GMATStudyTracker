// Study session management
class StudyTracker {
  constructor() {
    this.init();
  }

  async init() {
    await this.loadStreak();
    await this.loadTodaySummary();
  }

  async loadStreak() {
    const { streak = 0 } = await chrome.storage.local.get(['streak']);
    document.getElementById('streak').textContent = 
      streak > 0 ? `🔥 Streak: ${streak} days` : '🎯 Start your streak!';
  }

  async loadTodaySummary() {
    const today = new Date().toDateString();
    const { sessions = {} } = await chrome.storage.local.get(['sessions']);
    
    const todaySessions = Object.values(sessions)
      .filter(session => new Date(session.date).toDateString() === today);
    
    const totalTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const totalQuestions = todaySessions.reduce((sum, s) => sum + (s.questions || 0), 0);
    
    document.getElementById('todaySummary').textContent = 
      `Today: ${totalTime}min • ${totalQuestions} questions`;
  }

  async logSession(topic, duration, questions = 0) {
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      topic,
      duration,
      questions,
      source: 'extension'
    };

    // Save to storage
    const { sessions = {} } = await chrome.storage.local.get(['sessions']);
    sessions[session.id] = session;
    await chrome.storage.local.set({ sessions });

    // Update streak
    await this.updateStreak();

    // Show success
    this.showSuccess(`${topic} session logged!`);
    
    // Refresh displays
    await this.loadStreak();
    await this.loadTodaySummary();
  }

  async updateStreak() {
    const { sessions = {} } = await chrome.storage.local.get(['sessions']);
    const sessionDates = Object.values(sessions)
      .map(s => new Date(s.date).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    const today = new Date().toDateString();
    
    if (sessionDates.length > 0 && sessionDates[0] === today) {
      streak = 1;
      for (let i = 1; i < sessionDates.length; i++) {
        const prevDate = new Date(sessionDates[i-1]);
        const currDate = new Date(sessionDates[i]);
        const dayDiff = (prevDate - currDate) / (1000 * 60 * 60 * 24);
        
        if (dayDiff === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    await chrome.storage.local.set({ streak });
    
    // Update badge
    chrome.action.setBadgeText({ 
      text: streak > 0 ? streak.toString() : '' 
    });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
  }

  showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    successDiv.textContent = `✅ ${message}`;
    successDiv.style.display = 'block';
    
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 2000);
  }
}

// Initialize tracker
const tracker = new StudyTracker();

// Global functions for button clicks
window.logSession = (topic, duration) => tracker.logSession(topic, duration);

window.logCustomSession = () => {
  const topic = document.getElementById('topicSelect').value;
  const duration = parseInt(document.getElementById('timeInput').value);
  const questions = parseInt(document.getElementById('questionsInput').value) || 0;
  
  if (duration > 0) {
    tracker.logSession(topic, duration, questions);
    // Clear form
    document.getElementById('timeInput').value = '';
    document.getElementById('questionsInput').value = '';
  }
};

window.openDashboard = () => {
  chrome.tabs.create({ url: 'http://localhost:5173' });
};

// Timer functionality
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

window.toggleTimer = () => {
  if (isTimerRunning) {
    stopTimer();
  } else {
    startTimerFunction();
  }
};

function startTimerFunction() {
  const timerSection = document.getElementById('timerSection');
  const timerBtn = document.getElementById('timerBtn');
  
  timerSection.style.display = 'block';
  timerBtn.textContent = '⏸️ Pause Timer';
  isTimerRunning = true;
  
  timerInterval = setInterval(() => {
    timerSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  const timerBtn = document.getElementById('timerBtn');
  
  clearInterval(timerInterval);
  timerBtn.textContent = '▶️ Resume Timer';
  isTimerRunning = false;
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  document.getElementById('timerDisplay').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

window.resetTimer = () => {
  clearInterval(timerInterval);
  timerSeconds = 0;
  isTimerRunning = false;
  
  document.getElementById('timerDisplay').textContent = '00:00';
  document.getElementById('timerBtn').textContent = '⏱️ Start Timer';
  document.getElementById('timerSection').style.display = 'none';
};

window.stopAndLog = () => {
  if (timerSeconds > 0) {
    const topic = document.getElementById('timerTopic').value;
    const minutes = Math.floor(timerSeconds / 60);
    
    if (minutes > 0) {
      tracker.logSession(topic, minutes);
    }
  }
  resetTimer();
};
