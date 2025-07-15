import React from 'react'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>GMAT Study Tracker</h1>
          <p>Track your GMAT preparation progress and stay motivated</p>
        </div>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default App
