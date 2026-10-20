// src/components/Toast.jsx
import React from 'react';

const Toast = ({ show, text }) => {
    return (
        <div
            className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-opacity duration-300 px-4 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-700 text-white text-xs font-medium shadow-2xl border border-pink-300/50 text-center whitespace-nowrap ${show ? 'opacity-100' : 'opacity-0'
                }`}
        >
            {text}
        </div>
    );
};

export default Toast;