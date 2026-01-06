import React from 'react';

/**
 * EarthEntryButton.jsx
 * A premium, rotating 3D Earth component using CSS 3D layers.
 * Serves as the high-fidelity gateway to the Smart World.
 */
const EarthEntryButton = ({ onClick }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-1000">
            {/* Title / Brand */}
            <div className="text-center space-y-2">
                <h1 className="text-6xl font-black italic tracking-tighter text-white">
                    SMART<span className="text-emerald-400">WORLD</span>
                </h1>
                <p className="text-emerald-400/60 font-black uppercase tracking-[0.6em] text-[10px]">
                    Agricultural Intelligence v4.0
                </p>
            </div>

            {/* Earth Container */}
            <div
                className="relative w-80 h-80 cursor-pointer group"
                onClick={onClick}
                style={{ perspective: '1000px' }}
            >
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-1000 group-hover:scale-125"></div>

                {/* Earth Sphere Layers */}
                <div className="relative w-full h-full rounded-full animate-earth-rotate preserve-3d">
                    {/* Oceans / Base */}
                    <div className="absolute inset-0 bg-blue-900 rounded-full shadow-inner border border-white/5 overflow-hidden">
                        {/* Landmasses (SVG Pattern) */}
                        <div className="absolute inset-0 opacity-40 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>

                        {/* Procedural Landmass Gradients */}
                        <div className="absolute h-full w-[300%] flex animate-drift-land">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex-1 flex justify-around items-center opacity-70">
                                    <div className="w-20 h-24 bg-emerald-800 rounded-full blur-2xl"></div>
                                    <div className="w-32 h-16 bg-emerald-700 rounded-full blur-3xl"></div>
                                    <div className="w-16 h-32 bg-green-900 rounded-full blur-xl"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Atmospheric Glow Layer */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(34,211,238,0.4)] border border-white/10"></div>

                    {/* Clouds Layer */}
                    <div className="absolute -inset-2 rounded-full opacity-30 mix-blend-screen flex animate-drift-clouds w-[200%] pointer-events-none">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex-1 flex justify-around items-center">
                                <div className="w-40 h-12 bg-white rounded-full blur-3xl"></div>
                                <div className="w-24 h-24 bg-white/50 rounded-full blur-2xl"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interaction Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-emerald-500/50 shadow-2xl scale-95 group-hover:scale-100 transition-transform">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Initialize World</span>
                    </div>
                </div>
            </div>

            {/* Instruction */}
            <div className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">
                Click to enter the digital ecosystem
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .preserve-3d { transform-style: preserve-3d; }
                
                @keyframes earth-rotate {
                    from { transform: rotateY(0deg) rotateX(10deg); }
                    to { transform: rotateY(360deg) rotateX(10deg); }
                }
                
                @keyframes drift-land {
                    from { transform: translateX(0); }
                    to { transform: translateX(-33.33%); }
                }
                
                @keyframes drift-clouds {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
            `}} />
        </div>
    );
};

export default EarthEntryButton;
