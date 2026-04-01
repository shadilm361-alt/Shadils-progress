import React, { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Oops, something's not right.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }}>
            Clear Data & Reset
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('humble_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      console.error('Core: User parse error', e)
    }
    setLoading(false)
  }, [])

  const handleOnboardingComplete = (userData) => {
    console.log('App: Onboarding Complete', userData)
    try {
      localStorage.setItem('humble_user', JSON.stringify(userData))
      setUser(userData)
    } catch (e) {
      console.error('App: Save user error', e)
    }
  }

  if (loading) return null

  return (
    <ErrorBoundary>
      <div className="app-container">
        <div className="grain-overlay"></div>
        
        {!user ? (
          <Onboarding onComplete={handleOnboardingComplete} />
        ) : (
          <Dashboard user={user} />
        )}
      </div>
    </ErrorBoundary>
  )
}

export default App
