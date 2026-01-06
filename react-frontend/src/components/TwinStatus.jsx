import React from 'react'

const TwinStatus = ({ emotionalState, t, isDarkMode }) => {
  const getStatusColor = (value) => {
    if (!value || value === '-') return '#6b7280'
    if (value.includes('High') || value.includes('Stressed') || value.includes('மன அழுத்தம்') || value.includes('High')) return '#ef4444'
    if (value.includes('Low') || value.includes('Calm') || value.includes('அமைதி')) return '#22c55e'
    if (value.includes('Stable') || value.includes('நிலையான')) return '#3b82f6'
    return '#f59e0b' // Moderate/warning
  }

  return (
    <div className={`rounded-xl shadow-lg border p-6 mx-4 mb-6 animate-slide-up transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
      }`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold flex items-center space-x-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <span className="text-2xl">📊</span>
          <span>{t('currentState')}</span>
        </h2>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'}`}>
          <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">
            {t('emotionalState')}
          </div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            {emotionalState.emotion || 'Analyzing...'}
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'}`}>
          <div className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">
            {t('stress')}
          </div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
            {emotionalState.stressLevel || 'Low'}
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'}`}>
          <div className="text-xs font-semibold text-green-500 uppercase tracking-wide mb-1">
            {t('decisionReadiness')}
          </div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
            {emotionalState.decisionReadiness || 'Stable'}
          </div>
        </div>

        <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'}`}>
          <div className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">
            {t('confidenceTrend')}
          </div>
          <div className={`text-lg font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>
            {emotionalState.confidenceTrend || 'Stable'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TwinStatus
