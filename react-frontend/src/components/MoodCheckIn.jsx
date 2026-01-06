import React, { useState } from 'react';

const MoodCheckIn = ({ onMoodSelect, t }) => {
    // t is a simple fallback if not provided, though we expect it passed from parent
    const translate = t || ((key) => key);

    const [selected, setSelected] = useState(null);
    const [response, setResponse] = useState('');

    const moods = [
        {
            id: 'good',
            label: '😊 All good',
            response: "That's wonderful to hear. Let's keep that positive momentum going."
        },
        {
            id: 'tense',
            label: '😐 A little tense',
            response: "I understand. Take a deep breath. We'll take things one step at a time."
        },
        {
            id: 'tough',
            label: '😔 Not great today',
            response: "I hear you. It's okay to have tough days. We're here to support your decisions."
        }
    ];

    const handleSelect = (mood) => {
        setSelected(mood.id);
        setResponse(mood.response);
        if (onMoodSelect) {
            onMoodSelect(mood.id);
        }
    };

    return (
        <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 transition-all duration-500 ease-in-out">
            {!selected ? (
                <>
                    <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
                        Before we start, how is your day going?
                    </h3>
                    <div className="flex justify-center gap-2 sm:gap-4">
                        {moods.map((mood) => (
                            <button
                                key={mood.id}
                                type="button"
                                onClick={() => handleSelect(mood)}
                                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm"
                            >
                                {mood.label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-center animate-fade-in">
                    <p className="text-sm text-blue-800 font-medium">
                        {response}
                    </p>
                </div>
            )}
        </div>
    );
};

export default MoodCheckIn;
