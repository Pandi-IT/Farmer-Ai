import React from 'react'

const LanguageSelector = ({ language, setLanguage, t, user }) => {
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🌐</span>
          <label htmlFor="languageSelect" className="text-sm font-medium text-gray-700">
            {t('selectLanguage')}
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <select
            id="languageSelect"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={language}
            onChange={handleLanguageChange}
            aria-label="Select language"
          >
            <option value="en">🇺🇸 English</option>
            <option value="hi">🇮🇳 हिंदी</option>
            <option value="es">🇪🇸 Español</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="ta">🇮🇳 தமிழ் (Tamil)</option>
            <option value="te">🇮🇳 తెలుగు (Telugu)</option>
            <option value="kn">🇮🇳 ಕನ್ನಡ (Kannada)</option>
            <option value="ml">🇮🇳 മലയാളം (Malayalam)</option>
            <option value="ur">🇮🇳 اردو (Urdu)</option>
          </select>

          {user && (
            <div className="flex items-center space-x-1 text-xs text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Active</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector
