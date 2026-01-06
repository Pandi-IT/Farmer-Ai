import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { getApiUrl, API_ENDPOINTS } from '../utils/api'

function WhatIfFutureView({ decision, context, language, stressLevel, onBack, onContinue, t }) {
    const [whatIfData, setWhatIfData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // Fetch What-If view on component mount
    useEffect(() => {
        const fetchWhatIf = async () => {
            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(getApiUrl(API_ENDPOINTS.WHAT_IF_VIEW), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        decision: decision,
                        context: context,
                        language: language,
                        stress_level: stressLevel
                    })
                })

                if (response.ok) {
                    const data = await response.json()
                    setWhatIfData(data)
                } else {
                    const errorData = await response.json()
                    setError(errorData.error || 'Failed to load What-If view')
                }
            } catch (err) {
                console.error('Error fetching What-If view:', err)
                setError('Unable to connect to the server. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchWhatIf()
    }, [decision, context, language, stressLevel])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
                    <div className="animate-pulse">
                        <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <p className="text-lg text-gray-600">
                            {language === 'ta' ? 'சிந்தித்துக்கொண்டிருக்கிறேன்...' : 'Thinking...'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p className="text-lg text-gray-700 mb-6">{error}</p>
                        <button
                            onClick={onBack}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
                        >
                            {t('common.back')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!whatIfData) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-2">
                        {t('whatif.title')}
                    </h1>
                    <p className="text-base md:text-lg text-gray-600 text-center leading-relaxed">
                        {whatIfData.introduction}
                    </p>
                </div>

                {/* Two Paths Container */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Path 1: If you act now */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg p-6 border-2 border-green-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-green-800">
                                {t('whatif.pathNow')}
                            </h2>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {whatIfData.path_now}
                        </p>
                    </div>

                    {/* Path 2: If you wait a little */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-lg p-6 border-2 border-blue-200">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-blue-800">
                                {t('whatif.pathWait')}
                            </h2>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                            {whatIfData.path_wait}
                        </p>
                    </div>
                </div>

                {/* Closing Reflection */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl shadow-lg p-6 mb-6 border-2 border-purple-200">
                    <div className="flex items-start">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed flex-1">
                            {whatIfData.closing}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onBack}
                        className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors font-medium text-lg shadow-md"
                    >
                        {t('common.back')}
                    </button>
                    <button
                        onClick={onContinue}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-colors font-medium text-lg shadow-lg"
                    >
                        {t('whatif.continue')}
                    </button>
                </div>
            </div>
        </div>
    )
}

WhatIfFutureView.propTypes = {
    decision: PropTypes.string.isRequired,
    context: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    stressLevel: PropTypes.string,
    onBack: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
}

WhatIfFutureView.defaultProps = {
    stressLevel: 'Low'
}

export default WhatIfFutureView
