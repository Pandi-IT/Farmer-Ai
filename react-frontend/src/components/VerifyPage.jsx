import React, { useState } from 'react'

const VerifyPage = ({ onBack, onVerify }) => {
  const [verificationCode, setVerificationCode] = useState('')
  const [email, setEmail] = useState('')
  const [step, setStep] = useState('email') // 'email' or 'code'
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSendCode = async () => {
    if (!email) {
      setMessage('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('code')
      setMessage(`Verification code sent to ${email}`)
    } catch (error) {
      setMessage('Failed to send verification code. Please try again.')
    }
    setIsLoading(false)
  }

  const handleVerify = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setMessage('Please enter a valid 6-digit verification code')
      return
    }

    setIsLoading(true)
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1500))
      onVerify()
      setMessage('Account verified successfully!')
    } catch (error) {
      setMessage('Invalid verification code. Please try again.')
    }
    setIsLoading(false)
  }

  const handleResendCode = () => {
    setVerificationCode('')
    setStep('email')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Verification</h1>
          <p className="text-gray-600">Verify your email to access all Farmer Digital Twin features</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {step === 'email' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Your Email</h2>
                <p className="text-gray-600 text-sm">We'll send a verification code to your email address</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                />
              </div>

              <button
                onClick={handleSendCode}
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Sending Code...</span>
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter Verification Code</h2>
                <p className="text-gray-600 text-sm">Check your email for the 6-digit verification code</p>
              </div>

              <div className="text-center">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setVerificationCode(value)
                  }}
                  placeholder="000000"
                  maxLength="6"
                  disabled={isLoading}
                  className="text-center text-2xl font-mono tracking-widest w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                />
                <div className="flex justify-center space-x-2 mt-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${
                        index < verificationCode.length
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 bg-gray-50 text-gray-400'
                      }`}
                    >
                      {verificationCode[index] || '•'}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVerify}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    'Verify Account'
                  )}
                </button>

                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg text-center ${
              message.includes('success')
                ? 'bg-green-50 border border-green-200 text-green-800'
                : message.includes('Invalid') || message.includes('Failed')
                ? 'bg-red-50 border border-red-200 text-red-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get after verification:</h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">🤖</span>
              <span className="text-gray-700">Full AI Digital Twin access</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">🌾</span>
              <span className="text-gray-700">Crop health analysis</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl">📊</span>
              <span className="text-gray-700">Advanced analytics dashboard</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">🎙️</span>
              <span className="text-gray-700">Voice assistant features</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <span className="text-2xl">💾</span>
              <span className="text-gray-700">Data backup and sync</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
              <span className="text-2xl">📱</span>
              <span className="text-gray-700">Mobile app notifications</span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ← Back to Main
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyPage
