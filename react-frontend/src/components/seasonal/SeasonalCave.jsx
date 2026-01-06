import React from 'react';

const SeasonalCave = ({ season, onClick }) => {
    // Subtle, elegant glow colors per season
    const getGlowColor = () => {
        switch (season) {
            case 'RAINY': return 'rgba(34, 211, 238, 0.4)'; // Cyan/Blue
            case 'SUMMER': return 'rgba(251, 191, 36, 0.4)'; // Warm Gold
            case 'WINTER': return 'rgba(226, 232, 240, 0.4)'; // Icy White
            case 'AUTUMN': return 'rgba(249, 115, 22, 0.4)'; // Amber/Orange
            default: return 'rgba(255,255,255,0.2)';
        }
    };

    return (
        <div
            className="w-40 h-32 cursor-pointer group transition-all duration-1000 relative"
            style={{ transformStyle: 'preserve-3d' }}
            onClick={onClick}
        >
            {/* The Rock Structure (Realistic Organic Shape) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-2xl overflow-hidden border-b-8 border-slate-900/50 transform-gpu group-hover:scale-105 transition-transform duration-700">
                {/* Organic Texture Overlay */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/rocky-wall.png')] pointer-events-none"></div>

                {/* The Internal Portal (Knowledge Soft Glow) */}
                <div className="absolute top-[30%] left-[25%] right-[25%] bottom-[5%] bg-black rounded-t-full opacity-90 overflow-hidden">
                    <div
                        className="absolute inset-0 transition-opacity duration-1000 group-hover:opacity-60 opacity-20"
                        style={{
                            background: `radial-gradient(circle at center, ${getGlowColor()} 0%, transparent 70%)`,
                            boxShadow: `inset 0 0 20px ${getGlowColor()}`
                        }}
                    ></div>

                    {/* Subtle Pulsing Aura */}
                    <div className="absolute inset-0 animate-pulse-slow opacity-30" style={{ background: `radial-gradient(circle at center, ${getGlowColor()} 0%, transparent 80%)` }}></div>
                </div>

                {/* Highlight on top of rock */}
                <div className="absolute top-0 left-1/4 right-1/4 h-2 bg-white/5 rounded-full blur-sm"></div>
            </div>

            {/* Label - Floating Elegantly */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-2">
                <span className="text-[10px] font-black tracking-[0.3em] text-white/60 mb-1">KNOWLEDGE GATEWAY</span>
                <span className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-1 rounded-full text-[12px] font-bold tracking-widest shadow-2xl">
                    {season} INSIGHTS
                </span>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: scale(0.95); }
                    50% { opacity: 0.5; transform: scale(1.05); }
                }
            `}} />
        </div>
    );
};

export default SeasonalCave;
