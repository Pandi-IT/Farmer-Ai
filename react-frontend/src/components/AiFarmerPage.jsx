import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Search, ChevronLeft, AlertCircle, CheckCircle2, FlaskConical,
  Stethoscope, ShieldCheck, Leaf, Info, Moon, Sun,
  Sparkles, Globe, DollarSign, ShoppingBag, Clock, Bot, BrainCircuit, X,
  ArrowRight
} from 'lucide-react'
import CheckAvailabilityButton from './cold-storage/CheckAvailabilityButton'
import ColdStorageIntelligence from './cold-storage/ColdStorageIntelligence'

const AiFarmerPage = ({ onBack, language = 'en', t = (k) => k, minimal = false }) => {
  const [selectedTopic, setSelectedTopic] = useState('general')
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [location, setLocation] = useState(null)
  const [mapError, setMapError] = useState('')
  const [isWhatIfResponse, setIsWhatIfResponse] = useState(false)
  const [showColdStorage, setShowColdStorage] = useState(false)


  const [isActionsOpen, setIsActionsOpen] = useState(false) // State for Smart Actions Menu
  const [activeSimulation, setActiveSimulation] = useState(null) // State for active What-If simulation
  const recognitionRef = useRef(null)
  const navigate = useNavigate()
  const chatSectionRef = useRef(null) // Ref for scrolling to chat

  // Dark/Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('appTheme')
    return saved ? saved === 'dark' : false
  })

  // Save theme preference
  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('appTheme', newMode ? 'dark' : 'light')
  }

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('appTheme')
      if (saved) {
        setIsDarkMode(saved === 'dark')
      }
    }

    // Custom event listener for same-tab updates
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

  // Mapping for Speech API (Both STT and TTS)
  const langMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'ur': 'ur-IN'
  }

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceSupported(false)
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      stopSpeaking()
    }
  }, [])

  const startListening = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      const recognition = recognitionRef.current

      recognition.continuous = false
      recognition.interimResults = true

      recognition.lang = langMap[language] || 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setQuestion(transcript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      console.error('Speech recognition error:', error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const speakResponse = (text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = langMap[language] || 'en-IN'

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const handleSpeechToggle = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speakResponse(response)
    }
  }

  const topics = [
    { id: 'general', title: 'topics.general', icon: '🌾' },
    { id: 'crops', title: 'topics.crops', icon: '🌱' },
    { id: 'soil', title: 'topics.soil', icon: '🌱' },
    { id: 'weather', title: 'topics.weather', icon: '🌦️' },
    { id: 'market', title: 'topics.market', icon: '💰' },
    { id: 'pests', title: 'topics.pests', icon: '🐛' },
    { id: 'irrigation', title: 'topics.irrigation', icon: '💧' },
    { id: 'equipment', title: 'topics.equipment', icon: '🚜' }
  ]

  const quickQuestions = {
    general: [
      'What crops should I plant this season?',
      'How do I improve my farm productivity?',
      'What are the best farming practices?',
      'How can I reduce farming costs?'
    ],
    crops: [
      'How do I know when to harvest my crops?',
      'What are signs of crop diseases?',
      'How to improve crop yield?',
      'Best fertilizers for my soil type?'
    ],
    soil: [
      'How to test soil pH?',
      'What nutrients does my soil need?',
      'How to improve soil fertility?',
      'Soil conservation techniques?'
    ],
    weather: [
      'How does drought affect my crops?',
      'Preparing for heavy rainfall?',
      'Frost protection methods?',
      'Weather-based farming decisions?'
    ],
    market: [
      'When is the best time to sell crops?',
      'Current market prices?',
      'Storage options for crops?',
      'Government farming subsidies?'
    ],
    pests: [
      'Common pests in my region?',
      'Natural pest control methods?',
      'When to use pesticides?',
      'Integrated pest management?'
    ],
    irrigation: [
      'Best irrigation methods?',
      'Water conservation techniques?',
      'Drip irrigation setup?',
      'Irrigation scheduling?'
    ],
    equipment: [
      'Essential farming equipment?',
      'Equipment maintenance tips?',
      'Cost-effective machinery?',
      'Modern farming technology?'
    ]
  }

  // Detect if response is a What-If Future View
  const detectWhatIfResponse = (text) => {
    const whatIfMarkers = [
      'If you act now',
      'If you wait',
      'நீங்கள் இப்போது முடிவு எடுத்தால்',
      'நீங்கள் சிறிது காலம் காத்திருந்தால்'
    ]
    return whatIfMarkers.some(marker => text.includes(marker))
  }

  const handleAskQuestion = async (questionText) => {
    setIsLoading(true)
    // Stop any previous speech when asking a new question
    stopSpeaking()
    try {
      const response = await fetch('http://localhost:5000/api/ask-twin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doubt: questionText,
          context: `Farming question about ${t(`topics.${selectedTopic}`)}`,
          language: language
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResponse(data.answer)
        // Detect if it's a What-If response
        setIsWhatIfResponse(detectWhatIfResponse(data.answer))
        // Auto-play the response
        speakResponse(data.answer)
      } else {
        setResponse('Sorry, I couldn\'t process your question. Please try again.')
        setIsWhatIfResponse(false)
      }
    } catch (error) {
      console.error('AI Farmer error:', error)
      setResponse('Sorry, there was an error connecting to the AI service.')
      setIsWhatIfResponse(false)
    }
    setIsLoading(false)
  }

  const handleFindStorage = () => {
    if (!navigator.geolocation) {
      setMapError(t('geoNotSupported') || 'Geolocation is not supported by your browser')
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
        setShowMap(true)
        setIsLoading(false)
        setMapError('')
      },
      (error) => {
        console.error('Error getting location:', error)
        setMapError(t('locDenied') || 'Location access denied. Please enable location to find storage.')
        setIsLoading(false)
      }
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (question.trim()) {
      handleAskQuestion(question.trim())
    }
  }

  const handleQuickQuestion = (q) => {
    setQuestion(q)
    handleAskQuestion(q)
  }

  // Smart Actions Navigation Handlers
  const handleSmartAction = (actionId) => {
    setIsActionsOpen(false)
    switch (actionId) {
      case 'world':
        navigate('/world')
        break
      case 'sell':
        setActiveSimulation({ type: 'sell', title: 'Sell Crop Now', icon: '💰' })
        break
      case 'buy':
        setActiveSimulation({ type: 'buy', title: 'Buy Fertilizer / Inputs', icon: '🌱' })
        break
      case 'wait':
        setActiveSimulation({ type: 'wait', title: 'Wait & Observe', icon: '⏳' })
        break
      case 'ai':
        chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
        break
      case 'twin':
        navigate('/twin-intelligence')
        break
      default:
        break
    }
  }

  // Simulation Modal Content
  const renderSimulationContent = () => {
    if (!activeSimulation) return null

    // Mock Data for Simulations (In a real app, this would be dynamic/AI-generated)
    const simulations = {
      sell: {
        prediction: "Market Prices Peaking",
        trend: "up",
        confidence: "87%",
        advice: "Selling now maximizes immediate returns, but waiting 3 days might yield +5% due to predicted supply shortage.",
        impact: "High Immediate Cashflow"
      },
      buy: {
        prediction: "Optimal Input Timing",
        trend: "stable",
        confidence: "92%",
        advice: "Soil moisture is perfect for fertilization. Investing now ensures robust growth before the next dry spell.",
        impact: "Long-term Yield Boost"
      },
      wait: {
        prediction: "Weather Risk Approaching",
        trend: "down",
        confidence: "75%",
        advice: "A minor storm is predicted in 48 hours. Waiting allows you to assess damage before committing resources.",
        impact: "Risk Mitigation"
      }
    }

    const data = simulations[activeSimulation.type]

    return (
      <div className="flex flex-col h-full">
        <div className={`p-6 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{activeSimulation.icon}</span>
            <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{activeSimulation.title}</h3>
          </div>
          <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>AI-Powered Future Simulation</p>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Simulation Visualization (Abstract) */}
          <div className={`w-full h-48 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
            <div className={`absolute inset-0 opacity-20 bg-[url('https://grain-url.com')]`}></div>
            {data.trend === 'up' && <div className="text-green-500 text-6xl font-bold animate-pulse">📈 +5%</div>}
            {data.trend === 'stable' && <div className="text-blue-500 text-6xl font-bold animate-pulse">⚖️ Stable</div>}
            {data.trend === 'down' && <div className="text-orange-500 text-6xl font-bold animate-pulse">⚠️ Risk</div>}
          </div>

          <div className="space-y-6">
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-emerald-500">Core Prediction</h4>
              <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{data.prediction}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-blue-500">Confidence</h4>
                <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{data.confidence}</p>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-500">Impact</h4>
                <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{data.impact}</p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border-l-4 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500 text-emerald-200' : 'bg-emerald-50 border-emerald-500 text-emerald-800'}`}>
              <p className="italic">"{data.advice}"</p>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
          <button
            onClick={() => setActiveSimulation(null)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            Proceed with Action
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-4 transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-4xl mx-auto relative">


        <div className="text-center mb-8 pt-8">
          <div className="text-6xl mb-4 animate-bounce">🤖</div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t('aiFarmer')}</h1>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{t('aiSubtitle')}</p>
        </div>

        <div className="space-y-8">
          {!minimal && (
            <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white'}`}>
              <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('selectTopic')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${selectedTopic === topic.id
                      ? isDarkMode ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300' : 'border-primary-500 bg-primary-50 text-primary-700'
                      : isDarkMode ? 'border-slate-700 bg-slate-700/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700' : 'border-gray-200 bg-gray-50 hover:border-primary-300 hover:bg-primary-25'
                      }`}
                    onClick={() => setSelectedTopic(topic.id)}
                  >
                    <div className="text-2xl mb-2">{topic.icon}</div>
                    <div className="text-sm font-medium">{t(topic.title)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('askQuestion')}</h2>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`${t('askPlaceholder')} ${t(`topics.${selectedTopic}`).toLowerCase()}...`}
                  rows="4"
                  disabled={isLoading}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none pr-12 transition-colors ${isDarkMode
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:ring-cyan-500 focus:border-cyan-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`absolute right-3 bottom-3 p-2 rounded-full transition-all duration-200 ${isListening
                      ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    title={isListening ? t('listening') : t('tapToSpeak')}
                  >
                    <span className="text-xl">🎤</span>
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="mt-3 w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{t('thinking')}</span>
                  </div>
                ) : (
                  t('askBtn')
                )}
              </button>
            </form>

            {!minimal && (
              <div>
                <h3 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{t('quickQTitle')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {quickQuestions[selectedTopic]?.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(q)}
                      disabled={isLoading}
                      className={`text-left p-3 border rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
                        ? 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-cyan-500/50'
                        : 'bg-gray-50 border-gray-200 hover:bg-primary-50 hover:border-primary-300 text-gray-700'
                        }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {response && (
            <div ref={chatSectionRef} className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white'}`}>
              {isWhatIfResponse ? (
                // What-If Future View Response
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-center flex-1 flex items-center justify-center space-x-2">
                      <span>🔮</span>
                      <span>{language === 'ta' ? 'இரண்டு சாத்தியமான எதிர்காலங்கள்' : 'Two Possible Futures'}</span>
                    </h2>
                    <button
                      onClick={handleSpeechToggle}
                      className={`p-2 rounded-full transition-colors duration-200 ${isSpeaking
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : isDarkMode ? 'bg-slate-700 text-cyan-400 hover:bg-slate-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      title={isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
                    >
                      <span className="text-xl">{isSpeaking ? '⏹️' : '🔊'}</span>
                    </button>
                  </div>

                  {/* Parse and display What-If response */}
                  <div className="space-y-4">
                    {/* Introduction */}
                    {response.split('\n\n')[0] && (
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                        <p className="text-gray-700 text-center italic">
                          {response.split('\n\n')[0]}
                        </p>
                      </div>
                    )}

                    {/* Two Paths */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Path 1: If you act now */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-green-800">
                            {language === 'ta' ? 'நீங்கள் இப்போது முடிவு எடுத்தால்' : 'If you act now'}
                          </h3>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {/* Extract "If you act now" section */}
                          {(() => {
                            const actNowMarker = language === 'ta' ? '**நீங்கள் இப்போது முடிவு எடுத்தால்:**' : '**If you act now:**'
                            const waitMarker = language === 'ta' ? '**நீங்கள் சிறிது காலம் காத்திருந்தால்:**' : '**If you wait'
                            const startIdx = response.indexOf(actNowMarker)
                            const endIdx = response.indexOf(waitMarker)
                            if (startIdx !== -1 && endIdx !== -1) {
                              return response.substring(startIdx + actNowMarker.length, endIdx).trim()
                            }
                            return 'Information not available'
                          })()}
                        </div>
                      </div>

                      {/* Path 2: If you wait */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-blue-800">
                            {language === 'ta' ? 'நீங்கள் சிறிது காலம் காத்திருந்தால்' : 'If you wait a little'}
                          </h3>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {/* Extract "If you wait" section */}
                          {(() => {
                            const waitMarker = language === 'ta' ? '**நீங்கள் சிறிது காலம் காத்திருந்தால்:**' : '**If you wait'
                            const startIdx = response.indexOf(waitMarker)
                            if (startIdx !== -1) {
                              const afterMarker = response.substring(startIdx + waitMarker.length)
                              // Get until the closing message
                              const closingMarkers = [
                                'Market conditions',
                                'சந்தை நிலைமைகள்'
                              ]
                              let endIdx = afterMarker.length
                              for (const marker of closingMarkers) {
                                const idx = afterMarker.indexOf(marker)
                                if (idx !== -1 && idx < endIdx) {
                                  endIdx = idx
                                }
                              }
                              return afterMarker.substring(0, endIdx).trim()
                            }
                            return 'Information not available'
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Closing Reflection */}
                    {(() => {
                      const closingMarkers = ['Market conditions', 'சந்தை நிலைமைகள்']
                      for (const marker of closingMarkers) {
                        const idx = response.indexOf(marker)
                        if (idx !== -1) {
                          return (
                            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-400">
                              <div className="flex items-start">
                                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                                  <span className="text-white text-sm">💡</span>
                                </div>
                                <p className="text-gray-700 italic flex-1">
                                  {response.substring(idx).trim()}
                                </p>
                              </div>
                            </div>
                          )
                        }
                      }
                      return null
                    })()}
                  </div>
                </div>
              ) : (
                // Regular AI Response
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-xl font-semibold flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      <span>🤖</span>
                      <span>{t('aiResponse')}</span>
                    </h2>
                    <button
                      onClick={handleSpeechToggle}
                      className={`p-2 rounded-full transition-colors duration-200 ${isSpeaking
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : isDarkMode ? 'bg-slate-700 text-cyan-400 hover:bg-slate-600' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      title={isSpeaking ? 'Stop Speaking' : 'Read Aloud'}
                    >
                      <span className="text-xl">{isSpeaking ? '⏹️' : '🔊'}</span>
                    </button>
                  </div>
                  <div className={`rounded-lg p-4 border-l-4 transition-colors ${isDarkMode
                    ? 'bg-slate-700/50 border-cyan-500 text-slate-200'
                    : 'bg-gray-50 border-primary-500 text-gray-700'
                    }`}>
                    <p className="whitespace-pre-wrap">{response}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Storage Finder Section */}
          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-4 flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              <span>🏭</span>
              <span>{t('findStorage') || 'Find Nearby Storage'}</span>
            </h2>

            <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              {t('storageDesc') || 'Locate verified cold storage and warehouses near you to store your crops.'}
            </p>

            <div className="mb-6">
              <CheckAvailabilityButton
                language={language}
                onClick={() => setShowColdStorage(true)}
              />
            </div>

            {!showMap ? (
              <button
                onClick={handleFindStorage}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>📍</span>
                <span>{t('useMyLocation') || 'Use My Location to Find Storage'}</span>
              </button>
            ) : (
              <div className="space-y-4">
                {location ? (
                  <div className="rounded-lg overflow-hidden border border-gray-200 h-[400px]">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=cold+storage+warehouse+near+${location.lat},${location.lon}&output=embed`}
                    ></iframe>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <button
                    onClick={() => setShowMap(false)}
                    className="text-gray-500 hover:text-gray-700 underline"
                  >
                    {t('closeMap') || 'Close Map'}
                  </button>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=cold+storage+warehouse+near+${location.lat},${location.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <span>🗺️</span>
                    <span>{t('getDirections') || 'Get Directions & Route'}</span>
                  </a>
                </div>
              </div>
            )}

            {mapError && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {mapError}
              </div>
            )}
          </div>

          <div className={`rounded-xl shadow-lg p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900/50' : 'bg-white'}`}>
            <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t('aiCapabilities')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🧠', title: 'capTitle.expert', desc: 'capDesc.expert', color: 'blue' },
                { icon: '🌍', title: 'capTitle.regional', desc: 'capDesc.regional', color: 'green' },
                { icon: '📊', title: 'capTitle.data', desc: 'capDesc.data', color: 'purple' },
                { icon: '💬', title: 'capTitle.chat', desc: 'capDesc.chat', color: 'yellow' },
                { icon: '🔄', title: 'capTitle.learn', desc: 'capDesc.learn', color: 'red' },
                { icon: '⚡', title: 'capTitle.realtime', desc: 'capDesc.realtime', color: 'indigo' }
              ].map((cap, i) => (
                <div key={i} className={`text-center p-4 rounded-lg transition-colors ${isDarkMode
                  ? `bg-${cap.color}-900/20`
                  : `bg-gradient-to-br from-${cap.color}-50 to-${cap.color}-100`
                  }`}>
                  <div className="text-3xl mb-3">{cap.icon}</div>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{t(cap.title)}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{t(cap.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className={`font-semibold py-3 px-6 rounded-lg transition-colors duration-200 ${isDarkMode
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            {t('backToMain')}
          </button>
        </div>
      </div>

      <ColdStorageIntelligence
        isOpen={showColdStorage}
        onClose={() => setShowColdStorage(false)}
        language={language === 'ta' ? 'ta' : 'en'}
      />

      {/* ═══════════════════════════════════════════════════════════════
          🔘 SMART FARM ACTIONS FAB (Floating Action Button)
      ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-8 right-8 z-[9999]">
        <button
          onClick={() => setIsActionsOpen(true)}
          className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-110 transition-all duration-300"
          title="Open Smart Farm Actions"
        >
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 animate-ping"></div>
          <Sparkles className="w-8 h-8 text-white animate-pulse" />
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-[#020617]"></span>
        </button>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 text-center">
          <span className={`text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm px-2 py-1 rounded-full ${isDarkMode ? 'text-white bg-black/50' : 'text-slate-800 bg-white/50'}`}>Smart Actions</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          🏗️ SMART ACTIONS MENU OVERLAY
      ═══════════════════════════════════════════════════════════════ */}
      {isActionsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setIsActionsOpen(false)}
          ></div>

          <div className={`relative w-full max-w-4xl transform transition-all duration-300 scale-100 ${isDarkMode
            ? 'bg-[#0f172a]/90 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]'
            : 'bg-white/90 border border-white/40 shadow-[0_0_100px_rgba(0,0,0,0.1)]'
            } backdrop-blur-2xl rounded-[2.5rem] overflow-hidden p-8 md:p-12`}>

            <button
              onClick={() => setIsActionsOpen(false)}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'}`}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="text-center mb-10">
              <h2 className={`text-3xl md:text-4xl font-black mb-2 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Next Action</span>
              </h2>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Select a module to command your digital farm</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { id: 'world', title: 'Enter Smart World', desc: 'Interactive Farm Visualization', icon: <Globe className="w-6 h-6" />, color: 'blue' },
                { id: 'sell', title: 'Sell Crop Now', desc: 'Get cash from harvest', icon: <DollarSign className="w-6 h-6" />, color: 'emerald' },
                { id: 'buy', title: 'Buy Fertilizer', desc: 'Invest in your farm', icon: <ShoppingBag className="w-6 h-6" />, color: 'purple' },
                { id: 'wait', title: 'Wait & Observe', desc: 'Monitor and plan', icon: <Clock className="w-6 h-6" />, color: 'orange' },
                { id: 'ai', title: 'AI Assistant', desc: 'Chat with Farmer AI', icon: <Bot className="w-6 h-6" />, color: 'cyan' },
                { id: 'twin', title: 'Ask Digital Twin', desc: 'Get expert advice', icon: <BrainCircuit className="w-6 h-6" />, color: 'indigo' },
              ].map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleSmartAction(action.id)}
                  className={`group relative p-1 rounded-3xl transition-all duration-300 hover:scale-[1.02] focus:outline-none`}
                >
                  <div className={`absolute inset-0 rounded-3xl opacity-50 blur-lg transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-${action.color}-500/20 to-transparent`}></div>
                  <div className={`relative h-full p-6 rounded-[1.3rem] border flex flex-col items-center text-center gap-4 transition-colors duration-300 ${isDarkMode
                    ? 'bg-[#1e293b]/80 border-white/5 hover:bg-[#1e293b]'
                    : 'bg-white/80 border-slate-100 hover:bg-white'
                    }`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br from-${action.color}-400 to-${action.color}-600 shadow-lg`}>
                      {action.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{action.title}</h3>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{action.desc}</p>
                    </div>
                    {['sell', 'buy', 'wait'].includes(action.id) && (
                      <div className={`mt-auto text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full border ${isDarkMode ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                        }`}>
                        🔮 What-If View
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          🔮 WHAT-IF SIMULATION MODAL
      ═══════════════════════════════════════════════════════════════ */}
      {activeSimulation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300"
            onClick={() => setActiveSimulation(null)}
          ></div>
          <div className={`relative w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] rounded-[2rem] shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-white'}`}>
            <button
              onClick={() => setActiveSimulation(null)}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white`}
            >
              <X className="w-5 h-5" />
            </button>
            {renderSimulationContent()}
          </div>
        </div>
      )}
    </div>
  )
}

export default AiFarmerPage
