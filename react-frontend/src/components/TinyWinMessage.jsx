import React, { useState, useEffect } from 'react';

const TinyWinMessage = () => {
    const [message, setMessage] = useState('');

    const messages = [
        "Every small step on the farm adds up to a big harvest.",
        "You showed up today, and that's the most important part.",
        "Nature takes its time, and it's okay for you to take yours too.",
        "Clear thinking starts with a calm mind. You've got this.",
        "Your experience is your most valuable tool.",
        "One decision at a time is the best way to move forward.",
        "The soil rewards patience, and so does life.",
        "You are doing your best, and that is enough."
    ];

    useEffect(() => {
        // Select a random message once on mount
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMsg);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm animate-fade-in p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-4 text-4xl animate-bounce-gentle">🌱</div>
                <h3 className="text-xl md:text-2xl font-semibold text-green-800 mb-2">
                    Welcome back
                </h3>
                <p className="text-gray-600 text-lg font-medium leading-relaxed">
                    {message}
                </p>
                <div className="mt-8 flex justify-center">
                    <div className="w-16 h-1 bg-green-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 animate-progress-loading"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TinyWinMessage;
