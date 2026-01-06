import React, { useState, useRef } from 'react'
import { Upload, Search, ChevronLeft, AlertCircle, CheckCircle2, FlaskConical, Stethoscope, ShieldCheck, Leaf, Info, Moon, Sun } from 'lucide-react'

const CropAnalyzerPage = ({ onBack }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const fileInputRef = useRef(null)

  // Dark/Light Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('appTheme')
    return saved ? saved === 'dark' : true // Default to dark for analyzer initially
  })

  // Save theme preference
  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('appTheme', newMode ? 'dark' : 'light')
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('http://localhost:5001/api/analyze-crop-image', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result.analysis)
      } else {
        setAnalysis({
          disease_name: 'Analysis Error',
          visual_symptoms: 'Unable to analyze the image. Please try again.',
          severity: 'Unknown',
          confidence_level: 'Low'
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysis({
        disease_name: 'Connection Error',
        visual_symptoms: 'Unable to connect to analysis service.',
        severity: 'Unknown',
        confidence_level: 'Low'
      })
    }
    setIsAnalyzing(false)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const renderContent = (content) => {
    if (!content) return null
    if (typeof content === 'string') return <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{content}</p>
    return (
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(content).map(([key, value]) => (
          <div key={key} className={`backdrop-blur-md p-4 rounded-xl border transition-all duration-300 ${isDarkMode ? 'bg-white/5 border-white/10 hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500/50'}`}>
            <h5 className="font-semibold text-emerald-500 capitalize mb-1 flex items-center gap-2">
              <Info className="w-4 h-4" />
              {key.replace(/_/g, ' ')}
            </h5>
            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{String(value)}</p>
          </div>
        ))}
      </div>
    )
  }

  return (

    <div className={`min-h-screen relative overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-slate-50' : 'bg-slate-50 text-slate-900'}`}>

      {/* ═══════════════════════════════════════════════════════════════
          🌌 DYNAMIC BACKGROUND SYSTEM
      ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-700">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[128px]"></div>
            <div className="absolute bottom-0 -right-4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px]"></div>
            <div className="absolute inset-0 bg-[url('https://grain-url.com')] opacity-5 mix-blend-overlay"></div>
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-blue-50/50 opacity-80"></div>
          </>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Header & Controls */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${isDarkMode
              ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white'
              : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 ${isDarkMode
                ? 'bg-white/5 hover:bg-white/10 text-yellow-400 border border-white/10'
                : 'bg-white hover:bg-slate-50 text-orange-500 border border-slate-200 shadow-sm'
                }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isDarkMode
                ? 'bg-emerald-500/20 border-emerald-500/30'
                : 'bg-emerald-100 border-emerald-200'
                }`}>
                <Leaf className={`w-6 h-6 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 uppercase tracking-wider">CropGuard AI</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h1 className={`text-5xl md:text-6xl font-black mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Advanced <span className="text-emerald-500">Crop Health</span> <br /> Diagnostics
          </h1>
          <p className={`text-lg max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Harness the power of neural networks to identify diseases and receive expert treatment recommendations in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Section */}
          <div className="lg:col-span-12">
            <div className={`backdrop-blur-xl border rounded-3xl p-8 shadow-2xl relative group overflow-hidden transition-all duration-300 ${isDarkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-white/60 border-white/40 shadow-emerald-900/5'
              }`}>
              <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${isDarkMode
                ? 'from-emerald-500/10 to-transparent'
                : 'from-emerald-500/5 to-transparent'
                }`}></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div
                  className={`relative border-2 border-dashed transition-all duration-500 rounded-2xl aspect-square md:aspect-video flex flex-col items-center justify-center cursor-pointer overflow-hidden ${imagePreview
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : isDarkMode
                      ? 'border-white/10 hover:border-emerald-500/30 bg-white/5 hover:bg-white/[0.07]'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50 hover:bg-slate-100'
                    }`}
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img
                        src={imagePreview}
                        alt="Crop to analyze"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30 flex items-center gap-2">
                          <Upload className="w-5 h-5 text-white" />
                          <span className="text-white font-medium">Reset Photo</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-center p-8">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center border group-hover:scale-110 transition-transform duration-500 ${isDarkMode
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-emerald-50 border-emerald-100'
                        }`}>
                        <Upload className={`w-10 h-10 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </div>
                      <div>
                        <p className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Primary Diagnosis</p>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Drag or click to upload high-res crop imagery</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Preparation</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Ensure the image is clear, taken under good lighting, and focuses on the affected area for high-precision results.</p>
                  </div>

                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Support for Leaf, Fruit, and Root Analysis</span>
                    </div>
                    <div className={`flex items-center gap-3 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Instant pathogen identification</span>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  <button
                    onClick={handleAnalyze}
                    disabled={!selectedImage || isAnalyzing}
                    className="w-full group relative py-4 px-6 rounded-2xl font-bold transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:from-emerald-400 group-hover:to-blue-400 transition-all duration-300"></div>
                    <div className="relative flex items-center justify-center gap-3 text-white">
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                          <span>Quantum Processing...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          <span>Initiate AI Analysis</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {analysis && (
            <div className="lg:col-span-12 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-500">Diagnosis Report</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 backdrop-blur-xl border rounded-3xl p-8 ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-slate-200'
                  }`}>
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Identified Condition</span>
                      <h3 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{analysis.disease_name}</h3>
                    </div>
                    <div className="flex gap-3">
                      <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border flex items-center gap-2 ${analysis.severity?.toLowerCase() === 'high'
                        ? 'bg-red-500/10 border-red-500/20 text-red-500'
                        : analysis.severity?.toLowerCase() === 'medium'
                          ? 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                        }`}>
                        <AlertCircle className="w-4 h-4" />
                        {analysis.severity} Risk
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        {analysis.confidence_level} Confidence
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className={`rounded-2xl p-6 border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-emerald-400" />
                        Pathological Observations
                      </h4>
                      {renderContent(analysis.visual_symptoms)}
                    </div>

                    {analysis.treatment && (
                      <div className={`rounded-2xl p-6 border ${isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-emerald-50/50 border-emerald-100'}`}>
                        <h4 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          <Stethoscope className="w-4 h-4" />
                          Recommended Protocol
                        </h4>
                        {renderContent(analysis.treatment)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className={`backdrop-blur-xl border rounded-3xl p-8 ${isDarkMode ? 'bg-gradient-to-b from-white/10 to-transparent border-white/10' : 'bg-gradient-to-b from-white to-slate-50 border-slate-200'
                    }`}>
                    <h4 className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Expert Recommendations</h4>
                    <div className="space-y-6">
                      {[
                        { emoji: "🌱", title: "Vitality Check", desc: "Monitor leaf turgidity daily." },
                        { emoji: "💧", title: "Hydro Balance", desc: "Optimize irrigation schedule." },
                        { emoji: "🌿", title: "Micro-nutrients", desc: "Test soil nitrogen levels." },
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 group">
                          <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border transition-colors ${isDarkMode
                            ? 'bg-white/5 border-white/10 group-hover:border-emerald-500/50'
                            : 'bg-white border-slate-200 group-hover:border-emerald-500/50'
                            }`}>
                            <span className="text-xl">{item.emoji}</span>
                          </div>
                          <div>
                            <h5 className={`font-bold text-sm mb-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h5>
                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {analysis.prevention && (
                    <div className={`rounded-3xl p-8 border ${isDarkMode ? 'bg-blue-500/5 border-blue-500/10' : 'bg-blue-50 border-blue-100'}`}>
                      <h4 className="text-sm font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Bio-Security
                      </h4>
                      <div className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {renderContent(analysis.prevention)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CropAnalyzerPage
