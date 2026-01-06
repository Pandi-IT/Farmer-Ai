import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navigation = () => {
  const navigate = useNavigate()

  const navItems = [
    {
      path: '/ai-farmer',
      icon: '🤖',
      title: 'AI Farmer',
      description: 'Expert farming AI assistant'
    },
    {
      path: '/crop-analyzer',
      icon: '🌾',
      title: 'Crop Analyzer',
      description: 'AI crop health analysis'
    },


    {
      path: '/voice-assistant',
      icon: '🎙️',
      title: 'Voice Assistant',
      description: 'Voice-powered farming help'
    }
  ]

  return (
    <div className="p-4 pb-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center space-x-2">
            <span>🚀</span>
            <span>Explore Features</span>
          </h2>
          <p className="text-gray-600 text-sm">Discover all the powerful tools available in your Farmer Digital Twin</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group relative overflow-hidden bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex-shrink-0 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300">
                  →
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          ))}
        </div>


        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-xs font-medium text-gray-700">Real-time AI</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">🌐</div>
              <div className="text-xs font-medium text-gray-700">Multi-language</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">📱</div>
              <div className="text-xs font-medium text-gray-700">Mobile-first</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-1">🔒</div>
              <div className="text-xs font-medium text-gray-700">Secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navigation
