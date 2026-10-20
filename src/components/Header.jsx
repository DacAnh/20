// src/components/Header.jsx
import React from 'react';

const Header = ({ soundEnabled, onToggleSound, onOpenModal }) => {
    return (
        <header className="w-full flex justify-between items-center max-w-4xl mx-auto pointer-events-auto">
            {/* Badge */}
            <div className="flex items-center space-x-2 bg-pink-950/45 border border-pink-400/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-ping"></span>
                <span className="text-[11px] sm:text-xs font-medium tracking-wider text-pink-200 uppercase">
                    20 Tháng 10
                </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
                {/* Nút bật/tắt âm thanh */}
                <button
                    onClick={onToggleSound}
                    className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border text-pink-200 hover:text-white transition-all shadow-md active:scale-90 ${soundEnabled ? 'bg-pink-600/60 border-pink-300' : 'bg-purple-950/60 border-pink-400/40'
                        }`}
                    title="Bật/Tắt âm thanh"
                >
                    {soundEnabled ? (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;