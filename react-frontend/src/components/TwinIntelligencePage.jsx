import React, { useState } from 'react'

const TwinIntelligencePage = ({ onBack, isDarkMode }) => {
  const [selectedFeature, setSelectedFeature] = useState('overview')

  const intelligenceFeatures = [
    {
      id: 'overview',
      title: 'AI Intelligence Overview',
      icon: '🧠',
      description: 'Comprehensive overview of our AI capabilities and how they work together.',
      content: (
        <div>
          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>How Our AI Works</h3>
          <p className={`mb-6 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
            Our Farmer Digital Twin uses multiple AI technologies working in harmony to provide
            comprehensive farming support:
          </p>
          <div className="space-y-4">
            <div className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50'}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">1</div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-blue-200' : 'text-gray-900'}`}>Emotional Analysis</h4>
                <p className={`${isDarkMode ? 'text-blue-100/70' : 'text-gray-700'}`}>GPT-4o-mini analyzes your text/voice for emotional state and stress levels</p>
              </div>
            </div>
            <div className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-800' : 'bg-green-50'}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-emerald-500/30">2</div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-emerald-200' : 'text-gray-900'}`}>Context Understanding</h4>
                <p className={`${isDarkMode ? 'text-emerald-100/70' : 'text-gray-700'}`}>Deep learning models understand farming context and decision factors</p>
              </div>
            </div>
            <div className={`flex items-start space-x-4 p-4 rounded-lg transition-colors ${isDarkMode ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50'}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">3</div>
              <div>
                <h4 className={`font-semibold ${isDarkMode ? 'text-purple-200' : 'text-gray-900'}`}>Personalized Response</h4>
                <p className={`${isDarkMode ? 'text-purple-100/70' : 'text-gray-700'}`}>AI generates calm, evidence-based recommendations tailored to your situation</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'nlp',
      title: 'Natural Language Processing',
      icon: '💬',
      description: 'Advanced language understanding for farmer communication.',
      content: (
        <div>
          <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Multi-Language Support</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className={`text-center p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">🇺🇸</div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>English</div>
            </div>
            <div className={`text-center p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">🇮🇳</div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Hindi</div>
            </div>
            <div className={`text-center p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">🇪🇸</div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Spanish</div>
            </div>
            <div className={`text-center p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">🇫🇷</div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>French</div>
            </div>
            <div className={`text-center p-3 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700' : 'bg-gray-50'}`}>
              <div className="text-2xl mb-2">🇮🇳</div>
              <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>Tamil</div>
            </div>
          </div>
          <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Advanced NLP capabilities include:</p>
          <ul className="space-y-4">
            <li className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : ''}`}>
              <span className="text-green-500 mt-1 text-lg">•</span>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Sentiment analysis for emotional state detection</span>
            </li>
            <li className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : ''}`}>
              <span className="text-green-500 mt-1 text-lg">•</span>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Context-aware responses based on farming terminology</span>
            </li>
            <li className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : ''}`}>
              <span className="text-green-500 mt-1 text-lg">•</span>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Voice-to-text conversion for hands-free operation</span>
            </li>
            <li className={`flex items-start space-x-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50 border border-slate-700' : ''}`}>
              <span className="text-green-500 mt-1 text-lg">•</span>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Cultural context understanding for different regions</span>
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision',
      icon: '👁️',
      description: 'AI-powered image analysis for crop health assessment.',
      content: (
        <div>
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Crop Disease Detection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-red-900/20 border-red-800/50' : 'bg-gradient-to-br from-red-50 to-red-100'}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Disease Identification</h4>
              <p className={`text-sm ${isDarkMode ? 'text-red-200/70' : 'text-red-700'}`}>Detects over 50 common crop diseases with 85% accuracy</p>
            </div>
            <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-orange-900/20 border-orange-800/50' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-orange-300' : 'text-orange-800'}`}>Pest Detection</h4>
              <p className={`text-sm ${isDarkMode ? 'text-orange-200/70' : 'text-orange-700'}`}>Identifies pest infestations and recommends treatments</p>
            </div>
            <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800/50' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Nutrient Deficiency</h4>
              <p className={`text-sm ${isDarkMode ? 'text-yellow-200/70' : 'text-yellow-700'}`}>Analyzes leaf color and texture for nutrient deficiencies</p>
            </div>
            <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-blue-900/20 border-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
              <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Environmental Stress</h4>
              <p className={`text-sm ${isDarkMode ? 'text-blue-200/70' : 'text-blue-700'}`}>Detects signs of drought, flooding, or temperature stress</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      icon: '🔮',
      description: 'Forecasting and predictive insights for farming decisions.',
      content: (
        <div>
          <h3 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Smart Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-blue-900/20 border-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
              <span className="text-3xl">🌦️</span>
              <div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Weather Impact Analysis</h4>
                <p className={`text-sm ${isDarkMode ? 'text-blue-200/70' : 'text-blue-700'}`}>Predict how weather patterns will affect your crops</p>
              </div>
            </div>
            <div className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-emerald-900/20 border-emerald-800/50' : 'bg-gradient-to-br from-green-50 to-green-100'}`}>
              <span className="text-3xl">📈</span>
              <div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-emerald-300' : 'text-green-800'}`}>Yield Forecasting</h4>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-200/70' : 'text-green-700'}`}>Estimate crop yields based on current conditions</p>
              </div>
            </div>
            <div className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-yellow-900/20 border-yellow-800/50' : 'bg-gradient-to-br from-yellow-50 to-yellow-100'}`}>
              <span className="text-3xl">💰</span>
              <div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Market Price Prediction</h4>
                <p className={`text-sm ${isDarkMode ? 'text-yellow-200/70' : 'text-yellow-700'}`}>Forecast commodity prices for better selling decisions</p>
              </div>
            </div>
            <div className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-red-900/20 border-red-800/50' : 'bg-gradient-to-br from-red-50 to-red-100'}`}>
              <span className="text-3xl">🐛</span>
              <div>
                <h4 className={`font-semibold mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Disease Outbreak Prediction</h4>
                <p className={`text-sm ${isDarkMode ? 'text-red-200/70' : 'text-red-700'}`}>Early warning system for potential disease outbreaks</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>

      {/* 🌌 INEFFABLE BACKGROUND (TWIN VARIANT) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dynamic Orbs (Brain/AI Colors) */}
        <div className={`absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full filter blur-[100px] animate-pulse-slow ${isDarkMode ? 'bg-purple-600/20 mix-blend-screen opacity-50' : 'bg-purple-300/40 mix-blend-multiply opacity-30'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full filter blur-[100px] animate-pulse-slow animation-delay-2000 ${isDarkMode ? 'bg-cyan-600/20 mix-blend-screen opacity-50' : 'bg-cyan-300/40 mix-blend-multiply opacity-30'}`}></div>

        {/* Floating AI Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full bg-purple-500 animate-float opacity-60 blur-[2px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-cyan-500 animate-float animation-delay-2000 opacity-60 blur-[2px]"></div>
          <div className="absolute top-1/2 right-1/2 w-4 h-4 rounded-full bg-emerald-500 animate-float animation-delay-4000 opacity-40 blur-[3px]"></div>
        </div>

        {/* Tech Grid */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]`}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <div className="text-center mb-12 animate-slide-down">
          <div className="text-7xl mb-6 animate-float inline-block filter drop-shadow-lg">🧠</div>
          <h1 className={`text-4xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r ${isDarkMode ? 'from-purple-200 to-cyan-200' : 'from-purple-600 to-blue-600'}`}>
            Twin Intelligence Hub
          </h1>
          <p className={`text-xl font-light ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
            Explore the advanced AI technologies powering your Farmer Digital Twin
          </p>
        </div>

        <div className="mb-12 animate-slide-up">
          <div className="flex flex-wrap justify-center gap-4">
            {intelligenceFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`group flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-300 hover:scale-105 ${selectedFeature === feature.id
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/50 text-white shadow-lg shadow-purple-900/20'
                    : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-900 shadow-lg shadow-purple-100'
                  : isDarkMode
                    ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                  }`}
              >
                <span className="text-xl filter drop-shadow">{feature.icon}</span>
                <span className="font-semibold">{feature.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`rounded-3xl p-8 mb-12 shadow-2xl backdrop-blur-xl transition-all duration-500 animate-fade-in border ${isDarkMode
          ? 'bg-slate-900/60 border-slate-700/50 shadow-black/20'
          : 'bg-white/90 border-transparent shadow-purple-100'
          }`}>
          {intelligenceFeatures.find(f => f.id === selectedFeature)?.content}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'AI Response Accuracy', value: '99.5%', color: 'purple' },
            { label: 'Average Response Time', value: '<2s', color: 'green' },
            { label: 'AI Availability', value: '24/7', color: 'blue' },
            { label: 'Languages Supported', value: '5', color: 'cyan' }
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl border text-center transition-transform hover:-translate-y-1 ${isDarkMode
              ? 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
              : 'bg-white shadow-lg shadow-slate-100 border-transparent'
              }`}>
              <div className={`text-3xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r ${stat.color === 'purple' ? 'from-purple-400 to-pink-600' :
                stat.color === 'green' ? 'from-green-400 to-emerald-600' :
                  stat.color === 'blue' ? 'from-blue-400 to-indigo-600' :
                    'from-cyan-400 to-blue-600'
                }`}>
                {stat.value}
              </div>
              <div className={`text-sm font-medium uppercase tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pb-8">
          <button
            onClick={onBack}
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center mx-auto space-x-2 ${isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-white hover:bg-gray-50 text-gray-700 shadow-md hover:shadow-lg border border-gray-200'
              }`}
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwinIntelligencePage
