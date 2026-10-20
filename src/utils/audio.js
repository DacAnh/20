// src/utils/audio.js
class MagicSoundEngine {
    constructor() {
        this.ctx = null;
        this.isMelodyLooping = false;
        this.melodyTimer = null;
        this.freqs = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99, 880.00];
    }

    init = () => {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    };

    playTone = (freq, duration = 1.4, volume = 0.07, soundEnabled = true) => {
        if (!soundEnabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.linearRampToValueAtTime(volume, t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + duration + 0.05);
        } catch (e) { }
    };

    playSparkle = (soundEnabled = true) => {
        if (!soundEnabled || !this.ctx) return;
        for (let i = 0; i < 3; i++) {
            const delay = i * 45;
            const freq = 1300 + Math.random() * 1500;
            setTimeout(() => this.playTone(freq, 0.25, 0.035, soundEnabled), delay);
        }
    };

    playBoom = (soundEnabled = true) => {
        if (!soundEnabled || !this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(130, t);
            osc.frequency.exponentialRampToValueAtTime(32, t + 0.38);

            gain.gain.setValueAtTime(0.18, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(t);
            osc.stop(t + 0.45);
        } catch (e) { }
    };

    startMelody = (soundEnabled = true) => {
        if (this.isMelodyLooping) return;
        this.isMelodyLooping = true;
        let step = 0;
        const seq = [0, 2, 4, 3, 5, 4, 2, 6, 5, 3, 1, 4];

        const next = () => {
            if (!this.isMelodyLooping || !soundEnabled) return;
            const freq = this.freqs[seq[step % seq.length]];
            this.playTone(freq, 1.8, 0.05, soundEnabled);
            step++;
            this.melodyTimer = setTimeout(next, step % 4 === 0 ? 680 : 380);
        };
        next();
    };

    stopMelody = () => {
        this.isMelodyLooping = false;
        if (this.melodyTimer) clearTimeout(this.melodyTimer);
    };
}

export const audio = new MagicSoundEngine();