// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IntroPrompt from './components/IntroPrompt';
import GreetingCard from './components/GreetingCard';
import CustomizationModal from './components/CustomizationModal';
import Toast from './components/Toast';
import StageCanvas from './components/StageCanvas';
import { audio } from './utils/audio';
import { wishTemplates } from './constants/templates';
import './App.css';

const App = () => {
  const [stage, setStage] = useState('BLOOMING');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [cardData, setCardData] = useState({
    recipient: 'Hoàng Minh Oanh',
    sender: 'Đắc Anh - AnhSP',
    message: wishTemplates[0],
  });

  const [toast, setToast] = useState({ show: false, text: '' });

  // Nhận thông tin cá nhân hóa từ URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setCardData((prev) => ({
        recipient: params.has('to') ? decodeURIComponent(params.get('to')) : prev.recipient,
        message: params.has('msg') ? decodeURIComponent(params.get('msg')) : prev.message,
        sender: params.has('from') ? decodeURIComponent(params.get('from')) : prev.sender,
      }));
    } catch (e) { }
  }, []);

  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 3000);
  };

  const handleToggleSound = () => {
    audio.init();
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      audio.startMelody(true);
      showToast('Đã bật âm thanh');
    } else {
      audio.stopMelody();
      showToast('Đã tắt âm thanh');
    }
  };

  const handleStartMagic = () => {
    if (stage !== 'BLOOMING') return;
    audio.init();
    if (soundEnabled) audio.startMelody(true);
    audio.playSparkle(soundEnabled);
    setStage('VORTEX');
  };

  const handleReplay = () => {
    setCardVisible(false);
    setStage('BLOOMING');
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden text-pink-50 bg-[#07040d]">
      {/* Lớp Canvas đồ họa */}
      <StageCanvas
        stage={stage}
        setStage={setStage}
        soundEnabled={soundEnabled}
        onCelebrationStart={() => setTimeout(() => setCardVisible(true), 300)}
      />

      {/* Lớp giao diện người dùng */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-3.5 sm:p-6 pointer-events-none">
        <Header
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenModal={() => setModalOpen(true)}
        />

        {stage === 'BLOOMING' && <IntroPrompt onStartMagic={handleStartMagic} />}

        <GreetingCard
          visible={cardVisible}
          recipient={cardData.recipient}
          message={cardData.message}
          sender={cardData.sender}
          soundEnabled={soundEnabled}
          onReplay={handleReplay}
        />

        <footer className="w-full text-center pointer-events-auto py-1">
          <p className="text-[11px] sm:text-xs text-pink-200/65 tracking-wide">
            <span className="text-pink-300 underline underline-offset-2"></span>
          </p>
        </footer>
      </div>

      {/* Modal tùy biến thiệp & Toast */}
      <CustomizationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={cardData}
        onApply={(newData) => setCardData(newData)}
        onShowToast={showToast}
      />

      <Toast show={toast.show} text={toast.text} />
    </div>
  );
};

export default App;