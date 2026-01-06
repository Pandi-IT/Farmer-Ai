import React from 'react'

const StressOverlay = ({ onContinue, t }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('pauseMoment')}</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {t('highStress')}<br />
          {t('calmStep')}
        </p>
        <button
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={onContinue}
        >
          {t('continueCalmly')}
        </button>
      </div>
    </div>
  )
}

export default StressOverlay
