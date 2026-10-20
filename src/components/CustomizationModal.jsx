// src/components/CustomizationModal.jsx
import React, { useState } from 'react';
import { wishTemplates } from '../constants/templates';

const CustomizationModal = ({
    isOpen,
    onClose,
    initialData,
    onApply,
    onShowToast,
}) => {
    const [rec, setRec] = useState(initialData.recipient);
    const [msg, setMsg] = useState(initialData.message);
    const [send, setSend] = useState(initialData.sender);
    const [notice, setNotice] = useState('');

    if (!isOpen) return null;

    const handleApply = () => {
        onApply({
            recipient: rec.trim() || 'Bạn Nữ Đáng Yêu',
            message: msg.trim() || wishTemplates[0],
            sender: send.trim() || 'Người bạn chân thành ✨',
        });
        onClose();
        onShowToast('Đã cập nhật thiệp thành công! 💖');
    };

    const handleCopy = () => {
        const to = encodeURIComponent(rec.trim() || initialData.recipient);
        const m = encodeURIComponent(msg.trim() || initialData.message);
        const from = encodeURIComponent(send.trim() || initialData.sender);
        const shareUrl = `${window.location.origin}${window.location.pathname}?to=${to}&msg=${m}&from=${from}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            setNotice('✓ Đã sao chép liên kết cá nhân hóa!');
            onShowToast('Đã sao chép link! Dán gửi Messenger/Zalo ngay nhé.');
        }).catch(() => {
            setNotice('Không thể tự sao chép, vui lòng thử lại!');
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/75 backdrop-blur-md transition-opacity duration-300 pointer-events-auto">
            <div className="glass-card max-w-md w-full rounded-2xl p-5 sm:p-6 border border-pink-400/40 text-pink-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-serif-title font-bold text-pink-200 flex items-center space-x-1.5">
                        <span>🎁 Tạo Thiệp Gửi Riêng Bạn Nữ</span>
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-pink-300 hover:text-white p-1 text-2xl leading-none"
                    >
                        &times;
                    </button>
                </div>

                <div className="space-y-3.5 text-xs sm:text-sm">
                    <div>
                        <label className="block text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1">
                            Tên bạn nữ (Người nhận):
                        </label>
                        <input
                            type="text"
                            maxLength={40}
                            value={rec}
                            onChange={(e) => setRec(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-pink-500/30 text-pink-50 placeholder-pink-400/40 focus:outline-none focus:border-pink-400 text-xs sm:text-sm"
                            placeholder="Ví dụ: Lan Anh, Ngọc Ánh, Mai Phương..."
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1">
                            Lời chúc 20/10 gửi trao:
                        </label>
                        <textarea
                            rows={3}
                            maxLength={280}
                            value={msg}
                            onChange={(e) => setMsg(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-pink-500/30 text-pink-50 placeholder-pink-400/40 focus:outline-none focus:border-pink-400 resize-none text-xs sm:text-sm"
                            placeholder="Nhập lời chúc ý nghĩa..."
                        />

                        {/* Quick templates */}
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            <span className="text-[10px] text-pink-300/70 self-center">Chọn nhanh:</span>
                            <button
                                type="button"
                                onClick={() => setMsg(wishTemplates[0])}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-pink-900/40 border border-pink-500/20 hover:bg-pink-700/40 transition"
                            >
                                Dễ thương & Rực rỡ
                            </button>
                            <button
                                type="button"
                                onClick={() => setMsg(wishTemplates[1])}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-pink-900/40 border border-pink-500/20 hover:bg-pink-700/40 transition"
                            >
                                Hạnh phúc & An yên
                            </button>
                            <button
                                type="button"
                                onClick={() => setMsg(wishTemplates[2])}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-pink-900/40 border border-pink-500/20 hover:bg-pink-700/40 transition"
                            >
                                Tự tin & Thành công
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[11px] uppercase tracking-wider text-pink-300 font-semibold mb-1">
                            Tên của bạn (Người gửi):
                        </label>
                        <input
                            type="text"
                            maxLength={40}
                            value={send}
                            onChange={(e) => setSend(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-pink-500/30 text-pink-50 placeholder-pink-400/40 focus:outline-none focus:border-pink-400 text-xs sm:text-sm"
                            placeholder="Ví dụ: Một người bạn giấu tên / Tuấn Anh"
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                    <button
                        onClick={handleApply}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition"
                    >
                        Áp Dụng Xem Ngay
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex-1 py-2 rounded-xl bg-pink-950/80 border border-pink-400/40 font-semibold text-pink-200 text-xs sm:text-sm hover:bg-pink-900 active:scale-95 transition flex items-center justify-center space-x-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Sao Chép Link Gửi Bạn</span>
                    </button>
                </div>

                <p className="text-[11px] text-center text-pink-300/80 mt-2.5 h-4">
                    {notice}
                </p>
            </div>
        </div>
    );
};

export default CustomizationModal;