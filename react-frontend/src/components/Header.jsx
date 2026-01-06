import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sun, Moon } from 'lucide-react'
import API_BASE_URL from '../utils/api'

const Header = ({ t, user, onLogout, isDarkMode: externalDarkMode, toggleTheme: externalToggleTheme }) => {
  const navigate = useNavigate()
  const { uploadProfileImage } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef(null)
  /* Removed duplicate menuRef */
  const fileInputRef = useRef(null)

  // Internal Dark/Light Mode Logic (Fallback)
  const [internalDarkMode, setInternalDarkMode] = useState(() => {
    const saved = localStorage.getItem('appTheme')
    return saved ? saved === 'dark' : false
  })

  // Determine effective state and handler
  const isDarkMode = externalDarkMode !== undefined ? externalDarkMode : internalDarkMode

  const handleInternalToggle = () => {
    const newMode = !internalDarkMode
    setInternalDarkMode(newMode)
    localStorage.setItem('appTheme', newMode ? 'dark' : 'light')
    // Dispatch custom event to notify other components immediately
    window.dispatchEvent(new CustomEvent('themeChange', { detail: newMode ? 'dark' : 'light' }))
  }

  const toggleTheme = externalToggleTheme || handleInternalToggle

  // Sync theme across tabs/components
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('appTheme')
      if (saved) {
        setIsDarkMode(saved === 'dark')
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for a custom event 'themeChange' for in-app sync without reload
    const handleCustomThemeChange = (e) => {
      setIsDarkMode(e.detail === 'dark')
    }
    window.addEventListener('themeChange', handleCustomThemeChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('themeChange', handleCustomThemeChange)
    }
  }, [])

  /* Internal toggle logic replaced by adaptive handler above */

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAuthClick = () => {
    if (user) {
      setShowUserMenu(!showUserMenu)
    } else {
      navigate('/login')
    }
  }

  const handleLogout = () => {
    setShowUserMenu(false)
    onLogout()
  }

  const handleImageUpdate = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB")
        return
      }
      await uploadProfileImage(file)
      // Small delay to let image refresh if needed, usually React state update handles it
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3"> {/* Increased max-width for better spacing */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl animate-bounce-gentle">🌾</div> {/* Slightly larger logo */}
            <div>
              <h1 className="text-xl font-bold text-primary-700 leading-tight tracking-tight">
                {t('title')}
              </h1>
              {user && (
                <p className="text-xs text-gray-500 font-medium">
                  Welcome back, {(user.name || user.email).split(' ')[0]}
                </p>
              )}
            </div>
          </div>


          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">

                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-full transition-all duration-300 ${isDarkMode
                    ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700 ring-1 ring-slate-600'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 ring-1 ring-indigo-200'
                    }`}
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* User Info Display - Desktop */}
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-gray-900 leading-none mb-1">{user.name || 'Farmer'}</div>
                  <div className="text-xs text-gray-500 font-mono">{user.status === 'active' ? '🟢 Active' : '⚫ Offline'}</div>
                </div>

                {/* User Avatar with Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={handleAuthClick}
                    className="flex items-center justify-center w-12 h-12 rounded-full ring-2 ring-offset-2 ring-green-100 hover:ring-green-200 transition-all duration-300 overflow-hidden shadow-sm"
                    title="Open Profile"
                  >
                    {user.profile_image ? (
                      <img
                        src={`${API_BASE_URL}${user.profile_image}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700">
                        <span className="text-xl font-bold">{(user.name || 'F')[0].toUpperCase()}</span>
                      </div>
                    )}
                  </button>

                  {/* Enhanced Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-0 z-50 animate-fade-in origin-top-right overflow-hidden">
                      {/* Profile Header Background */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 flex flex-col items-center border-b border-green-100">
                        {/* Large Profile Image */}
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-white mb-3">
                            {user.profile_image ? (
                              <img
                                src={`${API_BASE_URL}${user.profile_image}`}
                                alt="Profile Large"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-500 text-4xl">
                                {(user.name || 'F')[0].toUpperCase()}
                              </div>
                            )}
                          </div>

                          {/* Update Photo Overlay Button */}
                          <button
                            onClick={() => fileInputRef.current.click()}
                            className="absolute bottom-2 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-200 text-gray-600 hover:text-green-600 hover:border-green-200 transition-all duration-200"
                            title="Update Photo"
                          >
                            📷
                          </button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpdate}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{user.name || 'Farmer'}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>

                        <div className="mt-3 flex gap-2">
                          <span className="px-2 py-1 bg-white rounded-md text-xs font-medium text-green-700 border border-green-200 shadow-sm">
                            🌿 Premium Plan
                          </span>
                        </div>
                      </div>

                      {/* Menu Options */}
                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200 flex items-center space-x-3 font-medium"
                        >
                          <span className="text-lg">🚪</span>
                          <span>Sign Out</span>
                        </button>
                      </div>

                      <div className="bg-gray-50 px-6 py-2 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">Farmer Digital Twin v1.0</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <button
                onClick={handleAuthClick}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span>🔐</span>
                <span className="text-sm font-bold tracking-wide">Sign In</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-1 text-center sm:hidden">
          <p className="text-xs text-gray-500 italic">
            {t('subtitle')}
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
