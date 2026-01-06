import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenerativeFarmWorld from './GenerativeFarmWorld';
import EarthEntryButton from './seasonal/EarthEntryButton';
import DayToggleButton from './seasonal/DayToggleButton';
import DayCycleController from './seasonal/DayCycleController';
import SeasonToggleButton from './seasonal/SeasonToggleButton';
import SeasonController from './seasonal/SeasonController';
import SeasonalInsightPortal from './seasonal/SeasonalInsightPortal';
import AIHumanButton from './seasonal/AIHumanButton';
import AIHumanChat from './seasonal/AIHumanChat';
import { useAuth } from '../context/AuthContext';
// NEW: Import Language Data
import { TRANSLATIONS } from '../data/translations';
import IntrusionAlertManager from './intrusion/IntrusionAlertManager';
import ReportIntrusionModal from './intrusion/ReportIntrusionModal';
import LiveCameraMonitor from './intrusion/LiveCameraMonitor';

const SmartAgricultureWorld = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isWorldInitialized, setIsWorldInitialized] = useState(false);
    const [activeZone, setActiveZone] = useState(null);
    const [activeSeason, setActiveSeason] = useState('SUMMER'); // Default Season
    const [showSeasonalPortal, setShowSeasonalPortal] = useState(false);
    // NEW: State for Multi-Language Support
    const [language, setLanguage] = useState('en'); // Default: English ('en', 'ta', 'hi')

    // Dark/Light Mode State
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('appTheme');
        return saved ? saved === 'dark' : false; // Default to light mode for world if not set, or maybe dark? Let's stick to existing logic or make it consistent.
    });

    // Save theme preference
    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    };

    // Day Cycle State
    const [isRealTime, setIsRealTime] = useState(true);
    const [manualTime, setManualTime] = useState(new Date());
    const [activePhase, setActivePhase] = useState('MORNING');
    const [showAiChat, setShowAiChat] = useState(false);
    const [showSeasons, setShowSeasons] = useState(false);
    const [showDayCycle, setShowDayCycle] = useState(false);

    // Intrusion Alert State
    const [showReportModal, setShowReportModal] = useState(false);
    const [activeAlert, setActiveAlert] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const handleNewAlert = (alert) => {
        setActiveAlert(alert);
        // Auto-clear after 10 seconds
        setTimeout(() => setActiveAlert(null), 10000);
    };

    const handleCameraDetection = async (detection) => {
        // Automatically report to backend
        try {
            const response = await fetch('http://localhost:5000/api/intrusion/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    animal: detection.animal,
                    severity: 'High',
                    location: { name: 'Live Camera Feed' },
                    timestamp: new Date().toISOString()
                })
            });
            // Note: Use the SSE event to show the banner to avoid duplicate logic
            if (response.ok) {
                console.log("Camera alert reported");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handlePhaseSelect = (phase, hours) => {
        const newTime = new Date();
        newTime.setHours(hours, 0, 0, 0);
        setManualTime(newTime);
        setActivePhase(phase);
        setIsRealTime(false);
    };

    // Contextual readiness state
    const readiness = user?.last_readiness || 'READY';

    const handleZoneClick = (zone) => {
        const zoneDetails = {
            crops: {
                id: 'crops',
                label: 'Bioluminescent Crops',
                icon: '🌱',
                type: 'Biological',
            },
            tractor: {
                id: 'tractor',
                label: 'Autonomous Tractor',
                icon: '🚜',
                type: 'Robotics',
                warning: readiness === 'CAUTION'
            },
            drone: {
                id: 'drone',
                label: 'Spectral Scanner',
                icon: '🛸',
                type: 'Surveillance'
            },
            monolith: {
                id: 'monolith',
                label: 'Data Monolith',
                icon: '❖',
                type: 'Core System'
            }
        };
        setActiveZone(zoneDetails[zone]);
    };

    const closeModal = () => setActiveZone(null);

    return (
        <div className="fixed inset-0 bg-slate-950 z-50 overflow-hidden flex items-center justify-center font-sans">
            {!isWorldInitialized ? (
                <EarthEntryButton onClick={() => setIsWorldInitialized(true)} />
            ) : (
                <>
                    {/* 1. Generative 3D Environment with Season Prop */}
                    <GenerativeFarmWorld
                        onZoneClick={handleZoneClick}
                        readinessState={readiness}
                        season={activeSeason}
                        onCaveClick={() => setShowSeasonalPortal(true)}
                        language={language}
                        setLanguage={setLanguage}
                        timeOverride={isRealTime ? null : manualTime}
                        isDarkMode={isDarkMode}
                        activeAlert={activeAlert}
                    />

                    {/* --- INTRUSION ALERT SYSTEM INTEGRATION --- */}
                    <IntrusionAlertManager onAlert={handleNewAlert} />

                    {/* Alert Banner - Top Center */}
                    {activeAlert && (
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-4 bg-red-900/90 backdrop-blur-md border border-red-500/50 text-white px-6 py-4 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.5)] animate-bounce-slow">
                            <div className="text-3xl animate-pulse">⚠️</div>
                            <div>
                                <h3 className="font-bold text-lg leading-none text-red-100 uppercase tracking-wider">
                                    {language === 'ta' ? 'விலங்கு எச்சரிக்கை!' : 'ANIMAL DETECTED!'}
                                </h3>
                                <p className="text-sm text-red-200 opacity-90">
                                    {activeAlert.animal} • {activeAlert.location.name || 'Sector 1'}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveAlert(null)}
                                className="ml-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    {/* Report Intrusion Button - Bottom Left (next to disclosure) */}
                    <div className="absolute bottom-8 left-8 z-50 flex gap-4">
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="bg-red-600/90 hover:bg-red-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-red-900/40 border border-red-400/30 backdrop-blur-sm flex items-center gap-2 transition-all transform hover:scale-105 group"
                        >
                            <span className="text-xl group-hover:rotate-12 transition-transform">📢</span>
                            <span className="text-sm uppercase tracking-wide">
                                {language === 'ta' ? 'எச்சரிக்கை' : 'Report Danger'}
                            </span>
                        </button>

                        <button
                            onClick={() => setShowCamera(!showCamera)}
                            className={`px-5 py-3 rounded-xl font-bold border backdrop-blur-sm flex items-center gap-2 transition-all transform hover:scale-105 ${showCamera ? 'bg-slate-900/90 text-cyan-400 border-cyan-500/50' : 'bg-slate-900/50 text-slate-300 border-white/10'}`}
                        >
                            <span className="text-xl">📹</span>
                            <span className="text-sm uppercase tracking-wide">
                                {language === 'ta' ? 'கேமரா' : 'Live Cam'}
                            </span>
                        </button>
                    </div>

                    {/* Live Camera Modal/Overlay - Draggable or Fixed */}
                    {showCamera && (
                        <div className="absolute bottom-24 left-8 z-50 w-80 animate-slide-up">
                            <LiveCameraMonitor
                                onDetection={handleCameraDetection}
                                language={language}
                            />
                        </div>
                    )}

                    {/* Modal */}
                    {showReportModal && (
                        <ReportIntrusionModal
                            onClose={() => setShowReportModal(false)}
                            language={language}
                            isDarkMode={isDarkMode}
                        />
                    )}
                    {/* ------------------------------------------- */}

                    {/* 2. Top Right Control Panel */}
                    <div className="absolute top-8 right-8 z-40 flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="w-12 h-12 rounded-full backdrop-blur-xl border-2 flex items-center justify-center transition-all duration-500 shadow-lg hover:scale-110"
                            style={{
                                background: isDarkMode
                                    ? 'rgba(15, 23, 42, 0.85)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                borderColor: isDarkMode
                                    ? 'rgba(34, 211, 238, 0.3)'
                                    : 'rgba(16, 185, 129, 0.4)',
                                boxShadow: isDarkMode
                                    ? '0 4px 24px rgba(34, 211, 238, 0.2)'
                                    : '0 4px 24px rgba(16, 185, 129, 0.15)'
                            }}
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                {isDarkMode ? (
                                    <span className="text-xl">🌙</span>
                                ) : (
                                    <span className="text-2xl">☀️</span>
                                )}
                            </div>
                        </button>

                        {/* Language Selector */}
                        <div className="flex gap-2">
                            {['en', 'ta', 'hi'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => setLanguage(lang)}
                                    className="px-3 py-2 rounded-lg text-sm font-bold uppercase transition-all"
                                    style={{
                                        background: language === lang
                                            ? (isDarkMode ? 'rgba(34, 211, 238, 0.2)' : 'rgba(16, 185, 129, 0.15)')
                                            : (isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.7)'),
                                        color: language === lang
                                            ? (isDarkMode ? '#22d3ee' : '#10b981')
                                            : (isDarkMode ? '#94a3b8' : '#64748b'),
                                        border: `2px solid ${language === lang
                                            ? (isDarkMode ? 'rgba(34, 211, 238, 0.4)' : 'rgba(16, 185, 129, 0.4)')
                                            : 'transparent'}`,
                                        backdropFilter: 'blur(12px)'
                                    }}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>

                        {/* Season Toggle Button */}
                        <SeasonToggleButton
                            onClick={() => setShowSeasons(!showSeasons)}
                            language={language}
                            isOpen={showSeasons}
                            isDarkMode={isDarkMode}
                        />

                        {/* Day Cycle Toggle Button */}
                        <DayToggleButton
                            onClick={() => setShowDayCycle(!showDayCycle)}
                            language={language}
                            isOpen={showDayCycle}
                            activePhase={activePhase}
                            isDarkMode={isDarkMode}
                        />
                    </div>

                    {/* 2. Season & Day Cycle Controllers - MAX Z-INDEX FOR ACCESSIBILITY */}
                    <div className="absolute top-32 left-1/2 -translate-x-1/2 z-[999] flex flex-col items-center gap-6 pointer-events-auto">
                        {showDayCycle && (
                            <div className="animate-slide-down">
                                <DayCycleController
                                    activePhase={activePhase}
                                    onSelectPhase={handlePhaseSelect}
                                    isRealTime={isRealTime}
                                    onToggleRealTime={() => setIsRealTime(!isRealTime)}
                                    language={language}
                                />
                            </div>
                        )}

                        {showSeasons && (
                            <div className="animate-slide-down">
                                <SeasonController
                                    activeSeason={activeSeason}
                                    onSelectSeason={setActiveSeason}
                                    language={language}
                                />
                            </div>
                        )}
                    </div>

                    {/* 3. Dashboard Return Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-8 left-8 bg-slate-900/80 text-cyan-100 px-6 py-3 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-slate-800 transition-all transform hover:-translate-y-1 font-semibold border border-cyan-500/30 flex items-center gap-2 group backdrop-blur-md z-40"
                    >
                        <svg className="w-5 h-5 text-cyan-500 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Return to Dashboard
                    </button>

                    {/* AI Human Logo Button */}
                    <div className="absolute bottom-8 right-8 z-[110]">
                        <AIHumanButton
                            onClick={() => setShowAiChat(true)}
                            language={language}
                        />
                    </div>

                    {/* AI Human Chat Interface */}
                    <AIHumanChat
                        isOpen={showAiChat}
                        onClose={() => setShowAiChat(false)}
                        season={activeSeason}
                        language={language}
                    />

                    {/* 4. Seasonal Insight Portal Modal */}
                    {showSeasonalPortal && (
                        <SeasonalInsightPortal
                            season={activeSeason}
                            onClose={() => setShowSeasonalPortal(false)}
                            language={language}
                        />
                    )}

                    {/* 5. Premium Zone Info Modal (Dark Theme) */}
                    {activeZone && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                            <div
                                className="relative bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-8 max-w-lg w-full shadow-[0_0_80px_rgba(6,182,212,0.3)] border border-cyan-500/30 transform transition-all scale-100 animate-slide-up text-slate-100"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>

                                {/* Header Section */}
                                <div className="flex items-start gap-5 mb-6 border-b border-slate-700/50 pb-6">
                                    <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-inner text-4xl border border-slate-700">
                                        {activeZone.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 tracking-tight">{activeZone.label}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`h-2 w-2 rounded-full ${activeZone.warning ? 'bg-red-500 animate-pulse box-shadow-[0_0_10px_red]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}></span>
                                            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">{activeZone.type} Module</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="space-y-5 text-slate-300">
                                    <p className="text-sm text-slate-400">
                                        Detailed metrics for {activeZone.label} are currently aggregating from the sensor node network.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* MANDATORY ETHICAL DISCLOSURE */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[100] bg-black/40 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 pointer-events-none">
                <p className="text-[7px] text-white/40 font-black uppercase tracking-[0.2em] text-center">
                    All visual indicators are derived from real environmental data and agronomic models.
                    This system provides decision support, not guarantees.
                </p>
            </div>
        </div>
    );
};

export default SmartAgricultureWorld;
