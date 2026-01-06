import React, { useState } from 'react'
import VoiceRecorder from './VoiceRecorder'

const TwinDoubtCard = ({ onAsk, answer, isLoading, onBack, t, language }) => {
  const [doubt, setDoubt] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [voiceFeatures, setVoiceFeatures] = useState(null)
  const [voiceEmotion, setVoiceEmotion] = useState(null)

  const handleSubmit = () => {
    if (doubt.trim() && !isLoading) {
      onAsk(doubt.trim(), voiceFeatures)
      // Reset voice features after submission
      setVoiceFeatures(null)
      setVoiceEmotion(null)
    }
  }

  const handleTranscript = React.useCallback((transcript) => {
    // Append transcript to existing doubt text
    setDoubt(prev => {
      const newText = prev ? `${prev} ${transcript}` : transcript
      return newText.trim()
    })
  }, [])

  const handleVoiceFeatures = (features) => {
    setVoiceFeatures(features)
    console.log('Voice features extracted:', features)
  }

  const handleKeyDown = (e) => {
    // Submit on Enter, allow Shift+Enter for new line
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent new line
      handleSubmit()
    }
  }

  const getEmotionEmoji = (emotion) => {
    const emojiMap = {
      'Happy': '😊',
      'மகிழ்ச்சி': '😊',
      'Calm': '😌',
      'அமைதி': '😌',
      'Sad': '😢',
      'வருத்தம்': '😢',
      'Angry': '😠',
      'கோபம்': '😠',
      'Stressed': '😰',
      'மன அழுத்தம்': '😰',
      'Neutral': '😐',
      'நடுநிலை': '😐',
      'Unclear': '🤔',
      'தெளிவற்ற': '🤔'
    }
    return emojiMap[emotion] || '🤔'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mx-4 mb-6 animate-slide-up">
      <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
        <span className="text-2xl">🤔</span>
        <span>{t('askYourTwin')}</span>
      </h2>
      <p className="text-gray-600 text-sm mb-6">
        {t('askAnything')}
      </p>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <textarea
            className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none min-h-24"
            value={doubt}
            onChange={(e) => setDoubt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typeDoubt') || 'Type your question or use voice input... (Press Enter to send)'}
            disabled={isLoading || isRecording}
            aria-label="Type your question"
          />

          {/* Voice Recorder positioned in top-right of textarea */}
          <div className="absolute top-2 right-2">
            <VoiceRecorder
              onTranscript={handleTranscript}
              onVoiceFeatures={handleVoiceFeatures}
              language={language || 'en'}
              isRecording={isRecording}
              onRecordingChange={setIsRecording}
            />
          </div>
        </div>

        {/* Voice Features Display */}
        {voiceFeatures && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <span className="text-lg">🎵</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-1">Voice Analysis Detected:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
                  <div>
                    <span className="font-medium">Pitch:</span> {voiceFeatures.pitch}
                  </div>
                  <div>
                    <span className="font-medium">Volume:</span> {voiceFeatures.volume}
                  </div>
                  <div>
                    <span className="font-medium">Speaking Rate:</span> {voiceFeatures.speaking_rate}
                  </div>
                  <div>
                    <span className="font-medium">Tone:</span> {voiceFeatures.pitch_variability}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          onClick={handleSubmit}
          disabled={!doubt.trim() || isLoading || isRecording}
        >
          <div className="flex items-center justify-center space-x-2">
            <span>{t('askDigitalTwin')}</span>
            {isLoading && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            )}
          </div>
        </button>
      </div>

      {answer && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <div className="text-green-800">
            <strong className="block mb-2">Digital Twin Response:</strong>
            <div className="whitespace-pre-wrap">{answer}</div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          onClick={onBack}
        >
          ← Back to Main
        </button>
      </div>
    </div>
  )
}

export default TwinDoubtCard
