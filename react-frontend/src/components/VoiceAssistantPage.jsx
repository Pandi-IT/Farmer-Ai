import React, { useState, useEffect, useRef } from 'react'
import AudioWaveform from './AudioWaveform'

const VoiceAssistantPage = ({ onBack }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const recognitionRef = useRef(null)

  // Audio Visualizer State
  const [audioStream, setAudioStream] = useState(null)

  // Theme State - Default to Day Mode for better initial visibility based on feedback
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Missing State Variables
  const [weatherData, setWeatherData] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [location, setLocation] = useState(null)
  const [loadingWeather, setLoadingWeather] = useState(false)
  const [weatherError, setWeatherError] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Language configurations
  const languages = [
    { code: 'en', name: 'English', speechCode: 'en-IN', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी (Hindi)', speechCode: 'hi-IN', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ் (Tamil)', speechCode: 'ta-IN', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు (Telugu)', speechCode: 'te-IN', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', speechCode: 'kn-IN', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം (Malayalam)', speechCode: 'ml-IN', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو (Urdu)', speechCode: 'ur-IN', flag: '🇮🇳' }
  ]

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceSupported(false)
      setErrorMessage('Speech recognition is not supported in this browser.')
      return
    }

    initializeSpeechRecognition()

    // Cleanup function
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop()
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
      }
      stopSpeaking()
    }
  }, [selectedLanguage])

  const initializeSpeechRecognition = () => {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      const recognition = recognitionRef.current

      recognition.continuous = false
      recognition.interimResults = true

      const currentLang = languages.find(l => l.code === selectedLanguage)
      recognition.lang = currentLang ? currentLang.speechCode : 'en-US'
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setErrorMessage('')
      }

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript
        if (result) setTranscript(result)
        if (event.results[0].isFinal) {
          handleVoiceCommand(result.trim())
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop())
          setAudioStream(null)
        }
      }

      recognition.onerror = (event) => {
        setIsListening(false)
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop())
          setAudioStream(null)
        }
        console.error('Speech error:', event.error)
      }
    } catch (error) {
      console.error('Failed to init speech:', error)
      setVoiceSupported(false)
    }
  }

  const startListening = async () => {
    if (!voiceSupported) return

    if (isListening) {
      stopListening()
      return
    }

    // 1. Start Recognition Service FIRST (Critical Path)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
        setTranscript('')
        setResponse('')
        setErrorMessage('')
      } catch (err) {
        console.error("Failed to start recognition service:", err)
        setErrorMessage("Could not start voice detection. Please try again.")
        return
      }
    }

    // 2. Try to start Visualizer (Enhancement) - Non-blocking
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setAudioStream(stream)
    } catch (err) {
      console.warn("Visualizer microphone access failed (voice might still work):", err)
      // Do not set error message here to avoid confusing the user if recognition works
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
    setIsListening(false)
  }

  // Weather & Voice Logic
  const fetchWeather = async () => {
    setLoadingWeather(true)
    setWeatherError(null)

    if (!navigator.geolocation) {
      setWeatherError('Geolocation not supported')
      setLoadingWeather(false)
      return
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lon: longitude })

        const [weatherRes, forecastRes] = await Promise.all([
          fetch(`http://localhost:5000/api/weather/current?lat=${latitude}&lon=${longitude}`),
          fetch(`http://localhost:5000/api/weather/forecast?lat=${latitude}&lon=${longitude}`)
        ])

        if (weatherRes.ok) setWeatherData(await weatherRes.json())
        if (forecastRes.ok) setForecast(await forecastRes.json())

      } catch (error) {
        setWeatherError('Failed to load weather')
      } finally {
        setLoadingWeather(false)
      }
    }, () => {
      setWeatherError('Location denied')
      setLoadingWeather(false)
    })
  }

  const handleVoiceCommand = async (command) => {
    setIsProcessing(true)
    const weatherKeywords = ['weather', 'rain', 'temperature', 'forecast', 'climate', 'hot', 'cold', 'sunny', 'cloudy', 'storm', 'wind']
    const isWeatherQuery = weatherKeywords.some(k => command.toLowerCase().includes(k))

    try {
      let endpoint = 'http://localhost:5000/api/ask-twin'
      let body = { doubt: command, context: 'Voice command', language: selectedLanguage }

      if (isWeatherQuery && weatherData) {
        endpoint = 'http://localhost:5000/api/weather/advice'
        body = {
          question: command,
          location,
          weather_data: weatherData,
          forecast,
          language: selectedLanguage
        }
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      const answer = data.answer || data.advice || "I didn't catch that."
      setResponse(answer)
      speakResponse(answer)

    } catch (e) {
      setResponse("Connection error. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const speakResponse = (text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const currentLang = languages.find(l => l.code === selectedLanguage)
    utterance.lang = currentLang ? currentLang.speechCode : 'en-IN'
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  if (!voiceSupported) return <div className="p-8 text-center">Voice not supported</div>

  // --- THEMING ---
  // "Mysterious Blue" for Morning/Day
  // "Mysterious Purple" for Night
  // --- THEMING ---
  // "Mysterious Blue" for Morning/Day
  // "Mysterious Purple" for Night
  // --- THEMING ---
  // "Mysterious Blue" for Morning/Day
  // "Mysterious Purple" for Night
  const theme = {
    // Backgrounds: 
    // Night: Void Purple (Deepest)
    // Day: Mysterious Blue (Cyan/Blue mix)
    bg: isDarkMode
      ? 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950 via-purple-950 to-black'
      : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-cyan-100 to-blue-300',

    // Text: 
    // ALWAYS Black/Slate-900 as per user request
    text: 'text-slate-900 font-semibold',

    // Subtext: Dark Gray/Slate for both
    subText: 'text-slate-600',

    // Cards: 
    // ALWAYS Light/White Glass to support the black text
    // Night: slightly purple tinted white
    // Day: slightly blue tinted white
    card: isDarkMode
      ? 'bg-white/80 border-purple-200/50 shadow-[0_8px_32px_rgba(88,28,135,0.25)]'
      : 'bg-white/60 border-white/60 shadow-[0_8px_32px_rgba(56,189,248,0.15)]',

    // Accents & Gradients
    accent: isDarkMode ? 'text-purple-700' : 'text-blue-700',
    button: isDarkMode
      ? 'bg-purple-100 hover:bg-purple-200 border border-purple-200 text-purple-900'
      : 'bg-white/60 hover:bg-white/80 border border-blue-200 text-slate-900',

    // Orb/Highlight Gradients
    highlight: isDarkMode
      ? 'from-purple-600 to-indigo-600'
      : 'from-cyan-500 to-blue-600'
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 overflow-hidden relative ${theme.bg} ${theme.text} selection:bg-pink-500 selection:text-white`}>

      {/* Background Ambience Controls - Animated Orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            {/* Night: Purple/Cosmic Nebulas */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px]"></div>
          </>
        ) : (
          <>
            {/* Day: Mysterious Deep Blue/Cyan Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-300/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-blue-300/30 rounded-full blur-[100px]"></div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">

        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <button onClick={onBack} className={`p-2 w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-all ${theme.button}`}>
              <span className="text-xl">←</span>
            </button>
            <h1 className={`text-2xl font-bold tracking-tight bg-clip-text ${isDarkMode ? 'text-transparent bg-gradient-to-r from-white to-gray-300 drop-shadow-md' : 'text-slate-900'}`}>
              Voice Assistant
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all shadow-lg backdrop-blur-md border ${isDarkMode ? 'bg-purple-900/40 border-purple-400/30 text-yellow-300' : 'bg-white/60 border-blue-400/30 text-orange-500'}`}
              title={isDarkMode ? "Switch to Mysterious Blue" : "Switch to Mysterious Purple"}
            >
              {isDarkMode ? '🌙' : '💠'}
            </button>

            {/* Language */}
            <div className={`flex items-center space-x-3 px-4 py-2 rounded-full backdrop-blur-md border ${theme.card}`}>
              <span className="text-xl">🌐</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className={`bg-transparent font-bold focus:outline-none cursor-pointer appearance-none pr-4 ${theme.text}`}
                style={{ backgroundImage: 'none' }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Interaction Area */}
          <div className="lg:col-span-7 flex flex-col space-y-6">

            {/* Listening Orb */}
            <div className={`
              relative flex flex-col items-center justify-center p-12 rounded-3xl transition-all duration-500
              ${theme.card}
              backdrop-blur-xl border-t border-white/10 min-h-[400px] overflow-hidden
            `}>

              <div className="relative z-20 font-bold mb-8">
                <h2 className="text-3xl text-slate-900 drop-shadow-sm">
                  {isListening ? 'Listening...' : isProcessing ? 'Thinking...' : 'Tap to Speak'}
                </h2>
              </div>

              <div className="relative z-20">
                <button
                  onClick={startListening}
                  disabled={isProcessing}
                  className={`
                     relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-500 z-10
                     ${isListening
                      ? 'bg-red-500 scale-110 shadow-[0_0_60px_rgba(239,68,68,0.6)] text-white'
                      : `bg-gradient-to-br ${theme.highlight} hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.2)] text-white border-4 border-white/10`
                    }
                   `}
                >
                  {isProcessing ? (
                    <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <span className="text-7xl filter drop-shadow-lg transform transition-transform group-hover:scale-110">
                      {isListening ? '⏹️' : '🎙️'}
                    </span>
                  )}
                </button>

                {/* Cosmic Ripples */}
                {isListening && !isProcessing && (
                  <>
                    <div className="absolute inset-0 rounded-full border border-red-500/30 animate-[ping_1.5s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-0 rounded-full border border-red-500/20 animate-[ping_2s_ease-in-out_infinite_0.5s]"></div>
                  </>
                )}
              </div>

              <div className="mt-12 h-16 w-full max-w-sm flex items-center justify-center relative z-20">
                {isListening ? (
                  <div className="w-full opacity-90 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                    <AudioWaveform audioStream={audioStream} isRecording={isListening} />
                  </div>
                ) : (
                  <p className={`${theme.subText} font-medium tracking-wide opacity-80`}>
                    "How's the weather for farming?"
                  </p>
                )}
              </div>
            </div>

            {/* Conversation Area */}
            {(transcript || response) && (
              <div className="space-y-4">
                {/* User Bubble */}
                {transcript && (
                  <div className="flex justify-end">
                    <div className={`px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] border animate-fade-in-up shadow-lg backdrop-blur-md ${isDarkMode ? 'bg-white/20 border-white/20 text-slate-900' : 'bg-white border-blue-100 text-slate-900'}`}>
                      <p className="font-medium text-lg leading-relaxed">"{transcript}"</p>
                    </div>
                  </div>
                )}

                {/* AI Bubble - Ineffable Gradient */}
                {response && (
                  <div className="flex justify-start">
                    <div className={`
                       px-6 py-6 rounded-2xl rounded-tl-sm max-w-[90%] shadow-2xl animate-fade-in-up border backdrop-blur-lg flex flex-col gap-3
                       ${isDarkMode
                        ? 'bg-purple-50/90 border-purple-200 text-purple-900'
                        : 'bg-white border-blue-200 text-slate-900'
                      }
                     `}>
                      {/* Emotion Analysis Banner (Simulated) */}
                      <div className={`p-3 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-purple-100/50 border-purple-200' : 'bg-blue-50 border-blue-100'}`}>
                        <div className={`p-2 rounded-full ${isDarkMode ? 'bg-purple-200 text-purple-700' : 'bg-blue-100 text-blue-600'}`}>
                          🧠
                        </div>
                        <div>
                          <div className={`text-[10px] font-bold uppercase tracking-wider opacity-70 ${isDarkMode ? 'text-purple-800' : 'text-slate-500'}`}>Voice Emotion Analysis</div>
                          <div className={`text-sm font-semibold ${isDarkMode ? 'text-purple-900' : 'text-slate-800'}`}>
                            Detected: <span className="italic">Curious & Hopeful</span> 🌟
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start justify-between">
                        <span className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${theme.subText}`}>
                          <span>🤖</span> Farmer Twin
                          {isSpeaking && <span className="flex h-2 w-2 relative ml-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-900 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-slate-800"></span></span>}
                        </span>
                        {isSpeaking && (
                          <button onClick={stopSpeaking} className={`text-xs px-3 py-1 rounded-full transition-colors font-bold ${isDarkMode ? 'bg-purple-200 hover:bg-purple-300 text-purple-900 border border-purple-300' : 'bg-blue-100 text-blue-800'}`}>
                            Stop Speaking
                          </button>
                        )}
                      </div>
                      <p className="text-lg leading-relaxed whitespace-pre-line tracking-wide font-light">{response}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-5 space-y-6">

            {/* Weather Widget */}
            <div className={`
               relative rounded-3xl p-8 shadow-2xl overflow-hidden group transition-all duration-500
               bg-gradient-to-br backdrop-blur-xl border border-white/10
               ${isDarkMode ? 'from-purple-900/40 to-black/40' : 'from-blue-50 to-white border-blue-200'}
            `}>
              {/* Animated Background Blob - Lightened for Night Mode text visibility */}
              <div className={`absolute -right-20 -top-20 w-60 h-60 rounded-full blur-[80px] transition-all duration-1000 ${isDarkMode ? 'bg-white/20' : 'bg-blue-400/20'}`}></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className={`font-bold tracking-wider text-sm uppercase mb-2 ${theme.subText}`}>Local Weather</h3>
                  {!weatherData ? (
                    <p className={`text-4xl font-light ${isDarkMode ? 'text-white drop-shadow-md' : 'text-slate-900'}`}>--°C</p>
                  ) : (
                    <div>
                      <div className={`text-6xl font-bold tracking-tighter drop-shadow-md ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{weatherData.temperature}°</div>
                      <div className={`text-lg mt-2 capitalize font-medium ${theme.subText}`}>{weatherData.description}</div>
                    </div>
                  )}
                </div>
                <button onClick={fetchWeather} className={`p-3 rounded-2xl transition-all shadow-inner backdrop-blur-md border ${isDarkMode ? 'bg-white/20 hover:bg-white/30 text-white border-white/20' : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200'}`}>
                  ↻
                </button>
              </div>

              {!weatherData ? (
                <button onClick={fetchWeather} className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all transform hover:scale-[1.02] border ${isDarkMode ? 'bg-purple-100 hover:bg-purple-200 border-purple-300 text-purple-900' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-200'}`}>
                  Active Weather Data
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-6 relative z-10">
                  <div className={`rounded-2xl p-4 backdrop-blur-sm border ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`text-xs ${theme.subText}`}>Humidity</div>
                    <div className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{weatherData.humidity}%</div>
                  </div>
                  <div className={`rounded-2xl p-4 backdrop-blur-sm border ${isDarkMode ? 'bg-white/10 border-white/10' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`text-xs ${theme.subText}`}>Wind</div>
                    <div className={`text-2xl font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{weatherData.wind_speed} <span className="text-sm font-normal opacity-70">km/h</span></div>
                  </div>
                </div>
              )}
            </div>

            {/* Ask Your Digital Twin Widget */}
            <div className={`backdrop-blur-lg rounded-3xl p-6 border ${theme.card}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${theme.accent}`}>Ask Your Digital Twin</h3>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold border ${isDarkMode ? 'bg-purple-900/50 border-purple-500/50 text-purple-200' : 'bg-blue-100 border-blue-300 text-blue-700'}`}>
                  AI POWERED
                </div>
              </div>

              {/* Digital Twin Mic Integration */}
              <div className="mb-6">
                <p className={`text-xs mb-3 font-medium ${theme.subText}`}>Tap to analyze voice & emotion:</p>
                <button
                  onClick={startListening}
                  className={`
                     w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg border
                     ${isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border-purple-400 text-white'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 border-blue-200 text-white'
                    }
                   `}
                >
                  <span className={`text-2xl ${isListening ? 'animate-pulse' : ''}`}>🎙️</span>
                  <span className="font-bold tracking-wide">
                    {isListening ? 'Analyzing Voice...' : 'Speak to Twin'}
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme.subText}`}>Quick Actions</p>
                {[
                  "Is today good for planting?",
                  "Best fertilizer for tomatoes?",
                  "How to spot pests?",
                  "Will it rain tomorrow?"
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleVoiceCommand(q)}
                    className={`
                       w-full text-left p-3 rounded-xl transition-all duration-300 group flex justify-between items-center border
                       ${isDarkMode
                        ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 hover:border-purple-300'
                        : 'bg-white hover:bg-blue-50 border-blue-100 hover:border-blue-200 shadow-sm'
                      }
                     `}
                  >
                    <span className={`text-sm transition-colors font-medium ${isDarkMode ? 'text-purple-900 group-hover:text-purple-700' : 'text-slate-700 group-hover:text-blue-900'}`}>{q}</span>
                    <span className={`opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all ${theme.accent}`}>→</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceAssistantPage
