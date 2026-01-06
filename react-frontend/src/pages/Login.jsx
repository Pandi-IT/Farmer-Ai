import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MoodCheckIn from '../components/MoodCheckIn';
import TinyWinMessage from '../components/TinyWinMessage';
import { CognitiveReadinessTracker } from '../utils/cognitiveReadiness';

/**
 * ULTRA-PREMIUM CINEMATIC LOGIN
 * World-Class Agricultural Intelligence Platform
 * Ineffable • Powerful • Professional • Clean
 */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const trackerRef = useRef(new CognitiveReadinessTracker());
    const [readinessState, setReadinessState] = useState(null);

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for login

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);
        const handler = (e) => setPrefersReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Load saved theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('appTheme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    };

    const handleMoodSelect = (moodId) => {
        localStorage.setItem('tempMood', moodId);
    };

    const handleKeyDown = (e) => {
        trackerRef.current.trackInput(e);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const readiness = trackerRef.current.calculateReadiness();
        setReadinessState(readiness.state);
        const success = await login(email, password, readiness.state);
        if (success) {
            setShowSuccess(true);
            setTimeout(() => navigate('/'), 2500);
        } else {
            setIsSubmitting(false);
        }
    };

    // Generate neural network nodes
    const networkNodes = Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: 10 + Math.random() * 80,
        y: 15 + Math.random() * 70,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 15
    }));

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-700">

            {/* Theme Toggle Button - Top Right */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 z-50 w-14 h-14 rounded-full backdrop-blur-xl border-2 flex items-center justify-center transition-all duration-500 shadow-lg hover:scale-110"
                style={{
                    background: isDarkMode
                        ? 'rgba(30, 41, 59, 0.8)'
                        : 'rgba(255, 255, 255, 0.9)',
                    borderColor: isDarkMode
                        ? 'rgba(100, 116, 139, 0.3)'
                        : 'rgba(203, 213, 225, 0.6)',
                    boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                <div className="relative w-8 h-8 flex items-center justify-center">
                    {isDarkMode ? (
                        <span className="text-2xl animate-pulse">🌙</span>
                    ) : (
                        <span className="text-3xl">☀️</span>
                    )}
                </div>
            </button>

            {/* ═══════════════════════════════════════════════════════════════
                🌌 ULTRA-PREMIUM LAYERED BACKGROUND SYSTEM
            ═══════════════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 z-0">

                {/* Layer 1: Deep Cinematic Multi-Gradient Sky */}
                <div
                    className="absolute inset-0 transition-all duration-1000"
                    style={{
                        background: isDarkMode ? `
                            linear-gradient(180deg, 
                                #050d18 0%,
                                #0a1620 10%,
                                #0d2235 25%,
                                #0f2d3c 35%,
                                #153838 50%,
                                #1f4236 60%,
                                #2d4a38 70%,
                                #3d5238 80%,
                                #4d5030 88%,
                                #5d4928 94%,
                                #6d4e25 97%,
                                #75532a 100%
                            )
                        ` : `
                            linear-gradient(180deg,
                                #e0f2fe 0%,
                                #bae6fd 15%,
                                #7dd3fc 30%,
                                #0ea5e9 45%,
                                #0284c7 60%,
                                #0369a1 75%,
                                #075985 90%,
                                #0c4a6e 100%
                            )
                        `
                    }}
                />

                {/* Layer 2: Depth Gradient Overlay (3D Effect) */}
                <div
                    className="absolute inset-0 opacity-60"
                    style={{
                        background: `
                            radial-gradient(ellipse 60% 100% at 50% 0%, 
                                rgba(15, 45, 60, 0.4) 0%, 
                                transparent 50%
                            ),
                            radial-gradient(ellipse 100% 50% at 50% 100%, 
                                rgba(100, 120, 70, 0.3) 0%, 
                                transparent 60%
                            )
                        `
                    }}
                />

                {/* Layer 3: Intelligent Geometric Grid */}
                <svg
                    className="absolute inset-0 w-full h-full opacity-[0.08]"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <pattern id="hexGrid" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                            <path
                                d="M 30 0 L 45 13 L 45 39 L 30 52 L 15 39 L 15 13 Z"
                                fill="none"
                                stroke="rgba(120, 180, 140, 0.4)"
                                strokeWidth="0.5"
                            />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#hexGrid)" />
                </svg>

                {/* Layer 4: Data Flow Lines (Flowing Streams) */}
                {!prefersReducedMotion && (
                    <svg className="absolute inset-0 w-full h-full opacity-20">
                        {[...Array(6)].map((_, i) => {
                            const startY = 20 + i * 15;
                            return (
                                <path
                                    key={`flow-${i}`}
                                    d={`M 0 ${startY} Q 25 ${startY - 10}, 50 ${startY} T 100 ${startY}`}
                                    fill="none"
                                    stroke="rgba(140, 200, 160, 0.3)"
                                    strokeWidth="1"
                                    strokeDasharray="4 8"
                                    style={{
                                        animation: `dataFlow ${20 + i * 5}s linear infinite`,
                                        animationDelay: `${i * -3}s`
                                    }}
                                />
                            );
                        })}
                    </svg>
                )}

                {/* Layer 5: Multi-Layered Aurora */}
                {!prefersReducedMotion && (
                    <>
                        <div
                            className="absolute inset-0 opacity-15"
                            style={{
                                background: 'linear-gradient(110deg, transparent 0%, rgba(80, 160, 120, 0.25) 30%, transparent 60%, rgba(140, 180, 100, 0.2) 80%, transparent 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'auroraFlow1 30s ease-in-out infinite'
                            }}
                        />
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                background: 'linear-gradient(-70deg, transparent 0%, rgba(180, 140, 80, 0.2) 40%, transparent 70%, rgba(100, 150, 120, 0.15) 90%, transparent 100%)',
                                backgroundSize: '200% 200%',
                                animation: 'auroraFlow2 40s ease-in-out infinite reverse'
                            }}
                        />
                    </>
                )}

                {/* Layer 6: Horizon Glow System */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 140% 35% at 50% 100%, 
                                rgba(200, 160, 90, 0.35) 0%, 
                                rgba(140, 160, 100, 0.2) 30%, 
                                rgba(80, 120, 90, 0.1) 50%,
                                transparent 70%
                            )
                        `
                    }}
                />

                {/* Layer 7: Cinematic Light Rays */}
                {!prefersReducedMotion && (
                    <div className="absolute inset-0 opacity-8">
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={`ray-${i}`}
                                className="absolute bottom-0 left-1/2"
                                style={{
                                    width: '1px',
                                    height: '75%',
                                    background: 'linear-gradient(to top, rgba(220, 180, 100, 0.5), transparent)',
                                    transform: `rotate(${-45 + i * 7.5}deg) translateX(-50%)`,
                                    transformOrigin: 'bottom center',
                                    animation: `lightPulse ${10 + i * 1.5}s ease-in-out infinite`,
                                    animationDelay: `${i * -0.8}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Layer 8: Premium Agricultural Silhouettes */}
                <svg
                    className="absolute bottom-0 left-0 w-full h-[45%] opacity-95"
                    viewBox="0 0 1440 450"
                    preserveAspectRatio="xMidYMax slice"
                    fill="none"
                >
                    {/* Distant Mountains */}
                    <path
                        d="M0 450 L0 300 Q240 260 480 280 Q720 300 960 270 Q1200 240 1440 280 L1440 450 Z"
                        fill="rgba(15, 30, 25, 0.5)"
                    />

                    {/* Rolling Hills */}
                    <path
                        d="M0 450 L0 330 Q360 310 720 340 Q1080 370 1440 330 L1440 450 Z"
                        fill="rgba(20, 40, 30, 0.7)"
                    />

                    {/* Tree Group 1 */}
                    <g fill="rgba(12, 25, 20, 0.95)">
                        <path d="M100 450 L100 350 L80 350 L115 285 L95 285 L130 220 L165 285 L145 285 L180 350 L160 350 L160 450 Z" />
                        <path d="M190 450 L190 370 L170 370 L205 305 L185 305 L220 240 L255 305 L235 305 L270 370 L250 370 L250 450 Z" />
                    </g>

                    {/* Tree Group 2 */}
                    <g fill="rgba(10, 22, 18, 0.95)">
                        <path d="M800 450 L800 340 L780 340 L815 275 L795 275 L830 210 L865 275 L845 275 L880 340 L860 340 L860 450 Z" />
                        <path d="M920 450 L920 360 L900 360 L935 295 L915 295 L950 230 L985 295 L965 295 L1000 360 L980 360 L980 450 Z" />
                    </g>

                    {/* Windmill */}
                    <g fill="rgba(15, 30, 25, 0.9)">
                        <rect x="1280" y="320" width="8" height="130" />
                        <g transform="translate(1284, 320)">
                            <rect x="-2" y="-60" width="4" height="60" transform="rotate(0)" />
                            <rect x="-2" y="-60" width="4" height="60" transform="rotate(90)" />
                            <rect x="-2" y="-60" width="4" height="60" transform="rotate(180)" />
                            <rect x="-2" y="-60" width="4" height="60" transform="rotate(270)" />
                        </g>
                    </g>

                    {/* Crop Field Lines */}
                    <g stroke="rgba(50, 70, 50, 0.6)" strokeWidth="1.5" opacity="0.8">
                        {[...Array(15)].map((_, i) => {
                            const x = 400 + i * 45;
                            return (
                                <line
                                    key={i}
                                    x1={x}
                                    y1="450"
                                    x2={720 + (i - 7) * 15}
                                    y2="380"
                                />
                            );
                        })}
                    </g>

                    {/* Foreground */}
                    <rect x="0" y="410" width="1440" height="40" fill="rgba(8, 18, 13, 0.98)" />
                </svg>

                {/* Layer 9: Ground Atmospheric Mist */}
                {!prefersReducedMotion && (
                    <>
                        <div className="absolute bottom-0 left-0 w-full h-[30%] overflow-hidden opacity-80">
                            <div
                                className="absolute w-[200%] h-full"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, rgba(160, 180, 150, 0.15) 20%, rgba(180, 190, 160, 0.12) 40%, transparent 60%, rgba(170, 185, 155, 0.1) 80%, transparent 100%)',
                                    animation: 'mistFlow 50s linear infinite'
                                }}
                            />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-[25%] overflow-hidden opacity-60">
                            <div
                                className="absolute w-[200%] h-full"
                                style={{
                                    background: 'linear-gradient(90deg, rgba(180, 190, 170, 0.08) 0%, transparent 30%, rgba(170, 185, 165, 0.12) 60%, transparent 90%)',
                                    animation: 'mistFlow 60s linear infinite reverse'
                                }}
                            />
                        </div>
                    </>
                )}

                {/* Layer 10: Neural Network Intelligence Particles */}
                {!prefersReducedMotion && (
                    <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                        {/* Connection Lines */}
                        {networkNodes.map((node, i) => {
                            const connections = networkNodes
                                .filter((_, j) => j > i && Math.abs(node.x - networkNodes[j].x) < 20 && Math.abs(node.y - networkNodes[j].y) < 20)
                                .slice(0, 2);

                            return connections.map((target, ci) => (
                                <line
                                    key={`conn-${i}-${ci}`}
                                    x1={`${node.x}%`}
                                    y1={`${node.y}%`}
                                    x2={`${target.x}%`}
                                    y2={`${target.y}%`}
                                    stroke="rgba(120, 180, 140, 0.3)"
                                    strokeWidth="0.5"
                                    style={{
                                        animation: `lineGlow ${8 + Math.random() * 8}s ease-in-out infinite`,
                                        animationDelay: `${node.delay}s`
                                    }}
                                />
                            ));
                        })}
                    </svg>
                )}

                {/* Layer 11: Wisdom Particles (Multi-type) */}
                {!prefersReducedMotion && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Golden Fireflies */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={`firefly-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    width: `${3 + Math.random() * 4}px`,
                                    height: `${3 + Math.random() * 4}px`,
                                    left: `${5 + Math.random() * 90}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                    background: `radial-gradient(circle, rgba(255, 220, 120, 0.95) 0%, rgba(200, 160, 80, 0.5) 50%, transparent 80%)`,
                                    boxShadow: `0 0 ${12 + Math.random() * 8}px rgba(255, 220, 120, 0.7)`,
                                    animation: `wisdomFloat ${15 + Math.random() * 20}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 10}s`
                                }}
                            />
                        ))}

                        {/* Emerald Data Nodes */}
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={`node-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    width: `${4 + Math.random() * 5}px`,
                                    height: `${4 + Math.random() * 5}px`,
                                    left: `${10 + Math.random() * 80}%`,
                                    top: `${25 + Math.random() * 50}%`,
                                    background: `radial-gradient(circle, rgba(100, 220, 180, 0.7) 0%, rgba(60, 160, 140, 0.4) 60%, transparent 90%)`,
                                    boxShadow: '0 0 10px rgba(100, 220, 180, 0.5)',
                                    animation: `nodeFloat ${18 + Math.random() * 22}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 12}s`
                                }}
                            />
                        ))}

                        {/* Pollen Drift */}
                        {[...Array(35)].map((_, i) => (
                            <div
                                key={`pollen-${i}`}
                                className="absolute rounded-full bg-amber-200/20"
                                style={{
                                    width: `${1 + Math.random() * 2}px`,
                                    height: `${1 + Math.random() * 2}px`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${20 + Math.random() * 70}%`,
                                    animation: `pollenDrift ${12 + Math.random() * 16}s linear infinite`,
                                    animationDelay: `${Math.random() * 8}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Layer 12: Depth of Field Vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `
                            radial-gradient(ellipse 75% 75% at 50% 45%, 
                                transparent 35%, 
                                rgba(5, 10, 15, 0.3) 75%,
                                rgba(5, 10, 15, 0.5) 95%
                            )
                        `
                    }}
                />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                ✨ ULTRA-PREMIUM CSS ANIMATIONS
            ═══════════════════════════════════════════════════════════════ */}
            <style>{`
                @keyframes dataFlow {
                    0% { stroke-dashoffset: 0; opacity: 0.2; }
                    50% { opacity: 0.6; }
                    100% { stroke-dashoffset: -100; opacity: 0.2; }
                }
                @keyframes auroraFlow1 {
                    0%, 100% { background-position: 0% 0%; opacity: 0.15; }
                    50% { background-position: 100% 100%; opacity: 0.25; }
                }
                @keyframes auroraFlow2 {
                    0%, 100% { background-position: 100% 0%; opacity: 0.1; }
                    50% { background-position: 0% 100%; opacity: 0.2; }
                }
                @keyframes lightPulse {
                    0%, 100% { opacity: 0.04; transform: rotate(var(--rotation)) translateX(-50%) scaleY(0.9); }
                    50% { opacity: 0.12; transform: rotate(var(--rotation)) translateX(-50%) scaleY(1.1); }
                }
                @keyframes mistFlow {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes lineGlow {
                    0%, 100% { opacity: 0.2; stroke-width: 0.5; }
                    50% { opacity: 0.5; stroke-width: 1; }
                }
                @keyframes wisdomFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    25% { transform: translate(25px, -40px) scale(1.4); opacity: 0.95; }
                    50% { transform: translate(-20px, -70px) scale(1); opacity: 0.6; }
                    75% { transform: translate(30px, -45px) scale(1.3); opacity: 0.85; }
                }
                @keyframes nodeFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
                    33% { transform: translate(-30px, -50px) scale(1.2); opacity: 0.8; }
                    66% { transform: translate(35px, -30px) scale(0.9); opacity: 0.6; }
                }
                @keyframes pollenDrift {
                    0% { transform: translateY(0) translateX(0); opacity: 0.3; }
                    100% { transform: translateY(-80vh) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px); opacity: 0; }
                }
            `}</style>

            {showSuccess && <TinyWinMessage />}

            {/* ═══════════════════════════════════════════════════════════════
                🎯 ULTRA-PREMIUM GLASSMORPHIC CARD
            ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 max-w-md w-full">
                {/* Premium Outer Glow */}
                <div
                    className="absolute -inset-8 rounded-[3.5rem]"
                    style={{
                        background: `
                            radial-gradient(circle at 50% 20%, 
                                rgba(180, 160, 100, 0.25) 0%, 
                                rgba(100, 180, 150, 0.2) 40%, 
                                rgba(80, 140, 120, 0.15) 60%,
                                transparent 80%
                            )
                        `,
                        filter: 'blur(40px)',
                        opacity: 0.6,
                        animation: !prefersReducedMotion ? 'cardGlow 10s ease-in-out infinite' : 'none'
                    }}
                />

                {/* Main Card Container */}
                <div
                    className="relative p-11 rounded-[2.8rem] border-2 backdrop-blur-2xl transition-all duration-700"
                    style={{
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 41, 59, 0.6), rgba(15, 23, 42, 0.7))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.95))',
                        borderColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(203, 213, 225, 0.4)',
                        boxShadow: isDarkMode
                            ? '0 25px 60px -15px rgba(0, 0, 0, 0.6)'
                            : '0 25px 60px -15px rgba(0, 0, 0, 0.15)'
                    }}
                >

                    {/* Card Inner Glow */}
                    <div
                        className="absolute inset-0 rounded-[2.8rem] opacity-40"
                        style={{
                            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 50%)'
                        }}
                    />

                    {/* Floating Sparkles */}
                    {!prefersReducedMotion && [...Array(10)].map((_, i) => (
                        <div
                            key={`sparkle-${i}`}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                left: `${15 + Math.random() * 70}%`,
                                top: `${10 + Math.random() * 80}%`,
                                background: `rgba(${200 + Math.random() * 55}, ${180 + Math.random() * 40}, ${100 + Math.random() * 80}, 0.${4 + Math.floor(Math.random() * 4)})`,
                                boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(255, 220, 140, 0.5)`,
                                animation: `sparkle ${2.5 + Math.random() * 3.5}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 3}s`
                            }}
                        />
                    ))}

                    <div className="relative">
                        {/* Premium Header */}
                        <div className="text-center mb-9">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.4rem] bg-gradient-to-br from-amber-600/[0.35] via-emerald-600/[0.28] to-cyan-600/[0.32] border-2 border-white/[0.12] mb-5 relative overflow-hidden shadow-lg">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)'
                                    }}
                                />
                                <span className="text-4xl relative z-10">🌾</span>
                                {!prefersReducedMotion && (
                                    <div
                                        className="absolute inset-0 opacity-40"
                                        style={{
                                            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                                            animation: 'rotate 6s linear infinite'
                                        }}
                                    />
                                )}
                            </div>

                            <h2
                                className="text-[1.7rem] font-black tracking-[-0.02em] leading-tight mb-3 transition-colors duration-700"
                                style={{ color: isDarkMode ? '#ffffff' : '#1e293b' }}
                            >
                                Agricultural Intelligence
                            </h2>
                            <p
                                className="text-sm max-w-[280px] mx-auto leading-relaxed font-medium transition-colors duration-700"
                                style={{ color: isDarkMode ? 'rgba(148, 163, 184, 0.9)' : 'rgba(71, 85, 105, 0.9)' }}
                            >
                                Access the world's most advanced smart farming command center
                            </p>

                            {readinessState && (
                                <div className={`mt-5 text-xs font-black px-5 py-2 rounded-full inline-flex items-center gap-2 border transition-all duration-300
                                    ${readinessState === 'READY' ? 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : ''}
                                    ${readinessState === 'CAUTION' ? 'bg-amber-900/40 text-amber-200 border-amber-700/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : ''}
                                    ${readinessState === 'OBSERVE' ? 'bg-purple-900/40 text-purple-200 border-purple-700/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : ''}
                                `}>
                                    <span className="text-sm">🧠</span>
                                    <span className="uppercase tracking-wider">{readinessState}</span>
                                </div>
                            )}
                        </div>

                        <MoodCheckIn onMoodSelect={handleMoodSelect} />

                        {/* Premium Form */}
                        <form className="mt-7 space-y-5" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
                            {error && (
                                <div className="bg-red-500/[0.12] border border-red-500/30 text-red-300 text-sm p-4 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
                                    <span className="text-lg">⚠️</span>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-[0.7rem] font-black uppercase tracking-[0.15em] mb-2.5 ml-1 transition-colors duration-700"
                                        style={{ color: isDarkMode ? '#64748b' : '#475569' }}
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full h-[3.75rem] rounded-2xl px-5 focus:outline-none focus:ring-4 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                                        style={{
                                            background: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
                                            border: isDarkMode ? '2px solid rgba(51, 65, 85, 0.4)' : '2px solid rgba(203, 213, 225, 0.6)',
                                            color: isDarkMode ? '#ffffff' : '#1e293b'
                                        }}
                                        placeholder="your.email@farm.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-[0.7rem] font-black uppercase tracking-[0.15em] mb-2.5 ml-1 transition-colors duration-700"
                                        style={{ color: isDarkMode ? '#64748b' : '#475569' }}
                                    >
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        required
                                        className="w-full h-[3.75rem] rounded-2xl px-5 focus:outline-none focus:ring-4 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                                        style={{
                                            background: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(248, 250, 252, 0.8)',
                                            border: isDarkMode ? '2px solid rgba(51, 65, 85, 0.4)' : '2px solid rgba(203, 213, 225, 0.6)',
                                            color: isDarkMode ? '#ffffff' : '#1e293b'
                                        }}
                                        placeholder="••••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative w-full h-16 bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-700 hover:from-amber-600 hover:via-amber-500 hover:to-emerald-600 text-white font-black text-[0.7rem] uppercase tracking-[0.25em] rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_20px_50px_-10px_rgba(180,140,60,0.4)] disabled:opacity-50 disabled:transform-none border-2 border-white/[0.15] overflow-hidden group"
                            >
                                {!prefersReducedMotion && (
                                    <>
                                        <div
                                            className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                                            style={{
                                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                                                backgroundSize: '200% 100%',
                                                animation: 'shimmer 3.5s linear infinite'
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0 opacity-30"
                                            style={{
                                                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)'
                                            }}
                                        />
                                    </>
                                )}
                                <span className="relative flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Authenticating
                                        </>
                                    ) : (
                                        <>
                                            <span>Access Platform</span>
                                            <span className="text-base">→</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        {/* Premium Footer */}
                        <div className="text-center mt-9 pt-7 border-t border-white/[0.08]">
                            <p className="text-sm text-slate-500 font-medium">
                                New farmer?{' '}
                                <Link to="/register" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 transition-all duration-300">
                                    Request Access
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Premium Bottom Tagline */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10">
                <p className="text-[0.65rem] font-bold text-slate-600/80 tracking-[0.3em] uppercase mb-1.5">
                    Powered by Agricultural Intelligence
                </p>
                <div className="flex items-center justify-center gap-1.5 opacity-40">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    <div className="w-1 h-1 rounded-full bg-cyan-500" />
                </div>
            </div>

            {/* Additional Keyframes */}
            <style>{`
                @keyframes cardGlow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.75; transform: scale(1.08); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(2); }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
};

export default Login;
