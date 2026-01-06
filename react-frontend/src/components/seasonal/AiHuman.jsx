import React, { useState, useEffect, useRef } from 'react';

/**
 * AiHuman.jsx
 * Multilingual Voice-Interactive Assistant for farmers.
 * Supports English and Tamil.
 */
const AiHuman = ({ season, language, weather, bioState }) => {
    const [isListening, setIsListening] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                processFarmerInput(transcript);
            };

            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const speakResponse = (text, lang) => {
        if (!synthRef.current) return;
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        synthRef.current.speak(utterance);
    };

    const processFarmerInput = (input) => {
        let response = '';
        let systemLang = 'en';

        // Detect Language (Basic heuristic)
        if (/[அ-ஔ]/.test(input) || input.includes('vanakkam') || input.includes('tamil')) {
            systemLang = 'ta';
        }

        const isWeatherQuery = /weather|rain|temp|வானிலை|மழை|வெப்பம்/i.test(input);
        const isCropQuery = /crop|plant|growth|health|பயிர்|செடி|வளர்ச்சி|ஆரோக்கியம்/i.test(input);
        const isSeasonQuery = /season|time|பருவம்|காலம்/i.test(input);

        if (isWeatherQuery) {
            if (systemLang === 'ta') {
                response = `தற்போதைய வானிலை ${weather?.condition || 'சாதாரணம்'}. வெப்பநிலை ${weather?.temp || '--'} டிகிரி செல்சியஸ்.`;
            } else {
                response = `The current weather is ${weather?.condition || 'stable'}. Temperature is ${weather?.temp || '--'} degrees Celsius.`;
            }
        } else if (isCropQuery) {
            const hydration = Math.round(bioState?.indicators?.waterUptake * 100) || 0;
            if (systemLang === 'ta') {
                response = `பயிர்களின் நீர் உறிஞ்சுதல் ${hydration} சதவீதம். ${bioState?.interpretation?.hint || ''}`;
            } else {
                response = `Crop water uptake is at ${hydration} percent. ${bioState?.interpretation?.hint || ''}`;
            }
        } else if (isSeasonQuery) {
            if (systemLang === 'ta') {
                response = `இது ${season} பருவம். இந்த காலத்தில் விவசாயம் செய்ய நான் உங்களுக்கு உதவுவேன்.`;
            } else {
                response = `This is the ${season} season. I am here to guide your farming activities during this time.`;
            }
        } else {
            if (systemLang === 'ta') {
                response = "வணக்கம்! நான் உங்கள் விவசாய உதவியாளர். வானிலை அல்லது பயிர்களைப் பற்றி என்னிடம் கேளுங்கள்.";
            } else {
                response = "Hello! I am your AI Human Assistant. Ask me about weather, crops, or seasonal guidance.";
            }
        }

        setAiResponse(response);
        speakResponse(response, systemLang);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setAiResponse('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="relative group cursor-pointer" onClick={toggleListening}>
            {/* Holographic Projection Base */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-cyan-500/20 rounded-full blur-xl animate-pulse"></div>

            {/* AI Human Visual Avatar */}
            <div className={`relative w-20 h-40 flex flex-col items-center transition-all duration-500 ${isSpeaking ? 'scale-105' : ''}`}>
                {/* Energy Core / Head */}
                <div className={`w-12 h-12 rounded-full border-2 border-cyan-400/50 flex items-center justify-center bg-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all ${isListening ? 'animate-ping' : ''}`}>
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 ${isSpeaking ? 'animate-pulse' : ''}`}></div>
                </div>

                {/* Body Column */}
                <div className="w-1 h-20 bg-gradient-to-b from-cyan-400/80 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>

                {/* Floating Knowledge Rings */}
                <div className="absolute top-16 w-16 h-16 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute top-14 w-20 h-20 border border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                {/* AI Label */}
                <div className="absolute -bottom-8 whitespace-nowrap bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-400">AI Human Assistant</span>
                </div>
            </div>

            {/* Response Panel */}
            {aiResponse && (
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 bg-slate-900/95 backdrop-blur-2xl p-4 rounded-2xl border border-emerald-500/30 shadow-2xl animate-in slide-in-from-bottom-2 fade-in">
                    <p className="text-[11px] text-white/90 leading-relaxed font-medium italic">
                        "{aiResponse}"
                    </p>
                    <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[7px] text-white/30 uppercase font-bold tracking-tighter">Voice Response Active</span>
                        <div className="flex gap-1">
                            <div className={`w-1 h-3 bg-emerald-400 rounded-full ${isSpeaking ? 'animate-[bounce_0.5s_infinite]' : ''}`}></div>
                            <div className={`w-1 h-4 bg-emerald-400 rounded-full ${isSpeaking ? 'animate-[bounce_0.5s_infinite_0.1s]' : ''}`}></div>
                            <div className={`w-1 h-2 bg-emerald-400 rounded-full ${isSpeaking ? 'animate-[bounce_0.5s_infinite_0.2s]' : ''}`}></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Microphone Status */}
            {isListening && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
                    <span className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Listening...</span>
                </div>
            )}

            {/* Mandatory Disclaimer (Embedded for Context) */}
            <div className="hidden group-hover:block absolute top-[110%] left-1/2 -translate-x-1/2 w-48 text-center">
                <p className="text-[6px] text-white/40 leading-tight uppercase font-medium">
                    "AI Human provides decision support, not guarantees. Derived from real data models."
                </p>
            </div>
        </div>
    );
};

export default AiHuman;
