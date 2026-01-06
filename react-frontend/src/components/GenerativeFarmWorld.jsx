import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SeasonalCave from './seasonal/SeasonalCave';
import GenerativeTree from './seasonal/GenerativeTree';
import AiHuman from './seasonal/AiHuman';
import Waterfall from './seasonal/Waterfall';
import GenerativeForest from './seasonal/GenerativeForest';
import Tractor from './seasonal/Tractor';
import Drone from './seasonal/Drone';
import DataMonolith from './seasonal/DataMonolith';
import CloudSystem from './seasonal/CloudSystem';
import WeatherPanel from './seasonal/WeatherPanel';
import { fetchWeatherIntelligence } from '../utils/WeatherService';
import { calculateBiologicalState } from './BiologicalInferenceEngine';

const BASE_THEMES = {
    RAINY: {
        skyBase: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
        groundBase: 'radial-gradient(circle at 50% 50%, #064e3b 0%, #022c22 100%)',
        accent: '#22d3ee',
        particles: 'SPLASH'
    },
    SUMMER: {
        skyBase: 'from-[#0ea5e9] via-[#38bdf8] to-[#fbbf24]',
        groundBase: 'radial-gradient(circle at 50% 50%, #f59e0b 0%, #b45309 100%)',
        accent: '#fb923c',
        particles: 'FIREFLIES'
    },
    WINTER: {
        skyBase: 'from-[#cbd5e1] via-[#f1f5f9] to-white',
        groundBase: 'radial-gradient(circle at 50% 50%, #eff6ff 0%, #dbeafe 100%)',
        accent: '#38bdf8',
        particles: 'SNOWFALL'
    },
    AUTUMN: {
        skyBase: 'from-[#ea580c] via-[#f97316] to-[#fbbf24]',
        groundBase: 'radial-gradient(circle at 50% 50%, #9a3412 0%, #7c2d12 100%)',
        accent: '#fbbf24',
        particles: 'LEAFFALL'
    }
};

const TIME_MODIFIERS = {
    MORNING: {
        skyOverlay: 'bg-white/5 opacity-0',
        groundTint: 'after:opacity-0',
        celestial: 'SUN',
        brightness: 1
    },
    AFTERNOON: {
        skyOverlay: 'bg-amber-500/10 mix-blend-overlay',
        groundTint: 'after:bg-amber-600/10 after:opacity-100',
        celestial: 'SUN_AFTERNOON',
        brightness: 1.1
    },
    EVENING: {
        skyOverlay: 'bg-gradient-to-t from-purple-900/40 via-orange-900/20 to-transparent',
        groundTint: 'after:bg-orange-900/30 after:opacity-100',
        celestial: 'SUN_EVENING',
        brightness: 0.8
    },
    NIGHT: {
        skyOverlay: 'bg-black/80',
        groundTint: 'after:bg-indigo-950/50 after:opacity-100',
        celestial: 'MOON',
        brightness: 0.4
    }
};

// --- HELPER CALCULATIONS (Moved outside to prevent hoisting/recreation issues) ---
const getSolarPosition = (currentTime) => {
    if (!currentTime) return { x: 50, y: 50, altitude: 0.5, isDay: true, isNight: false };
    const hours = currentTime.getHours() + currentTime.getMinutes() / 60;
    const isDay = hours >= 6 && hours <= 18;

    // Solar Arc (6:00 to 18:00)
    const sunProgress = (hours - 6) / 12;
    const sunRad = sunProgress * Math.PI;

    // Lunar Arc (18:00 to 6:00) - Moon goes UP at night
    let lunarHours = hours < 6 ? hours + 24 : hours;
    const lunarProgress = (lunarHours - 18) / 12;
    const lunarRad = lunarProgress * Math.PI;

    return {
        x: isDay ? (50 + 45 * Math.cos(sunRad)) : (50 + 45 * Math.cos(lunarRad)),
        y: isDay ? (50 - 40 * Math.sin(sunRad)) : (50 - 40 * Math.sin(lunarRad)),
        altitude: Math.max(0, isDay ? Math.sin(sunRad) : Math.sin(lunarRad)),
        isDay: isDay,
        isNight: !isDay
    };
};

const getDayPhase = (currentTime) => {
    if (!currentTime) return 'MORNING';
    const hours = currentTime.getHours();
    if (hours >= 5 && hours < 12) return 'MORNING';
    if (hours >= 12 && hours < 17) return 'AFTERNOON';
    if (hours >= 17 && hours < 20) return 'EVENING';
    return 'NIGHT';
};

const GenerativeFarmWorld = ({
    season,
    onCaveClick,
    onZoneClick,
    readinessState,
    language,
    setLanguage,
    timeOverride = null,
    activeAlert = null
}) => {
    const [currentTime, setCurrentTime] = useState(timeOverride || new Date());
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [weather, setWeather] = useState(null);
    const [showForecast, setShowForecast] = useState(false);
    const [showWeatherIntelligence, setShowWeatherIntelligence] = useState(false);
    const [farmerActions, setFarmerActions] = useState({
        irrigated: false,
        fertilized: false,
        observedStress: false
    });
    const [growthStage, setGrowthStage] = useState('VEGETATIVE');
    const [clouds, setClouds] = useState([]);
    const [showBioModule, setShowBioModule] = useState(false);

    const spawnCloud = () => {
        const newCloud = {
            id: Date.now(),
            x: -20, // Start off-screen
            y: 10 + Math.random() * 30, // Random height
            scale: 0.8 + Math.random() * 1.5,
            opacity: 0.6 + Math.random() * 0.4,
            duration: 60 + Math.random() * 60 // slow drift
        };
        setClouds(prev => [...prev, newCloud]);
        // Cleanup after animation
        setTimeout(() => {
            setClouds(prev => prev.filter(c => c.id !== newCloud.id));
        }, newCloud.duration * 1000);
    };

    // REAL-TIME SOLAR CALCULATION (Deterministic)
    const sun = useMemo(() => getSolarPosition(currentTime), [currentTime]);
    const dayPhase = useMemo(() => getDayPhase(currentTime), [currentTime]);


    const globalBioState = useMemo(() => {
        return calculateBiologicalState({
            season,
            weather,
            timeOfDay: sun || { isDay: true, altitude: 1 },
            actions: farmerActions,
            growthStage
        });
    }, [season, weather, sun, farmerActions, growthStage]);

    useEffect(() => {
        if (timeOverride) {
            setCurrentTime(timeOverride);
            return;
        }
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, [timeOverride]);

    // Enable Cloud Spawning
    useEffect(() => {
        const cloudInterval = setInterval(spawnCloud, 15000 + Math.random() * 5000);
        spawnCloud(); // Init one immediately
        return () => clearInterval(cloudInterval);
    }, []);

    useEffect(() => {
        const loadWeather = async () => {
            const data = await fetchWeatherIntelligence();
            if (data) setWeather(data);
        };
        loadWeather();
        const interval = setInterval(loadWeather, 300000); // 5 minutes
        return () => clearInterval(interval);
    }, []);

    const handleMouseMove = useCallback((e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y });
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const theme = BASE_THEMES[season] || BASE_THEMES.SUMMER;

    // SEASON-AWARE ATMOSPHERIC LIGHTING
    const getSkyStyle = () => {
        // Base colors derived from Season
        const isRainy = season === 'RAINY';
        const isWinter = season === 'WINTER';
        const isAutumn = season === 'AUTUMN';

        if (sun.isDay) {
            if (sun.altitude > 0.7) {
                // High Noon
                if (isRainy) return 'from-slate-700 via-slate-800 to-slate-900';
                if (isWinter) return 'from-blue-100 via-blue-200 to-white';
                return 'from-cyan-400 via-blue-400 to-blue-600';
            }
            if (sun.altitude > 0.2) {
                // Morning / Mid-day
                if (isAutumn) return 'from-orange-400 via-amber-200 to-blue-300';
                return 'from-blue-300 via-cyan-200 to-blue-400';
            }
            // Sunrise / Sunset
            return 'from-orange-600 via-pink-500 to-indigo-900';
        }
        // Night
        return 'from-black via-[#000428] to-[#004e92]';
    };

    const currentCondition = weather?.current?.condition;
    const currentTemp = weather?.current?.temp;
    const isRaining = weather?.current?.precipitation > 0 || weather?.hourly?.[0]?.rainProb > 40;
    const windSpeed = weather?.current?.windSpeed || 4;
    const cloudCover = weather?.current?.cloudCover || 0;
    const timeMod = TIME_MODIFIERS[dayPhase] || TIME_MODIFIERS.MORNING;

    return (
        <div className={`absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-b ${getSkyStyle()} transition-all duration-1000`}>
            {/* Cinematic Noise & Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[100] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            {/* CLOUD COVER & TIME TINT EFFECTS */}
            <div
                className={`absolute inset-0 z-[10] pointer-events-none transition-all duration-1000 ${timeMod.groundTint}`}
                style={{ backgroundColor: `rgba(0, 0, 0, ${(cloudCover / 400)})` }}
            />
            {/* Brightness Overlay */}
            <div
                className="absolute inset-0 z-[101] pointer-events-none transition-all duration-1000"
                style={{ opacity: 1 - timeMod.brightness, backgroundColor: 'black' }}
            />

            {/* REAL-TIME RAIN ANIMATION */}
            {isRaining && (
                <div className="absolute inset-0 z-[140] pointer-events-none overflow-hidden opacity-40">
                    <div className="rain-container" />
                </div>
            )}

            {/* VOLUMETRIC CLOUD SYSTEM */}
            <CloudSystem clouds={clouds} sun={sun} />

            {/* REAL-TIME CELESTIAL BODY (SUN/MOON) */}
            <div
                className="absolute pointer-events-none z-30 transition-all duration-1000 ease-linear"
                style={{
                    left: `${sun.x}%`,
                    top: `${sun.y}%`,
                    transform: `translate(-50%, -50%) translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`
                }}
            >
                {sun.isDay ? (
                    <div className="relative group/sun">
                        {/* Sun Core */}
                        <div className="w-32 h-32 bg-amber-50 rounded-full shadow-[0_0_150px_rgba(255,252,231,0.8)] blur-[2px] animate-pulse"></div>
                        {/* Lens Flare Components */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent -rotate-45"></div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Realistic CSS Moon */}
                        <div className="w-24 h-24 rounded-full bg-slate-100 shadow-[0_0_100px_rgba(255,255,255,0.3)] relative overflow-hidden">
                            {/* Moon Craters */}
                            <div className="absolute top-4 left-6 w-6 h-6 bg-slate-300/40 rounded-full blur-sm"></div>
                            <div className="absolute bottom-6 right-8 w-4 h-4 bg-slate-300/40 rounded-full blur-[2px]"></div>
                            <div className="absolute top-10 left-12 w-3 h-3 bg-slate-300/40 rounded-full blur-[1px]"></div>
                            {/* Atmospheric Glow */}
                            <div className="absolute inset-0 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.2)]"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* ATMOSPHERIC LENS FLARE GHOSTS */}
            {sun.isDay && (
                <div className="absolute inset-0 pointer-events-none z-40 opacity-30">
                    <div className="absolute top-[60%] left-[40%] w-12 h-12 rounded-full bg-orange-400/20 blur-xl"></div>
                    <div className="absolute top-[75%] left-[30%] w-8 h-8 rounded-full bg-cyan-400/20 blur-lg"></div>
                </div>
            )}

            {/* BEAUTIFUL UNLIMITED STARFIELD (Memoized for performance) */}
            {!sun.isDay && useMemo(() => (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {[...Array(400)].map((_, i) => {
                        const size = Math.random() * 2;
                        const depth = Math.random();
                        return (
                            <div
                                key={i}
                                className={`absolute bg-white rounded-full ${i % 10 === 0 ? 'animate-pulse' : ''}`}
                                style={{
                                    width: size + 'px',
                                    height: size + 'px',
                                    left: Math.random() * 100 + '%',
                                    top: Math.random() * 100 + '%',
                                    opacity: 0.1 + Math.random() * 0.9,
                                    boxShadow: size > 1.5 ? '0 0 4px white' : 'none',
                                    animationDelay: `${Math.random() * 5}s`
                                }}
                            ></div>
                        );
                    })}
                </div>
            ), [sun.isDay])}

            {/* AUTUMN LEAF FALL SYSTEM */}
            {season === 'AUTUMN' && (
                <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => {
                        const colors = ['#d97706', '#b45309', '#92400e', '#78350f']; // Autumnal hues
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        return (
                            <div
                                key={i}
                                className="absolute"
                                style={{
                                    left: Math.random() * 100 + '%',
                                    top: '-5%',
                                    animation: `leaf-fall ${6 + Math.random() * 8}s linear infinite`,
                                    animationDelay: `${Math.random() * 10}s`,
                                }}
                            >
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill={color}
                                    style={{
                                        animation: `leaf-pivot ${3 + Math.random() * 2}s ease-in-out infinite`,
                                        opacity: 0.6 + Math.random() * 0.4
                                    }}
                                >
                                    <path d="M12,2C12,2 4,10 4,16C4,20.42 7.58,24 12,24C16.42,24 20,20.42 20,16C20,10 12,2 12,2M12,22C8.69,22 6,19.31 6,16C6,13.47 8,10.24 12,6.19C16,10.24 18,13.47 18,16C18,19.31 15.31,22 12,22Z" />
                                </svg>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Dynamic Ground Shading */}
            <div className={`absolute inset-0 pointer-events-none z-20 transition-all duration-1000 ${sun.isDay ? 'bg-amber-400/5' : 'bg-blue-900/20'}`}></div>

            {/* Weather Effects Layer */}
            <div className="absolute inset-0 pointer-events-none z-40">
                {(currentCondition === 'Rain' || theme.particles === 'SPLASH') && (
                    <div className="absolute inset-0">
                        {[...Array(100)].map((_, i) => (
                            <div key={i} className="absolute bg-blue-400/30 w-[1px] h-12"
                                style={{ left: Math.random() * 100 + '%', top: '-10%', animation: `rain-fall ${0.4 + Math.random() * 0.2}s linear infinite`, animationDelay: `${Math.random() * 2}s` }}
                            ></div>
                        ))}
                    </div>
                )}

                {(currentCondition === 'Snow' || theme.particles === 'SNOWFALL') && (
                    <div className="absolute inset-0">
                        {[...Array(50)].map((_, i) => (
                            <div key={i} className="absolute bg-white/60 rounded-full blur-[1px]"
                                style={{ width: 4 + Math.random() * 3 + 'px', height: 4 + Math.random() * 3 + 'px', left: Math.random() * 100 + '%', top: '-5%', animation: `snow-fall ${4 + Math.random() * 4}s linear infinite`, animationDelay: `${Math.random() * 5}s` }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3D Scene */}
            <div className="absolute inset-0 flex items-center justify-center [perspective:2000px] pointer-events-none">
                <div
                    className="relative w-[180%] h-[180%] transition-transform duration-700 ease-out"
                    style={{
                        transform: `rotateX(60deg) rotateZ(${-mousePos.x * 0.05}deg) translateY(15%)`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* REALISTIC GROUND */}
                    <div
                        className="absolute inset-0 shadow-[0_0_100px_black]"
                        style={{
                            background: `radial-gradient(circle at center, #1a2e05 0%, #050a01 100%)`, // Robust procedural fallback
                            opacity: 0.9,
                            transform: 'translateZ(-2px)'
                        }}
                    >
                        {/* Real-Time Shadow Mask */}
                        <div
                            className="absolute inset-0 transition-all duration-1000"
                            style={{
                                background: `radial-gradient(circle at ${sun.x}% ${sun.y}%, transparent 40%, rgba(0,0,0,${0.6 - sun.altitude * 0.4}))`
                            }}
                        ></div>
                    </div>

                    {/* INTERACTIVE ENTITIES */}
                    <div className="absolute top-[60%] left-[55%] pointer-events-auto" style={{ transform: 'translateZ(20px)' }}>
                        <SeasonalCave season={season} weather={weather?.current} onClick={onCaveClick} />
                    </div>

                    <div className="absolute top-[40%] left-[30%] tractor-path pointer-events-auto" style={{ transformStyle: 'preserve-3d' }}>
                        <Tractor readinessState={readinessState} onClick={onZoneClick} />
                    </div>

                    <div className="absolute top-[10%] left-[70%] pointer-events-auto" style={{ transform: 'translateZ(150px)' }}>
                        <Drone onClick={onZoneClick} />
                    </div>

                    <div className="absolute top-[25%] left-[85%] pointer-events-auto" style={{ transform: 'translateZ(40px)' }}>
                        <DataMonolith onClick={onZoneClick} />
                    </div>

                    <div className="absolute top-[5%] left-[50%] pointer-events-auto" style={{ transform: 'translateZ(20px)' }} onClick={() => onZoneClick('crops')}>
                        <GenerativeForest
                            season={season}
                            weather={weather?.current}
                            farmerActions={farmerActions}
                            growthStage={growthStage}
                            sun={sun}
                        />
                    </div>

                    <div className="absolute top-[65%] left-[15%] pointer-events-auto" style={{ transform: 'translateZ(40px)' }}>
                        <AiHuman
                            season={season}
                            language={language}
                            weather={weather?.current}
                            bioState={globalBioState}
                        />
                    </div>
                </div>
            </div>

            {/* UI OVERLAYS */}
            <div className="absolute top-8 left-8 z-[110] flex flex-col items-start gap-4">
                <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                    {/* Phase Indicator Accent */}
                    <div className={`absolute top-0 right-0 h-1 w-24 ${dayPhase === 'MORNING' ? 'bg-orange-400' : dayPhase === 'AFTERNOON' ? 'bg-amber-300' : dayPhase === 'EVENING' ? 'bg-pink-500' : 'bg-indigo-600'} opacity-60`} />

                    <h1 className="text-4xl font-black italic tracking-tighter text-white">
                        SMART<span className="text-emerald-400">WORLD</span>
                        <span className="ml-3 text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Solar Sync v4.0</span>
                    </h1>
                    <div className="mt-2 flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${sun.isDay ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'} shadow-[0_0_8px_rgba(251,191,36,0.5)]`} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                            Real-Time: <span className="text-emerald-400">{dayPhase}</span>
                        </span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-2 ml-4">
                    <button
                        onClick={() => setShowWeatherIntelligence(true)}
                        className="relative w-16 h-12 group transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center"
                    >
                        {/* Weather Item Glow */}
                        <div className={`absolute inset-0 blur-xl rounded-full transition-all duration-500 bg-emerald-400/20 group-hover:bg-emerald-400/40`} />

                        {/* Weather Button Icon (SVG) */}
                        <svg viewBox="0 0 100 60" className={`w-full h-full drop-shadow-[0_0_10px_rgba(52,211,153,0.3)] fill-emerald-400 group-hover:fill-white transition-all`}>
                            <path d="M25 45 A15 15 0 0 1 25 15 A20 20 0 0 1 65 15 A15 15 0 0 1 65 45 Z" />
                            <circle cx="70" cy="20" r="8" fill="#FBBF24" className="animate-pulse" />
                        </svg>
                    </button>
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-emerald-400 transition-all`}>
                        Weather
                    </span>
                </div>
            </div>

            {/* WEATHER INTELLIGENCE PANEL MODAL */}
            {showWeatherIntelligence && (
                <WeatherPanel
                    data={weather}
                    onClose={() => setShowWeatherIntelligence(false)}
                />
            )}
            {/* BIOLOGICAL MODULE CONTROLS - REPOSITIONED TO WATER DROP TRIGGER */}
            <div className="absolute top-8 right-8 z-[110] flex flex-col items-center gap-2">
                <button
                    onClick={() => setShowBioModule(!showBioModule)}
                    className={`relative w-16 h-20 group transition-all duration-500 hover:scale-110 active:scale-95 flex items-center justify-center`}
                >
                    {/* Liquid Glow Background */}
                    <div className={`absolute inset-0 blur-2xl rounded-full transition-all duration-500 ${showBioModule ? 'bg-cyan-400/40 opacity-100' : 'bg-emerald-400/20 opacity-0 group-hover:opacity-100'}`} />

                    {/* Water Drop Shape (SVG) */}
                    <svg viewBox="0 0 100 120" className={`w-full h-full drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all duration-500 ${showBioModule ? 'fill-cyan-400' : 'fill-emerald-500 opacity-80'}`}>
                        <path d="M50 0 C50 0 10 40 10 75 A40 40 0 1 0 90 75 C90 40 50 0 50 0 Z" />
                        {/* Internal Shine */}
                        <path d="M40 55 C40 55 30 65 30 75" stroke="white" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
                    </svg>

                    {/* Inner Pulse if Closed */}
                    {!showBioModule && (
                        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full blur-sm animate-pulse" />
                    )}
                </button>

                {/* Module Label */}
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${showBioModule ? 'text-cyan-400 translate-y-0' : 'text-white/40 group-hover:text-emerald-400 translate-y-1'}`}>
                    Biological
                </span>

                {/* Conditional Module Panel */}
                {showBioModule && (
                    <div className="mt-4 bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 p-4 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] w-64 pointer-events-auto animate-in zoom-in-95 fade-in duration-300 origin-top">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]"></div>
                                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Biological Module</h3>
                            </div>
                            <button onClick={() => setShowBioModule(false)} className="text-white/20 hover:text-white transition-colors">✕</button>
                        </div>

                        <div className="space-y-3">
                            {/* Growth Stage Selector */}
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest px-1">Growth Stage</span>
                                <div className="grid grid-cols-2 gap-1 px-1">
                                    {['SOWING', 'VEGETATIVE', 'FLOWERING', 'HARVEST'].map((stage) => (
                                        <button
                                            key={stage}
                                            onClick={() => setGrowthStage(stage)}
                                            className={`text-[8px] font-black py-1 px-1.5 rounded transition-all border ${growthStage === stage ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/5 text-white/40'}`}
                                        >
                                            {stage}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Farmer Actions */}
                            <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-3">
                                <button
                                    onClick={() => setFarmerActions(prev => ({ ...prev, irrigated: !prev.irrigated }))}
                                    className={`flex justify-between items-center p-2 rounded-xl border transition-all ${farmerActions.irrigated ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 text-white/60'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">💧</span>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Irrigation</span>
                                    </div>
                                    <span className="text-xs">{farmerActions.irrigated ? '✓' : '—'}</span>
                                </button>
                                <button
                                    onClick={() => setFarmerActions(prev => ({ ...prev, fertilized: !prev.fertilized }))}
                                    className={`flex justify-between items-center p-2 rounded-xl border transition-all ${farmerActions.fertilized ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/5 text-white/60'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🧪</span>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Fertilizer</span>
                                    </div>
                                    <span className="text-xs">{farmerActions.fertilized ? '✓' : '—'}</span>
                                </button>
                                <button
                                    onClick={() => setFarmerActions(prev => ({ ...prev, observedStress: !prev.observedStress }))}
                                    className={`flex justify-between items-center p-2 rounded-xl border transition-all ${farmerActions.observedStress ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/5 text-white/60'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🔍</span>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">Stress Seen</span>
                                    </div>
                                    <span className="text-xs">{farmerActions.observedStress ? 'YES' : 'NONE'}</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 p-2 bg-black/40 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${globalBioState.visualization.glowColor === 'green' ? 'bg-emerald-500' : (globalBioState.visualization.glowColor === 'yellow' ? 'bg-amber-500' : 'bg-blue-500')} shadow-lg`} />
                                <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Field Summary</span>
                            </div>
                            <p className="text-[10px] text-emerald-100/70 italic leading-snug">
                                {globalBioState.interpretation.hint}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Active Alert Indicator (Subtle Red Pulse) */}
            {activeAlert && (
                <div className="absolute inset-0 pointer-events-none z-[80] animate-pulse-slow mix-blend-overlay bg-red-500/10"></div>
            )}

            {/* Alert Location Marker (Simulated 3D) */}
            {activeAlert && (
                <div className="absolute inset-0 flex items-center justify-center [perspective:2000px] pointer-events-none z-[90]">
                    <div
                        className="absolute top-[60%] left-[80%] w-32 h-32 rounded-full border-4 border-red-500/50 shadow-[0_0_50px_red] animate-ping opacity-50"
                        style={{ transform: 'rotateX(60deg) translateZ(10px)' }}
                    ></div>
                    <div
                        className="absolute top-[60%] left-[80%] w-8 h-8 bg-red-500/80 rounded-full shadow-[0_0_20px_red] animate-bounce"
                        style={{ transform: 'translateY(-20px)' }}
                    >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xl">⚠️</span>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes rain-fall { to { transform: translateY(120vh); } }
                @keyframes snow-fall { 0% { transform: translateY(-10px) translateX(0); } 100% { transform: translateY(110vh) translateX(50px); } }
                @keyframes rain {
                    0% { transform: translateY(-100vh); }
                    100% { transform: translateY(100vh); }
                }
                .rain-container {
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px);
                    animation: rain 0.5s linear infinite;
                }
                .tractor-path {
                    animation: drive-loop 120s linear infinite;
                    transform-origin: center;
                }
                @keyframes drive-loop {
                    0% { transform: translate3d(0, 0, 30px) rotateY(180deg); }
                    25% { transform: translate3d(400px, 0, 30px) rotateY(180deg); }
                    26% { transform: translate3d(400px, 0, 30px) rotateY(0deg); }
                    50% { transform: translate3d(400px, 400px, 30px) rotateY(0deg); }
                    51% { transform: translate3d(400px, 400px, 30px) rotateY(-180deg); }
                    75% { transform: translate3d(0, 400px, 30px) rotateY(-180deg); }
                    76% { transform: translate3d(0, 400px, 30px) rotateY(-360deg); }
                    100% { transform: translate3d(0, 0, 30px) rotateY(-360deg); }
                }
                @keyframes leaf-fall {
                    0% { transform: translateY(0vh) translateX(0px) rotate(0deg); }
                    25% { transform: translateY(25vh) translateX(50px) rotate(90deg); }
                    50% { transform: translateY(50vh) translateX(-50px) rotate(180deg); }
                    75% { transform: translateY(75vh) translateX(50px) rotate(270deg); }
                    100% { transform: translateY(110vh) translateX(0px) rotate(360deg); }
                }

                @keyframes leaf-pivot {
                    0%, 100% { transform: scaleX(1) rotate(0deg); }
                    50% { transform: scaleX(0.5) rotate(15deg); }
                }
            `}} />
        </div >
    );
};

export default GenerativeFarmWorld;
