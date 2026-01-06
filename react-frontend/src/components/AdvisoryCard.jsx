import React from 'react'

const AdvisoryCard = ({ text, onConfirm, onAskMore, t }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mx-4 mb-6 animate-slide-up">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <span className="text-2xl">💡</span>
        <span>{t('suggestedGuidance')}</span>
      </h2>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
        <div className="text-gray-700 leading-relaxed">
          {text}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          onClick={onConfirm}
        >
          {t('iUnderstand')}
        </button>

        {onAskMore && (
          <button
            className="bg-transparent hover:bg-gray-50 text-primary-600 border border-primary-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            onClick={onAskMore}
          >
            🤔 Ask More Questions
          </button>
        )}
      </div>
    </div>
  )
}

export default AdvisoryCard
