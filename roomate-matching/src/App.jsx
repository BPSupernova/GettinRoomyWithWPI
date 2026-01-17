import { useState } from 'react'
import LandingPage from './components/LandingPage'
import CardContainer from './components/CardContainer'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  const handleUserStart = (userData) => {
    setCurrentUser(userData)
    
  }

  const handleReset = () => {
    setCurrentUser(null)
  }

  return (
    <>
      {!currentUser ? (
        <LandingPage onStart={handleUserStart} />
      ) : (
        <div className="matcher-wrapper">
          <button onClick={handleReset} className="back-btn">
            ← Back
          </button>
          <CardContainer user={currentUser} />
        </div>
      )}
    </>
  )
}

export default App
