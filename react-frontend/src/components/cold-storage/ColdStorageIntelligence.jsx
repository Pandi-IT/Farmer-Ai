import React, { useState, useEffect, useMemo } from 'react';
import { COLD_STORAGE_DATA, CROP_INTELLIGENCE } from '../../data/coldStorageData';
import ColdStorageMapView from './ColdStorageMapView';
import { initSpeechRecognition } from '../../utils/VoiceInputModule';
import { getApiUrl, API_ENDPOINTS } from '../../utils/api';

/**
 * ColdStorageIntelligence - The main intelligence system for checking availability.
 */
const ColdStorageIntelligence = ({ isOpen, onClose, language }) => {
    const [searchQuery, setSearchQuery] = useState({
        crop: '',
        quantity: '',
        location: ''
    });
    const [isListening, setIsListening] = useState(false);
    const [listeningField, setListeningField] = useState(null);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

    const t = useMemo(() => ({
        en: {
            title: "Cold Storage Intelligence",
            subtitle: "REAL-TIME AVAILABILITY & PRICE",
            cropLabel: "What crop?",
            qtyLabel: "Quantity (kg/tons)",
            locLabel: "Search Area",
            checkBtn: "Analyze Availability",
            available: "Available",
            full: "Sold Out / Full",
            cost: "Storage Cost",
            capacity: "Total Capacity",
            rem: "Remaining",
            rec: "Smart Recommendations",
            footer: "Map and distance data are provided using OpenStreetMap and OpenRouteService. Availability and prices may change.",
            noMatch: "No matching facility found for this crop temperature requirements.",
            suggest: "Try these nearby alternatives:"
        },
        ta: {
            title: "பனி கூடம் அறிவாற்றல்",
            subtitle: "உண்மை நேர இருப்பு மற்றும் விலை",
            cropLabel: "என்ன பயிர்?",
            qtyLabel: "அளவு (கிலோ/டன்)",
            locLabel: "தேடும் பகுதி",
            checkBtn: "இருப்பை ஆய்வு செய்க",
            available: "கிடைக்கும்",
            full: "இடமில்லை / நிரம்பிவிட்டது",
            cost: "சேமிப்பு கட்டணம்",
            capacity: "மொத்த கொள்ளளவு",
            rem: "மீதமுள்ளவை",
            rec: "அறிவார்ந்த பரிந்துரைகள்",
            footer: "வரைபடம் மற்றும் தூரத் தரவு OpenStreetMap மற்றும் OpenRouteService ஐப் பயன்படுத்தி வழங்கப்படுகிறது. இருப்பு மற்றும் விலை மாறலாம்.",
            noMatch: "இந்த பயிர் வெப்பநிலை தேவைகளுக்கு பொருத்தமான வசதி எதுவும் கிடைக்கவில்லை.",
            suggest: "இந்த அருகிலுள்ள மாற்றுகளை முயற்சிக்கவும்:"
        }
    }), []);

    const currentT = t[language] || t.en;

    const handleSearch = async () => {
        if (!searchQuery.crop) return;
        setIsLoading(true);

        try {
            const response = await fetch(getApiUrl(API_ENDPOINTS.COLD_STORAGE_SEARCH), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(searchQuery)
            });

            if (response.ok) {
                const data = await response.json();

                // If backend search succeeded with real data
                if (data.status === 'success' && data.facilities.length > 0) {
                    setResults(data.facilities);
                    setSelectedFacility(data.facilities[0]);
                    setIsLoading(false);
                    return;
                }
            }
        } catch (error) {
            console.error("Real-time search error:", error);
        }

        // Fallback to local filtering if API fails or returns no real-time data

        // Normalize search query
        const queryCrop = searchQuery.crop.trim().toLowerCase();
        const queryLoc = searchQuery.location.trim().toLowerCase();

        // Find crop data case-insensitively
        const cropKey = Object.keys(CROP_INTELLIGENCE).find(k => k.toLowerCase() === queryCrop);
        const cropData = cropKey ? CROP_INTELLIGENCE[cropKey] : null;

        let filtered = COLD_STORAGE_DATA.filter(cs => {
            // Check if ANY supported crop matches the query (case-insensitive)
            const supportsCrop = cs.supportedCrops.some(c => c.toLowerCase().includes(queryCrop));

            let tempMatch = true;
            if (cropData) {
                tempMatch = cropData.temp >= cs.tempRange.min && cropData.temp <= cs.tempRange.max;
            }

            const locMatch = queryLoc
                ? cs.location.name.toLowerCase().includes(queryLoc)
                : true;

            return supportsCrop && tempMatch && locMatch;
        });

        filtered.sort((a, b) => {
            if (a.status === 'Available' && b.status !== 'Available') return -1;
            if (a.status !== 'Available' && b.status === 'Available') return 1;
            return a.costPerKg - b.costPerKg;
        });

        setResults(filtered);
        if (filtered.length > 0) setSelectedFacility(filtered[0]);
        setIsLoading(false);
    };

    const toggleVoice = (field) => {
        if (isListening) {
            setIsListening(false);
            setListeningField(null);
        } else {
            setListeningField(field);
            const rec = initSpeechRecognition(language, (transcript) => {
                setSearchQuery(prev => ({ ...prev, [field]: transcript }));
                setIsListening(false);
                setListeningField(null);
            }, () => {
                setIsListening(false);
                setListeningField(null);
            });
            if (rec) {
                rec.start();
                setIsListening(true);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 md:p-10 bg-slate-950/95 backdrop-blur-2xl animate-fade-in">
            <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-slate-900/50 border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(30,58,138,0.5)] flex flex-col overflow-hidden">

                {/* 🎯 Header */}
                <div className="px-12 py-8 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-400/30">
                            <span className="text-3xl">🧊</span>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic">{currentT.title}</h2>
                            <p className="text-[10px] font-black tracking-[0.4em] text-blue-400/60 uppercase">{currentT.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all text-2xl">✕</button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* 🧾 Input Panel */}
                    <div className="w-full md:w-[400px] p-10 border-r border-white/5 overflow-y-auto bg-black/20 shrink-0">
                        <div className="space-y-8">
                            {[
                                { id: 'crop', label: currentT.cropLabel, icon: '🌱', placeholder: language === 'ta' ? 'உருளைக்கிழங்கு...' : 'e.g. Potato...' },
                                { id: 'quantity', label: currentT.qtyLabel, icon: '⚖️', placeholder: 'e.g. 500kg' },
                                { id: 'location', label: currentT.locLabel, icon: '📍', placeholder: 'e.g. Madurai' }
                            ].map(field => (
                                <div key={field.id} className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{field.label}</label>
                                    <div className="relative group">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-transform group-focus-within:scale-110`}>{field.icon}</div>
                                        <input
                                            type="text"
                                            value={searchQuery[field.id]}
                                            onChange={(e) => setSearchQuery(prev => ({ ...prev, [field.id]: e.target.value }))}
                                            placeholder={field.placeholder}
                                            className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-14 text-white text-base focus:outline-none focus:border-blue-500/50 transition-all font-medium"
                                        />
                                        <button
                                            onClick={() => toggleVoice(field.id)}
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${listeningField === field.id ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' : 'bg-white/5 hover:bg-white/10 text-white/40 hover:text-white'
                                                }`}
                                        >
                                            <span className="text-xl">{listeningField === field.id ? '🛑' : '🎤'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95 border border-white/20 mt-4 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>ANALYZING...</span>
                                    </>
                                ) : currentT.checkBtn}
                            </button>
                        </div>
                    </div>

                    {/* 🌍 Results / Map View */}
                    <div className="flex-1 relative flex flex-col bg-slate-900/50">
                        {/* View Switcher - High Z-Index to ensure clickability */}
                        <div className="absolute top-6 right-6 z-[50] flex bg-black/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/20 shadow-2xl">
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer select-none ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                            >
                                {language === 'ta' ? 'பட்டியல்' : 'List View'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('map')}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer select-none ${viewMode === 'map' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                            >
                                {language === 'ta' ? 'வரைபடம்' : 'Map View'}
                            </button>
                        </div>

                        {results.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-40">
                                <div className="text-8xl mb-6 grayscale text-blue-500">🧊</div>
                                <h3 className="text-xl font-bold text-white mb-2">{language === 'ta' ? 'தேடலைத் தொடங்குங்கள்' : 'START YOUR SEARCH'}</h3>
                                <p className="text-sm max-w-sm">{language === 'ta' ? 'அருகிலுள்ள பனி கூடங்களை கண்டறிய பயிர் மற்றும் அளவை உள்ளிடவும்' : 'Enter your crop and quantity to find the most suitable cold storage facilities nearby.'}</p>
                            </div>
                        ) : (
                            viewMode === 'list' ? (
                                <div className="flex-1 overflow-y-auto p-10 space-y-6">
                                    {results.map(cs => (
                                        <div
                                            key={cs.id}
                                            onClick={() => setSelectedFacility(cs)}
                                            className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${selectedFacility?.id === cs.id ? 'bg-blue-600/20 border-blue-500 shadow-2xl scale-[1.02]' : 'bg-white/5 border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex gap-6">
                                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${cs.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500 opacity-50'}`}>
                                                        {cs.status === 'Available' ? '✅' : '❌'}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{cs.name[language]}</h3>
                                                        <p className="text-xs text-white/40 font-bold tracking-widest uppercase mt-1">
                                                            📍 {cs.location.name} {cs.distance ? `• ${cs.distance} KM` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-white">₹{cs.costPerKg}<span className="text-[10px] text-white/40 ml-1">/KG</span></div>
                                                    <div className={`text-[10px] font-black uppercase tracking-widest mt-2 ${cs.status === 'Available' ? 'text-emerald-400' : 'text-red-500'}`}>
                                                        {cs.status === 'Available' ? currentT.available : currentT.full}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 grid grid-cols-3 gap-4">
                                                {[
                                                    { label: currentT.capacity, value: `${cs.totalCapacity}T`, icon: '📦' },
                                                    { label: currentT.rem, value: `${cs.availableCapacity}T`, icon: '📊' },
                                                    { label: language === 'ta' ? 'தொடர்பு' : 'Contact', value: cs.contact, icon: '📞' }
                                                ].map(stat => (
                                                    <div key={stat.label} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                                        <div className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-2 mb-1">
                                                            <span>{stat.icon}</span> {stat.label}
                                                        </div>
                                                        <div className="text-xs font-bold text-slate-200">{stat.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 p-6 relative min-h-[600px]">
                                    <ColdStorageMapView
                                        facilities={results}
                                        selectedFacility={selectedFacility}
                                        language={language}
                                    />
                                    {/* Sidebar for Map */}
                                    <div className="absolute top-10 left-10 z-[1001] w-72 bg-slate-900/90 backdrop-blur-2xl p-6 rounded-[2rem] border border-white/20 shadow-2xl">
                                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">SELECTED FACILITY</h4>
                                        {selectedFacility && (
                                            <div className="space-y-4">
                                                <div className="text-sm font-bold text-white leading-tight">{selectedFacility.name[language]}</div>
                                                <div className="text-[10px] font-bold text-white/40 tracking-widest">📍 {selectedFacility.location.name}</div>
                                                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                                    <div className="text-lg font-black text-white">₹{selectedFacility.costPerKg}<span className="text-[8px] opacity-40">/KG</span></div>
                                                    <div className={`text-[8px] font-black px-3 py-1 rounded-full ${selectedFacility.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-500'}`}>
                                                        {selectedFacility.status === 'Available' ? 'AVAILABLE' : 'FULL'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* 📜 Footer / Disclaimer */}
                <div className="px-12 py-8 bg-black/40 border-t border-white/5 flex flex-col md:flex-row items-center justify-between shrink-0 gap-4">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] max-w-2xl text-center md:text-left">
                        {currentT.footer}
                    </p>
                    <div className="flex items-center gap-2 text-blue-400/40 text-[9px] font-black tracking-widest uppercase">
                        <span>POWERED BY OPEN DATA</span>
                        <span className="w-1 h-1 bg-white/10 rounded-full" />
                        <span>OPENSTREETMAP</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColdStorageIntelligence;
