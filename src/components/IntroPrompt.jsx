// src/components/IntroPrompt.jsx
import React from 'react';

const IntroPrompt = ({ onStartMagic }) => {
    return (
        <div className="mx-auto my-auto text-center transition-all duration-700 transform pointer-events-auto max-w-sm px-4">

            <h1 className="text-3xl sm:text-5xl font-cursive glow-text text-pink-200 tracking-wide mb-1.5">
                Đóa Hoa Tươi Đẹp
            </h1>
            <p className="text-xs sm:text-sm text-pink-100/80 font-light max-w-xs mx-auto mb-5 leading-relaxed">
                Nhấn đi, không nổ đâu =))))
            </p>
            <button
                onClick={onStartMagic}
                className="btn-glow px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 mx-auto shadow-xl"
            >
                <span>Chạm để mở quà</span>
            </button>
        </div>
    );
};

export default IntroPrompt;