// src/utils/audio.js
class MagicSoundEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.compressor = null;
        this.noiseBuffer = null;
        this.isMelodyLooping = false;
        this.melodyTimer = null;
        this.lastSparkleTime = 0;

        // Thang âm ngũ cung ấm áp (D Major Pentatonic)
        this.notes = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];
    }

    // Khởi tạo AudioContext cùng bộ Compressor chống méo tiếng / rè loa
    init = () => {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();

                // 1. Compressor để nén các tiếng nổ lớn, chống vỡ âm thanh
                this.compressor = this.ctx.createDynamicsCompressor();
                this.compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
                this.compressor.knee.setValueAtTime(30, this.ctx.currentTime);
                this.compressor.ratio.setValueAtTime(12, this.ctx.currentTime);
                this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
                this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

                // 2. Master Gain kiểm soát âm lượng tổng thể
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

                this.compressor.connect(this.masterGain);
                this.masterGain.connect(this.ctx.destination);

                // 3. Tạo sẵn bộ đệm tiếng ồn trắng (White Noise) cho hiệu ứng thuốc pháo
                this.createNoiseBuffer();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    };

    createNoiseBuffer = () => {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * 1.5; // 1.5 giây thuốc pháo nổ
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
    };

    /**
     * Tiếng pháo hoa nổ trầm ấm, uy lực (Không bị rè, không tiếng chói)
     */
    playBoom = (soundEnabled = true) => {
        if (!soundEnabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;

            // --- LỚP 1: SÓNG SUB-BASS TRẦM (Tiếng "BÙM" tạo độ rung) ---
            const subOsc = this.ctx.createOscillator();
            const subGain = this.ctx.createGain();

            subOsc.type = 'sine';
            // Tần số lao nhanh từ 110Hz xuống 38Hz tạo lực đẩy không khí
            subOsc.frequency.setValueAtTime(110, t);
            subOsc.frequency.exponentialRampToValueAtTime(36, t + 0.28);

            subGain.gain.setValueAtTime(0.001, t);
            subGain.gain.linearRampToValueAtTime(0.35, t + 0.02); // Anti-click attack
            subGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

            subOsc.connect(subGain);
            subGain.connect(this.compressor);

            subOsc.start(t);
            subOsc.stop(t + 0.58);

            // --- LỚP 2: TIẾNG THUỐC PHÁO TỎA RỘNG (Filtered Noise Body) ---
            if (this.noiseBuffer) {
                const noiseSource = this.ctx.createBufferSource();
                noiseSource.buffer = this.noiseBuffer;

                const noiseFilter = this.ctx.createBiquadFilter();
                noiseFilter.type = 'lowpass';
                // Cắt sạch các tần số cao gây "téc téc", chỉ giữ tiếng nổ rền vang (750Hz xuống 90Hz)
                noiseFilter.frequency.setValueAtTime(650, t);
                noiseFilter.frequency.exponentialRampToValueAtTime(80, t + 0.65);

                const noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(0.001, t);
                noiseGain.gain.linearRampToValueAtTime(0.28, t + 0.03);
                noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

                noiseSource.connect(noiseFilter);
                noiseFilter.connect(noiseGain);
                noiseGain.connect(this.compressor);

                noiseSource.start(t);
                noiseSource.stop(t + 0.72);
            }
        } catch (e) { }
    };

    /**
     * Tiếng bụi sao lấp lánh (Êm dịu, chống spam âm thanh, loại bỏ hoàn toàn tiếng chói "téc téc")
     */
    playSparkle = (soundEnabled = true) => {
        if (!soundEnabled || !this.ctx) return;

        // Throttle: Giới hạn tối thiểu 110ms giữa các lần phát để không bị đè âm khó chịu
        const now = performance.now();
        if (now - this.lastSparkleTime < 110) return;
        this.lastSparkleTime = now;

        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            // Sử dụng sóng sine mềm qua bộ lọc lowpass 2000Hz (triệt tiêu tiếng ré chói)
            osc.type = 'sine';
            const chimeFreq = 950 + Math.random() * 450;
            osc.frequency.setValueAtTime(chimeFreq, t);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, t);

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(0.045, t + 0.02); // 20ms attack khử click
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.compressor);

            osc.start(t);
            osc.stop(t + 0.38);
        } catch (e) { }
    };

    /**
     * Tiếng nốt nhạc du dương ấm áp (Music Box / Piano mềm)
     */
    playTone = (freq, duration = 1.6, volume = 0.05, soundEnabled = true) => {
        if (!soundEnabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            // Lọc dải cao để âm thanh nghe như tiếng chuông/phím đàn gỗ tròn trịa
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2200, t);

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(volume, t + 0.035);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.compressor);

            osc.start(t);
            osc.stop(t + duration + 0.05);
        } catch (e) { }
    };

    /**
     * Giai điệu nền acoustic ngũ cung tự động lặp lại êm ái
     */
    startMelody = (soundEnabled = true) => {
        if (this.isMelodyLooping) return;
        this.isMelodyLooping = true;
        let step = 0;
        const melodyPattern = [0, 2, 4, 3, 5, 4, 2, 6, 5, 3, 1, 4];

        const next = () => {
            if (!this.isMelodyLooping || !soundEnabled) return;
            const freq = this.notes[melodyPattern[step % melodyPattern.length]];
            this.playTone(freq, 1.8, 0.04, soundEnabled);
            step++;
            this.melodyTimer = setTimeout(next, step % 4 === 0 ? 820 : 420);
        };
        next();
    };

    stopMelody = () => {
        this.isMelodyLooping = false;
        if (this.melodyTimer) clearTimeout(this.melodyTimer);
    };
}

export const audio = new MagicSoundEngine();