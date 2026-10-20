// src/components/GreetingCard.jsx
import React, { useState, useEffect } from 'react';
import { audio } from '../utils/audio';

const GreetingCard = ({
    visible,
    recipient,
    message,
    sender,
    soundEnabled,
    onReplay,
}) => {
    const [minimized, setMinimized] = useState(false);
    const [typewriterText, setTypewriterText] = useState('');

    // Hiệu ứng Typewriter
    useEffect(() => {
        if (!visible) {
            setTypewriterText('');
            setMinimized(false);
            return;
        }
        let idx = 0;
        setTypewriterText('');
        const timer = setInterval(() => {
            idx++;
            setTypewriterText(message.slice(0, idx));
            if (idx % 5 === 0 && soundEnabled) {
                audio.playTone(650 + Math.random() * 300, 0.2, 0.015, true);
            }
            if (idx >= message.length) {
                clearInterval(timer);
            }
        }, 35);

        return () => clearInterval(timer);
    }, [visible, message, soundEnabled]);

    const renderFormattedSender = (name) => {
        if (!name) return '';
        if (name.includes(' - ')) {
            const [mainName, subName] = name.split(' - ');
            return (
                <span>
                    {mainName}{' '}
                    <span className="text-[10px] sm:text-xs text-pink-300/75 font-normal italic tracking-normal">
                        - {subName}
                    </span>
                </span>
            );
        }
        return name;
    };

    if (!visible) return null;

    return (
        <>
            <main
                className={`glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-7 max-w-lg w-full mx-auto my-auto pointer-events-auto transform transition-all duration-700 ${minimized ? 'scale-75 opacity-0 pointer-events-none hidden' : 'scale-100 opacity-100 translate-y-0'
                    }`}
            >
                {/* Header */}
                <div className="text-center relative pb-2.5 border-b border-pink-400/20">
                    <div className="text-xl sm:text-2xl mb-1">🌸 💖 🌸</div>
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-pink-300 font-semibold mb-0.5">
                        Ngày Phụ Nữ Việt Nam 20/10
                    </p>
                    <h2 className="text-2xl sm:text-4xl font-cursive glow-gold text-amber-200 leading-tight">
                        Gửi {recipient}
                    </h2>
                </div>

                {/* Typewriter Message */}
                <div className="my-4 min-h-[90px] sm:min-h-[110px] max-h-[38vh] overflow-y-auto custom-scroll pr-1">
                    <p className="text-sm sm:text-base leading-relaxed text-pink-100 font-light font-subcursive tracking-wide">
                        {typewriterText}
                        <span className="inline-block w-1.5 h-3.5 bg-pink-400 ml-0.5 animate-pulse"></span>
                    </p>
                </div>

                {/* Signature & Actions */}
                <div className="pt-3 border-t border-pink-400/20 flex flex-col sm:flex-row justify-between items-center gap-2.5">
                    <div className="text-center sm:text-left">
                        <p className="text-[11px] text-pink-300/70 italic">Gửi từ,</p>
                        <p className="text-xs sm:text-sm font-serif-title font-semibold text-pink-200">
                            {renderFormattedSender(sender)}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onReplay}
                            className="px-2.5 py-1.5 text-[11px] rounded-full bg-pink-900/40 hover:bg-pink-800/60 border border-pink-400/30 text-pink-200 transition-all flex items-center space-x-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span>Quà</span>
                        </button>
                        <button
                            onClick={() => setMinimized(true)}
                            className="px-2.5 py-1.5 text-[11px] rounded-full bg-purple-900/50 hover:bg-purple-800/70 border border-purple-400/40 text-purple-200 transition-all"
                        >
                            <span>Ẩn ngắm pháo</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Nút quả cầu mở lại thiệp khi đã thu nhỏ */}
            {minimized && (
                <button
                    onClick={() => setMinimized(false)}
                    className="fixed bottom-5 right-5 z-20 flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium text-xs shadow-xl border border-pink-300/40 animate-gentle-pulse pointer-events-auto"
                >
                    <span>💌 Mở Thiệp Chúc</span>
                </button>
            )}
        </>
    );
};

export default GreetingCard;