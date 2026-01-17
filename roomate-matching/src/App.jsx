import { useState } from 'react'
import LandingPage from './components/LandingPage'
import CardContainer from './components/CardContainer'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  // 🔮 TODO: Gemini API Integration
  // This is where you'd handle the AI matching logic
  // const analyzeUserWithGemini = async (userData) => {
  //   const response = await fetch('/api/analyze-profile', {
  //     method: 'POST',
  //     body: JSON.stringify(userData),
  //     headers: { 'Content-Type': 'application/json' }
  //   });
  //   return await response.json();
  // }

  const handleUserStart = (userData) => {
    setCurrentUser(userData)
    // Here you'd call Gemini API to generate recommendations
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
