import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { getApiUrl, API_ENDPOINTS } from './utils/api'
import Header from './components/Header'
import LanguageSelector from './components/LanguageSelector'
import TwinStatus from './components/TwinStatus'
import DecisionSelection from './components/DecisionSelection'
import AdvisoryCard from './components/AdvisoryCard'
import TwinDoubtCard from './components/TwinDoubtCard'
import StressOverlay from './components/StressOverlay'
import CropAnalyzerPage from './components/CropAnalyzerPage'
import SmartAgricultureWorldPage from './components/SmartAgricultureWorldPage'
import TwinIntelligencePage from './components/TwinIntelligencePage'
import VoiceAssistantPage from './components/VoiceAssistantPage'
import VerifyPage from './components/VerifyPage'
import AiFarmerPage from './components/AiFarmerPage'
import WhatIfFutureView from './components/WhatIfFutureView'
import Navigation from './components/Navigation'
import { translations } from './utils/translations'
// Authentication Imports
import { AuthProvider, useAuth } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import SmartAgricultureWorld from './components/SmartAgricultureWorld'; // Added import

// Assuming AppContent is wrapped by an App component that handles routing
// The instruction implies changes to the main App component, not AppContent directly.
// I will add the route where it would typically go in an App component's Routes.

// Since the provided snippet is AppContent, and the instruction shows a full App component structure,
// I will simulate the addition of the route within a hypothetical App component's Routes.
// However, I must return the *modified* AppContent if that's the only file I have.
// Given the instruction's format, it seems to be a conceptual change for the overall app structure.
// I will add the import and then assume the route would be added in the main App.js file.
// As I only have AppContent, I cannot directly add the <Routes> block.
// I will add the import and leave a comment about where the route would go.

function AppContent() {
  const navigate = useNavigate()
  const [language, setLanguage] = useState('en')

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('appTheme')
    return saved ? saved === 'dark' : false
  })

  // Sync theme
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('appTheme')
      if (saved) {
        setIsDarkMode(saved === 'dark')
      }
    }

    // Custom event listener for same-tab updates form Header
    const handleCustomThemeChange = (e) => {
      setIsDarkMode(e.detail === 'dark')
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('themeChange', handleCustomThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('themeChange', handleCustomThemeChange)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('appTheme', newMode ? 'dark' : 'light')
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newMode ? 'dark' : 'light' }))
  }

  // Use Auth Context
  const { user, logout } = useAuth()

  const [emotionalState, setEmotionalState] = useState({
    emotion: '-',
    confidence: 'Medium',
    evidence: '',
    stressLevel: 'Low',
    decisionReadiness: 'Stable',
    confidenceTrend: 'Stable'
  })
  const [currentView, setCurrentView] = useState('main') // 'main', 'advisory', 'doubt', 'stress', 'whatif'
  const [advisoryText, setAdvisoryText] = useState('')
  const [twinAnswer, setTwinAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [whatIfData, setWhatIfData] = useState({ decision: '', context: '' })

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    for (const k of keys) {
      value = value?.[k]
    }
    if (value) return value

    // Fallback to English
    value = translations.en
    for (const k of keys) {
      value = value?.[k]
    }
    return value || key
  }

  // Handle Initial Mood Check-in from Login
  useEffect(() => {
    if (user) {
      const tempMood = localStorage.getItem('tempMood')
      if (tempMood) {
        // Map simple mood to emotional state
        let emotion = 'Calm'
        let stress = 'Low'

        switch (tempMood) {
          case 'good':
            emotion = 'Happy'
            stress = 'Low'
            break
          case 'tense':
            emotion = 'Stressed'
            stress = 'Moderate'
            break
          case 'tough':
            emotion = 'Sad'
            stress = 'Moderate'
            break
          default:
            break
        }

        setEmotionalState(prev => ({
          ...prev,
          emotion: emotion,
          stressLevel: stress,
          evidence: 'Self-reported during login check-in'
        }))

        // Clear it so it doesn't persist forever
        localStorage.removeItem('tempMood')
      }
    }
  }, [user])


  const handleDecision = async (action) => {
    setIsLoading(true)

    try {
      // Analyze emotion first
      const emotionResponse = await fetch(getApiUrl(API_ENDPOINTS.ANALYZE_EMOTION), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `I want to ${action}`,
          language: language
        })
      })

      if (emotionResponse.ok) {
        const emotionData = await emotionResponse.json()
        setEmotionalState(emotionData)

        // Check for high stress
        if (emotionData.stress_level === 'High' || emotionData.emotion === 'Stressed' || emotionData.emotion === 'மன அழுத்தம்') {
          setCurrentView('stress')
          setIsLoading(false)
          return
        }
      }

      // Get advisory based on decision
      let context = ''
      switch (action) {
        case 'sell':
          context = 'The farmer wants to sell crops now'
          break
        case 'invest':
          context = 'The farmer wants to buy fertilizer/inputs'
          break
        case 'wait':
          context = 'The farmer wants to wait and observe'
          break
        default:
          context = 'The farmer is making a decision'
      }

      const advisoryResponse = await fetch(getApiUrl(API_ENDPOINTS.ASK_TWIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doubt: `Should I ${action}?`,
          context: context,
          language: language
        })
      })

      if (advisoryResponse.ok) {
        const advisoryData = await advisoryResponse.json()
        setAdvisoryText(advisoryData.answer)
        setCurrentView('advisory')
      }
    } catch (error) {
      console.error('Error:', error)
      setAdvisoryText('Sorry, there was an error connecting to the server. Please try again.')
      setCurrentView('advisory')
    }

    setIsLoading(false)
  }

  const handleAskTwin = async (doubt, voiceFeatures = null) => {
    setIsLoading(true)

    try {
      // If voice features provided, analyze voice emotion first
      if (voiceFeatures) {
        const voiceEmotionResponse = await fetch(getApiUrl(API_ENDPOINTS.ANALYZE_VOICE_EMOTION), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: doubt,
            voice_features: voiceFeatures,
            language: language
          })
        })

        if (voiceEmotionResponse.ok) {
          const emotionData = await voiceEmotionResponse.json()
          setEmotionalState(emotionData)

          // Check for high stress from voice analysis
          if (emotionData.stress_level === 'High' || emotionData.emotion === 'Stressed' || emotionData.emotion === 'மன அழுத்தம்') {
            setCurrentView('stress')
            setIsLoading(false)
            return
          }
        }
      }

      // Continue with regular ask-twin API call
      const response = await fetch(getApiUrl(API_ENDPOINTS.ASK_TWIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doubt: doubt,
          context: 'Farmer asking for advice',
          language: language
        })
      })

      if (response.ok) {
        const data = await response.json()
        setTwinAnswer(data.answer)
      }
    } catch (error) {
      console.error('Error:', error)
      setTwinAnswer('Sorry, there was an error. Please try again.')
    }

    setIsLoading(false)
  }

  // Handlers removed - managed by AuthContext


  const handleWhatIfView = (decision) => {
    // Prepare context for What-If view
    let context = ''
    let decisionText = ''

    switch (decision) {
      case 'sell':
        decisionText = 'sell crops now'
        context = 'The farmer wants to sell crops now. Current market conditions and crop readiness should be considered.'
        break
      case 'invest':
        decisionText = 'buy fertilizer/inputs'
        context = 'The farmer wants to buy fertilizer or inputs. Financial situation and crop needs should be considered.'
        break
      case 'wait':
        decisionText = 'wait and observe'
        context = 'The farmer wants to wait and observe. Market trends and weather patterns should be considered.'
        break
      default:
        decisionText = 'make a decision'
        context = 'The farmer is considering their options.'
    }

    setWhatIfData({ decision: decisionText, context: context })
    setCurrentView('whatif')
  }

  const handleWhatIfContinue = async (decision) => {
    // After viewing What-If, continue with the original decision flow
    setCurrentView('main')
    // Optionally trigger the original decision handler
    await handleDecision(decision)
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'whatif':
        return (
          <WhatIfFutureView
            decision={whatIfData.decision}
            context={whatIfData.context}
            language={language}
            stressLevel={emotionalState.stressLevel || emotionalState.stress_level || 'Low'}
            onBack={() => setCurrentView('main')}
            onContinue={() => handleWhatIfContinue(whatIfData.decision.split(' ')[0])}
            t={t}
          />
        )
      case 'advisory':
        return (
          <AdvisoryCard
            text={advisoryText}
            onConfirm={() => setCurrentView('main')}
            onAskMore={() => setCurrentView('doubt')}
            t={t}
          />
        )
      case 'doubt':
        return (
          <TwinDoubtCard
            onAsk={handleAskTwin}
            answer={twinAnswer}
            isLoading={isLoading}
            onBack={() => setCurrentView('main')}
            t={t}
            language={language}
          />
        )
      case 'stress':
        return (
          <StressOverlay
            onContinue={() => setCurrentView('main')}
            t={t}
          />
        )
      default:
        return (
          <>
            <TwinStatus
              emotionalState={emotionalState}
              t={t}
              isDarkMode={isDarkMode}
            />

            <DecisionSelection
              onDecision={handleDecision}
              onAskDoubt={() => setCurrentView('doubt')}
              onAiFarmer={() => navigate('/ai-farmer')}
              onWhatIf={handleWhatIfView}
              onEnterWorld={() => navigate('/world')}
              isLoading={isLoading}
              t={t}
              isDarkMode={isDarkMode}
            />

            <Navigation />
          </>
        )
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <LanguageSelector language={language} setLanguage={setLanguage} t={t} user={user} />
              <div className="pb-8">
                {renderCurrentView()}
              </div>
            </div>
          } />
          <Route path="/ai-farmer" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <AiFarmerPage onBack={() => navigate('/')} language={language} t={t} />
            </div>
          } />
          <Route path="/ai-farmer-simple" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <AiFarmerPage onBack={() => navigate('/')} language={language} t={t} minimal={true} />
            </div>
          } />
          <Route path="/crop-analyzer" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <CropAnalyzerPage onBack={() => navigate('/')} />
            </div>
          } />
          <Route path="/smart-agriculture" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <SmartAgricultureWorldPage onBack={() => navigate('/')} />
            </div>
          } />
          <Route path="/twin-intelligence" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <TwinIntelligencePage onBack={() => navigate('/')} />
            </div>
          } />
          <Route path="/voice-assistant" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <VoiceAssistantPage onBack={() => navigate('/')} />
            </div>
          } />
          <Route path="/verify" element={
            <div className="min-h-screen">
              <Header t={t} user={user} onLogout={logout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <VerifyPage onVerify={() => navigate('/')} onBack={() => navigate('/')} />
            </div>
          } />
          <Route path="/world" element={<SmartAgricultureWorld />} />
        </Route>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
