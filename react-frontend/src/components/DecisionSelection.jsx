import React, { useState } from 'react'

const DecisionSelection = ({ onDecision, onAskDoubt, onAiFarmer, onWhatIf, onEnterWorld, isLoading, t, isDarkMode }) => {
  const [selectedDecision, setSelectedDecision] = useState(null)

  const handleDecision = (action) => {
    if (!isLoading) {
      onDecision(action)
    }
  }

  const handleWhatIf = (action) => {
    if (!isLoading && onWhatIf) {
      setSelectedDecision(action)
      onWhatIf(action)
    }
  }

  return (
    <div className={`rounded-xl shadow-lg border p-6 mx-4 mb-6 animate-slide-up transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
      <div className="text-center mb-6">
        <h2 className={`text-xl font-bold mb-2 flex items-center justify-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
          <span className="text-2xl">🎯</span>
          <span>{t('whatPlanning')}</span>
        </h2>
        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Choose your next farming action</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Smart World Button */}
        <button
          className="group relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-xl font-semibold text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-2"
          onClick={onEnterWorld}
          disabled={isLoading}
        >
          <div className="flex items-center space-x-3">
            <div className="text-3xl group-hover:rotate-12 transition-transform">🌍</div>
            <div>
              <div className="font-bold text-lg">Enter Smart Agriculture World</div>
              <div className="text-xs opacity-90 text-indigo-100">Interactive Farm Visualization</div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-50 group-hover:translate-x-1 transition-transform">
            Example ➜
          </div>
        </button>












        <button
          className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white p-4 rounded-xl font-semibold text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={onAiFarmer}
          disabled={isLoading}
          aria-label="Ask AI Farmer"
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl group-hover:animate-bounce">🤖</div>
            <div>
              <div className="font-bold">{t('aiFarmer')}</div>
              <div className="text-xs opacity-90">{t('aiFarmerDesc')}</div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>

        <button
          className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-xl font-semibold text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={onAskDoubt}
          disabled={isLoading}
          aria-label="Ask your digital twin"
        >
          <div className="flex items-center space-x-3">
            <div className="text-2xl group-hover:animate-bounce">🤔</div>
            <div>
              <div className="font-bold">{t('askYourTwin')}</div>
              <div className="text-xs opacity-90">Get expert advice</div>
            </div>
          </div>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>
      </div>

      {
        isLoading && (
          <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-blue-800 font-medium">Analyzing your decision...</span>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default DecisionSelection
