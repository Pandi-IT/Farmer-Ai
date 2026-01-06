import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

/**
 * ULTRA-PREMIUM REGISTRATION PAGE
 * World-Class Agricultural Intelligence Platform
 * Ineffable • Powerful • Professional • Clean
 */
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const { register, login, uploadProfileImage, error } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for register

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size should be less than 5MB");
                return;
            }
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setIsSubmitting(true);
        const success = await register(name, email, password);
        if (success) {
            const loginSuccess = await login(email, password);
            if (loginSuccess) {
                if (selectedImage) {
                    await uploadProfileImage(selectedImage);
                }
                navigate('/');
            }
        }
        setIsSubmitting(false);
    };

    // Neural network nodes
    const networkNodes = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: 8 + Math.random() * 84,
        y: 12 + Math.random() * 76,
        size: 2 + Math.random() * 3.5,
        delay: Math.random() * 18
    }));

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden transition-colors duration-700">

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
                🌌 ULTRA-PREMIUM BACKGROUND (Enhanced for Registration)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="absolute inset-0 z-0">

                {/* Layer 1: Premium Sky Gradient (Lighter tone for registration) */}
                <div
                    className="absolute inset-0 transition-all duration-1000"
                    style={{
                        background: isDarkMode ? `linear-gradient(180deg, 
                            #0c1a28 0%,
                            #0e2138 12%,
                            #112d40 28%,
                            #1a4038 45%,
                            #24493a 58%,
                            #325440 72%,
                            #435538 84%,
                            #545232 92%,
                            #655030 97%,
                            #76552e 100%
                        )` : `linear-gradient(180deg,
                            #dbeafe 0%,
                            #bfdbfe 15%,
                            #93c5fd 30%,
                            #3b82f6 45%,
                            #2563eb 60%,
                            #1d4ed8 75%,
                            #1e40af 90%,
                            #1e3a8a 100%
                        )`
                    }}
                />

                {/* Layer 2: Growth Energy Overlay */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        background: `
                            radial-gradient(ellipse 70% 100% at 50% 0%, 
                                rgba(100, 200, 150, 0.15) 0%, 
                                transparent 60%
                            ),
                            radial-gradient(ellipse 110% 45% at 50% 100%, 
                                rgba(180, 160, 80, 0.2) 0%, 
                                transparent 65%
                            )
                        `
                    }}
                />

                {/* Layer 3: Advanced Hexagonal Intelligence Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.09]">
                    <defs>
                        <pattern id="growthGrid" x="0" y="0" width="70" height="62" patternUnits="userSpaceOnUse">
                            <path
                                d="M 35 0 L 52 15 L 52 45 L 35 62 L 18 45 L 18 15 Z"
                                fill="none"
                                stroke="rgba(130, 190, 150, 0.5)"
                                strokeWidth="0.6"
                            />
                            <circle cx="35" cy="32" r="2" fill="rgba(150, 210, 170, 0.3)" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#growthGrid)" />
                </svg>

                {/* Layer 4: Flowing Data Networks */}
                {!prefersReducedMotion && (
                    <svg className="absolute inset-0 w-full h-full opacity-22">
                        {[...Array(8)].map((_, i) => {
                            const startY = 18 + i * 12;
                            const offset = i % 2 === 0 ? 0 : 25;
                            return (
                                <path
                                    key={`stream-${i}`}
                                    d={`M 0 ${startY} Q ${20 + offset} ${startY - 8}, ${40 + offset} ${startY} T ${80 + offset} ${startY} T 120 ${startY}`}
                                    fill="none"
                                    stroke="rgba(150, 210, 170, 0.35)"
                                    strokeWidth="1.2"
                                    strokeDasharray="5 10"
                                    style={{
                                        animation: `streamFlow ${18 + i * 4}s linear infinite`,
                                        animationDelay: `${i * -2.5}s`
                                    }}
                                />
                            );
                        })}
                    </svg>
                )}

                {/* Layer 5: Triple Aurora Waves */}
                {!prefersReducedMotion && (
                    <>
                        <div
                            className="absolute inset-0 opacity-18"
                            style={{
                                background: 'linear-gradient(120deg, transparent 0%, rgba(100, 180, 140, 0.28) 35%, transparent 65%, rgba(160, 200, 120, 0.22) 85%, transparent 100%)',
                                backgroundSize: '220% 220%',
                                animation: 'wave1 35s ease-in-out infinite'
                            }}
                        />
                        <div
                            className="absolute inset-0 opacity-15"
                            style={{
                                background: 'linear-gradient(-75deg, transparent 0%, rgba(190, 160, 90, 0.22) 42%, transparent 72%, rgba(120, 170, 130, 0.18) 92%, transparent 100%)',
                                backgroundSize: '220% 220%',
                                animation: 'wave2 45s ease-in-out infinite reverse'
                            }}
                        />
                        <div
                            className="absolute inset-0 opacity-12"
                            style={{
                                background: 'linear-gradient(60deg, rgba(140, 200, 160, 0.15) 0%, transparent 45%, rgba(200, 180, 100, 0.18) 75%, transparent 100%)',
                                backgroundSize: '220% 220%',
                                animation: 'wave3 55s ease-in-out infinite'
                            }}
                        />
                    </>
                )}

                {/* Layer 6: Premium Horizon System */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `
                            radial-gradient(ellipse 150% 38% at 50% 100%, 
                                rgba(210, 170, 95, 0.38) 0%, 
                                rgba(160, 180, 110, 0.24) 32%, 
                                rgba(100, 140, 100, 0.12) 54%,
                                transparent 72%
                            )
                        `
                    }}
                />

                {/* Layer 7: Enhanced Light Rays */}
                {!prefersReducedMotion && (
                    <div className="absolute inset-0 opacity-10">
                        {[...Array(16)].map((_, i) => (
                            <div
                                key={`beam-${i}`}
                                className="absolute bottom-0 left-1/2"
                                style={{
                                    width: '1.2px',
                                    height: '78%',
                                    background: 'linear-gradient(to top, rgba(230, 190, 110, 0.55), transparent)',
                                    transform: `rotate(${-50 + i * 6.25}deg) translateX(-50%)`,
                                    transformOrigin: 'bottom center',
                                    animation: `beamPulse ${9 + i * 1.3}s ease-in-out infinite`,
                                    animationDelay: `${i * -0.7}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Layer 8: Detailed Agricultural Landscape */}
                <svg
                    className="absolute bottom-0 left-0 w-full h-[48%] opacity-96"
                    viewBox="0 0 1440 480"
                    preserveAspectRatio="xMidYMax slice"
                    fill="none"
                >
                    <path d="M0 480 L0 310 Q260 270 520 295 Q780 320 1040 285 Q1300 250 1440 295 L1440 480 Z" fill="rgba(18, 35, 28, 0.52)" />
                    <path d="M0 480 L0 345 Q380 325 760 360 Q1140 395 1440 350 L1440 480 Z" fill="rgba(24, 44, 34, 0.74)" />

                    <g fill="rgba(14, 28, 22, 0.96)">
                        {/* Enhanced trees with more detail */}
                        <path d="M90 480 L90 365 L70 365 L105 300 L85 300 L120 235 L155 300 L135 300 L170 365 L150 365 L150 480 Z" />
                        <path d="M200 480 L200 385 L180 385 L215 320 L195 320 L230 255 L265 320 L245 320 L280 385 L260 385 L260 480 Z" />
                        <path d="M750 480 L750 355 L730 355 L765 290 L745 290 L780 225 L815 290 L795 290 L830 355 L810 355 L810 480 Z" />
                        <path d="M900 480 L900 375 L880 375 L915 310 L895 310 L930 245 L965 310 L945 310 L980 375 L960 375 L960 480 Z" />
                        <path d="M1200 480 L1200 365 L1180 365 L1215 295 L1195 295 L1230 225 L1265 295 L1245 295 L1280 365 L1260 365 L1260 480 Z" />
                    </g>

                    {/* Advanced windmill with blades */}
                    <g fill="rgba(16, 32, 26, 0.92)">
                        <rect x="1320" y="340" width="10" height="140" rx="2" />
                        <g transform="translate(1325, 340)">
                            <rect x="-2.5" y="-72" width="5" height="72" rx="1" transform="rotate(0)" />
                            <rect x="-2.5" y="-72" width="5" height="72" rx="1" transform="rotate(90)" />
                            <rect x="-2.5" y="-72" width="5" height="72" rx="1" transform="rotate(180)" />
                            <rect x="-2.5" y="-72" width="5" height="72" rx="1" transform="rotate(270)" />
                            <circle cx="0" cy="0" r="6" />
                        </g>
                    </g>

                    {/* Perspective crop rows */}
                    <g stroke="rgba(58, 78, 58, 0.68)" strokeWidth="1.8" opacity="0.85">
                        {[...Array(18)].map((_, i) => {
                            const x = 350 + i * 50;
                            return <line key={i} x1={x} y1="480" x2={720 + (i - 9) * 18} y2="410" />;
                        })}
                    </g>

                    <rect x="0" y="435" width="1440" height="45" fill="rgba(10, 20, 15, 0.99)" />
                </svg>

                {/* Layer 9: Layered Atmospheric Mist */}
                {!prefersReducedMotion && (
                    <>
                        {[...Array(3)].map((_, i) => (
                            <div key={`mist-${i}`} className="absolute bottom-0 left-0 w-full h-[32%] overflow-hidden" style={{ opacity: 0.85 - i * 0.15 }}>
                                <div
                                    className="absolute w-[200%] h-full"
                                    style={{
                                        background: `linear-gradient(90deg, ${i === 0 ? 'transparent 0%, rgba(170, 190, 165, 0.16) 22%, rgba(190, 200, 175, 0.14) 45%, transparent 65%, rgba(180, 195, 170, 0.12) 85%, transparent 100%' :
                                            i === 1 ? 'rgba(190, 200, 180, 0.1) 0%, transparent 35%, rgba(180, 195, 175, 0.14) 65%, transparent 95%' :
                                                'transparent 0%, rgba(175, 190, 170, 0.08) 40%, transparent 75%'
                                            })`,
                                        animation: `mistDrift ${55 + i * 12}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`
                                    }}
                                />
                            </div>
                        ))}
                    </>
                )}

                {/* Layer 10: Enhanced Neural Network */}
                {!prefersReducedMotion && (
                    <svg className="absolute inset-0 w-full h-full opacity-32 pointer-events-none">
                        {networkNodes.map((node, i) => {
                            const connections = networkNodes
                                .filter((_, j) => j > i && Math.abs(node.x - networkNodes[j].x) < 22 && Math.abs(node.y - networkNodes[j].y) < 22)
                                .slice(0, 3);

                            return connections.map((target, ci) => (
                                <line
                                    key={`link-${i}-${ci}`}
                                    x1={`${node.x}%`}
                                    y1={`${node.y}%`}
                                    x2={`${target.x}%`}
                                    y2={`${target.y}%`}
                                    stroke="rgba(130, 190, 155, 0.35)"
                                    strokeWidth="0.6"
                                    style={{
                                        animation: `networkPulse ${9 + Math.random() * 9}s ease-in-out infinite`,
                                        animationDelay: `${node.delay}s`
                                    }}
                                />
                            ));
                        })}
                    </svg>
                )}

                {/* Layer 11: Multi-Type Wisdom Particles (More abundant) */}
                {!prefersReducedMotion && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Golden Growth Fireflies */}
                        {[...Array(18)].map((_, i) => (
                            <div
                                key={`growth-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    width: `${3.5 + Math.random() * 4.5}px`,
                                    height: `${3.5 + Math.random() * 4.5}px`,
                                    left: `${4 + Math.random() * 92}%`,
                                    top: `${18 + Math.random() * 64}%`,
                                    background: `radial-gradient(circle, rgba(255, 230, 130, 0.98) 0%, rgba(210, 175, 90, 0.55) 52%, transparent 82%)`,
                                    boxShadow: `0 0 ${14 + Math.random() * 10}px rgba(255, 230, 130, 0.75)`,
                                    animation: `growthFloat ${14 + Math.random() * 22}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 11}s`
                                }}
                            />
                        ))}

                        {/* Emerald Intelligence Nodes */}
                        {[...Array(14)].map((_, i) => (
                            <div
                                key={`intelligence-${i}`}
                                className="absolute rounded-full"
                                style={{
                                    width: `${4.5 + Math.random() * 5.5}px`,
                                    height: `${4.5 + Math.random() * 5.5}px`,
                                    left: `${8 + Math.random() * 84}%`,
                                    top: `${22 + Math.random() * 56}%`,
                                    background: `radial-gradient(circle, rgba(110, 230, 190, 0.75) 0%, rgba(70, 170, 150, 0.45) 62%, transparent 92%)`,
                                    boxShadow: '0 0 12px rgba(110, 230, 190, 0.55)',
                                    animation: `intelligenceFloat ${16 + Math.random() * 24}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 14}s`
                                }}
                            />
                        ))}

                        {/* Abundant Pollen */}
                        {[...Array(45)].map((_, i) => (
                            <div
                                key={`seed-${i}`}
                                className="absolute rounded-full bg-amber-200/25"
                                style={{
                                    width: `${1.2 + Math.random() * 2.2}px`,
                                    height: `${1.2 + Math.random() * 2.2}px`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${18 + Math.random() * 72}%`,
                                    animation: `seedDrift ${11 + Math.random() * 18}s linear infinite`,
                                    animationDelay: `${Math.random() * 10}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Layer 12: Cinematic Vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse 78% 78% at 50% 46%, 
                            transparent 38%, 
                            rgba(6, 12, 17, 0.32) 77%,
                            rgba(6, 12, 17, 0.52) 96%
                        )`
                    }}
                />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                ✨ ENHANCED ANIMATIONS
            ═══════════════════════════════════════════════════════════════ */}
            <style>{`
                @keyframes streamFlow {
                    0% { stroke-dashoffset: 0; opacity: 0.22; }
                    50% { opacity: 0.65; }
                    100% { stroke-dashoffset: -110; opacity: 0.22; }
                }
                @keyframes wave1 {
                    0%, 100% { background-position: 0% 0%; opacity: 0.18; }
                    50% { background-position: 100% 100%; opacity: 0.28; }
                }
                @keyframes wave2 {
                    0%, 100% { background-position: 100% 0%; opacity: 0.15; }
                    50% { background-position: 0% 100%; opacity: 0.24; }
                }
                @keyframes wave3 {
                    0%, 100% { background-position: 50% 50%; opacity: 0.12; }
                    50% { background-position: 150% 150%; opacity: 0.20; }
                }
                @keyframes beamPulse {
                    0%, 100% { opacity: 0.05; transform: rotate(var(--rotation)) translateX(-50%) scaleY(0.92); }
                    50% { opacity: 0.14; transform: rotate(var(--rotation)) translateX(-50%) scaleY(1.12); }
                }
                @keyframes mistDrift {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes networkPulse {
                    0%, 100% { opacity: 0.24; stroke-width: 0.6; }
                    50% { opacity: 0.55; stroke-width: 1.2; }
                }
                @keyframes growthFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.42; }
                    28% { transform: translate(28px, -45px) scale(1.45); opacity: 0.98; }
                    54% { transform: translate(-24px, -78px) scale(1.05); opacity: 0.65; }
                    78% { transform: translate(32px, -52px) scale(1.35); opacity: 0.88; }
                }
                @keyframes intelligenceFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.52; }
                    35% { transform: translate(-32px, -55px) scale(1.25); opacity: 0.85; }
                    68% { transform: translate(38px, -35px) scale(0.92); opacity: 0.62; }
                }
                @keyframes seedDrift {
                    0% { transform: translateY(0) translateX(0); opacity: 0.35; }
                    100% { transform: translateY(-85vh) translateX(${Math.random() > 0.5 ? '' : '-'}${22 + Math.random() * 45}px); opacity: 0; }
                }
            `}</style>

            {/* ═══════════════════════════════════════════════════════════════
                🎯 ULTRA-PREMIUM REGISTRATION CARD
            ═══════════════════════════════════════════════════════════════ */}
            <div className="relative z-10 max-w-lg w-full">
                <div
                    className="absolute -inset-10 rounded-[4rem]"
                    style={{
                        background: `radial-gradient(circle at 50% 22%, 
                            rgba(190, 170, 110, 0.28) 0%, 
                            rgba(110, 190, 160, 0.22) 42%, 
                            rgba(90, 150, 130, 0.17) 62%,
                            transparent 82%
                        )`,
                        filter: 'blur(45px)',
                        opacity: 0.65,
                        animation: !prefersReducedMotion ? 'formGlow 11s ease-in-out infinite' : 'none'
                    }}
                />

                <div
                    className="relative p-12 rounded-[3rem] border-2 backdrop-blur-2xl transition-all duration-700"
                    style={{
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.75), rgba(30, 41, 59, 0.65), rgba(15, 23, 42, 0.75))'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9), rgba(255, 255, 255, 0.95))',
                        borderColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.14)'
                            : 'rgba(203, 213, 225, 0.4)',
                        boxShadow: isDarkMode
                            ? '0 30px 70px -18px rgba(0, 0, 0, 0.65)'
                            : '0 30px 70px -18px rgba(0, 0, 0, 0.15)'
                    }}
                >

                    <div
                        className="absolute inset-0 rounded-[3rem] opacity-45"
                        style={{
                            background: 'radial-gradient(circle at 32% 22%, rgba(255,255,255,0.035) 0%, transparent 52%)'
                        }}
                    />

                    {!prefersReducedMotion && [...Array(12)].map((_, i) => (
                        <div
                            key={`glow-${i}`}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                                left: `${12 + Math.random() * 76}%`,
                                top: `${8 + Math.random() * 84}%`,
                                background: `rgba(${210 + Math.random() * 45}, ${190 + Math.random() * 35}, ${110 + Math.random() * 70}, 0.${5 + Math.floor(Math.random() * 4)})`,
                                boxShadow: `0 0 ${5 + Math.random() * 7}px rgba(255, 230, 150, 0.55)`,
                                animation: `twinkle ${2.8 + Math.random() * 3.8}s ease-in-out infinite`,
                                animationDelay: `${Math.random() * 3.5}s`
                            }}
                        />
                    ))}

                    <div className="relative">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[1.6rem] bg-gradient-to-br from-amber-600/[0.38] via-emerald-600/[0.32] to-cyan-600/[0.35] border-2 border-white/[0.14] mb-6 relative overflow-hidden shadow-xl">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: 'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.18) 0%, transparent 62%)'
                                    }}
                                />
                                <span className="text-5xl relative z-10">🌱</span>
                                {!prefersReducedMotion && (
                                    <div
                                        className="absolute inset-0 opacity-45"
                                        style={{
                                            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
                                            animation: 'spin 7s linear infinite'
                                        }}
                                    />
                                )}
                            </div>

                            <h2
                                className="text-[1.85rem] font-black tracking-[-0.025em] leading-tight mb-3.5 transition-colors duration-700"
                                style={{ color: isDarkMode ? '#ffffff' : '#1e293b' }}
                            >
                                Join the Revolution
                            </h2>
                            <p
                                className="text-sm max-w-[320px] mx-auto leading-relaxed font-medium transition-colors duration-700"
                                style={{ color: isDarkMode ? 'rgba(148, 163, 184, 0.95)' : 'rgba(71, 85, 105, 0.95)' }}
                            >
                                Create your account to access next-generation smart farming intelligence
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Profile Photo */}
                            <div className="flex flex-col items-center justify-center">
                                <div
                                    className="relative w-28 h-28 rounded-full bg-slate-800/60 border-3 border-dashed border-slate-700/50 flex items-center justify-center cursor-pointer hover:border-emerald-500/60 overflow-hidden transition-all duration-300 group shadow-lg"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📸</span>
                                            <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-wider">Photo</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <p className="text-[0.7rem] text-slate-500 mt-3 font-medium tracking-wide">
                                    {previewUrl ? "Click to change" : "Upload Photo (Optional)"}
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-500/[0.14] border-2 border-red-500/35 text-red-300 text-sm p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-sm">
                                    <span className="text-xl">⚠️</span>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="space-y-4.5">
                                {[
                                    { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Farmer', value: name, onChange: setName, icon: '👤' },
                                    { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your.email@farm.com', value: email, onChange: setEmail, icon: '📧' },
                                    { id: 'password', label: 'Password', type: 'password', placeholder: '••••••••••••', value: password, onChange: setPassword, icon: '🔐' },
                                    { id: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••••••', value: confirmPassword, onChange: setConfirmPassword, icon: '🔒' }
                                ].map(field => (
                                    <div key={field.id}>
                                        <label
                                            htmlFor={field.id}
                                            className="block text-[0.7rem] font-black uppercase tracking-[0.16em] mb-2.5 ml-1 transition-colors duration-700"
                                            style={{ color: isDarkMode ? '#64748b' : '#475569' }}
                                        >
                                            {field.label}
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-lg group-focus-within:scale-110 transition-transform duration-200">
                                                {field.icon}
                                            </div>
                                            <input
                                                id={field.id}
                                                type={field.type}
                                                required
                                                className="w-full h-[3.85rem] rounded-2xl pl-14 pr-5 focus:outline-none focus:ring-4 transition-all duration-300 text-sm font-medium backdrop-blur-sm"
                                                style={{
                                                    background: isDarkMode ? 'rgba(30, 41, 59, 0.65)' : 'rgba(248, 250, 252, 0.8)',
                                                    border: isDarkMode ? '2px solid rgba(51, 65, 85, 0.45)' : '2px solid rgba(203, 213, 225, 0.6)',
                                                    color: isDarkMode ? '#ffffff' : '#1e293b'
                                                }}
                                                placeholder={field.placeholder}
                                                value={field.value}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative w-full h-[4.2rem] bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-700 hover:from-emerald-600 hover:via-emerald-500 hover:to-cyan-600 text-white font-black text-[0.75rem] uppercase tracking-[0.28em] rounded-2xl transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-12px_rgba(16,185,129,0.45)] disabled:opacity-50 disabled:transform-none border-2 border-white/[0.16] overflow-hidden group mt-8"
                            >
                                {!prefersReducedMotion && (
                                    <>
                                        <div
                                            className="absolute inset-0 opacity-45 group-hover:opacity-65 transition-opacity duration-300"
                                            style={{
                                                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.28) 50%, transparent 100%)',
                                                backgroundSize: '200% 100%',
                                                animation: 'shine 3.8s linear infinite'
                                            }}
                                        />
                                        <div
                                            className="absolute inset-0 opacity-35"
                                            style={{
                                                background: 'radial-gradient(circle at 32% 32%, rgba(255,255,255,0.22) 0%, transparent 62%)'
                                            }}
                                        />
                                    </>
                                )}
                                <span className="relative flex items-center justify-center gap-2.5">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4.5 h-4.5 border-2 border-white/45 border-t-white rounded-full animate-spin" />
                                            Creating Account
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <span className="text-lg">🌾</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>

                        <div className="text-center mt-10 pt-8 border-t border-white/[0.09]">
                            <p className="text-sm text-slate-500 font-medium">
                                Already registered?{' '}
                                <Link to="/login" className="font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all duration-300">
                                    Sign In Here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center z-10">
                <p className="text-[0.65rem] font-bold text-slate-600/85 tracking-[0.32em] uppercase mb-2">
                    Next-Generation Agricultural Platform
                </p>
                <div className="flex items-center justify-center gap-2 opacity-45">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
            </div>

            <style>{`
                @keyframes formGlow {
                    0%, 100% { opacity: 0.55; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.1); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0); }
                    50% { opacity: 1; transform: scale(2.2); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes shine {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
};

export default Register;
