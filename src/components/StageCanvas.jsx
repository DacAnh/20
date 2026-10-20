// src/components/StageCanvas.jsx
import React, { useEffect, useRef } from 'react';
import { audio } from '../utils/audio';
import { PooledParticle } from '../utils/particle';

const StageCanvas = ({
    stage,
    setStage,
    soundEnabled,
    onCelebrationStart,
}) => {
    const canvasRef = useRef(null);

    const stateRef = useRef({
        stage: 'BLOOMING',
        soundEnabled: false,
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: 1,
        flowerBloomProgress: 0,
        rocket: { x: 0, y: 0, targetY: 0, vy: 0, active: false },
        particlePool: [],
        stars: [],
        petals: [],
        vortexParticles: [],
        lastAmbientTime: 0,
        lastTouchDrag: 0,
    });

    useEffect(() => {
        stateRef.current.stage = stage;
    }, [stage]);

    useEffect(() => {
        stateRef.current.soundEnabled = soundEnabled;
    }, [soundEnabled]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        const s = stateRef.current;
        const isMobile = window.innerWidth < 768;

        const MAX_PARTICLES = isMobile ? 650 : 1200;
        s.particlePool = Array.from({ length: MAX_PARTICLES }, () => new PooledParticle());

        const handleResize = () => {
            s.width = window.innerWidth;
            s.height = window.innerHeight;
            s.dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 1.75);

            canvas.width = Math.floor(s.width * s.dpr);
            canvas.height = Math.floor(s.height * s.dpr);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(s.dpr, s.dpr);

            const STAR_COUNT = isMobile ? 60 : 120;
            s.stars = Array.from({ length: STAR_COUNT }, () => ({
                x: Math.random() * s.width,
                y: Math.random() * s.height,
                radius: Math.random() * 1.3 + 0.4,
                alpha: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2,
            }));
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const PETAL_COUNT = isMobile ? 12 : 24;
        s.petals = Array.from({ length: PETAL_COUNT }, () => ({
            x: Math.random() * s.width,
            y: Math.random() * s.height,
            size: Math.random() * 8 + 6,
            vy: Math.random() * 0.6 + 0.35,
            vx: Math.random() * 0.4 - 0.2,
            angle: Math.random() * Math.PI * 2,
            angleV: (Math.random() - 0.5) * 0.02,
            wobble: Math.random() * Math.PI * 2,
            color: Math.random() > 0.4 ? 'rgba(255, 120, 160, 0.4)' : 'rgba(255, 180, 200, 0.35)',
        }));

        const getPooledParticle = () => {
            for (let i = 0; i < MAX_PARTICLES; i++) {
                if (!s.particlePool[i].active) return s.particlePool[i];
            }
            return null;
        };

        const spawnHeartFirework = (originX, originY, baseColor = '#ff2a70') => {
            audio.playBoom(s.soundEnabled);
            audio.playSparkle(s.soundEnabled);
            const count = isMobile ? 75 : 140;
            const colors = [baseColor, '#ff6384', '#ffd1dc', '#fff', '#ffd700'];

            for (let i = 0; i < count; i++) {
                const p = getPooledParticle();
                if (!p) break;
                const t = (i / count) * Math.PI * 2;
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                const speed = (isMobile ? 0.22 : 0.28) + Math.random() * 0.04;
                const vx = hx * speed;
                const vy = hy * speed;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = (isMobile ? 2.2 : 2.6) + Math.random();
                const decay = 0.012 + Math.random() * 0.006;
                p.spawn(originX, originY, vx, vy, color, size, decay, 0.035);
            }
        };

        const spawnFloralFirework = (originX, originY, baseColor = '#e040fb') => {
            audio.playBoom(s.soundEnabled);
            const count = isMobile ? 65 : 120;
            const colors = [baseColor, '#ff80ab', '#ffffff', '#ffd54f', '#00e5ff'];

            for (let i = 0; i < count; i++) {
                const p = getPooledParticle();
                if (!p) break;
                const angle = Math.random() * Math.PI * 2;
                const speed = (isMobile ? 3.5 : 5.0) * (0.3 + 0.7 * Math.random());
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = 2.0 + Math.random();
                const decay = 0.014 + Math.random() * 0.006;
                p.spawn(originX, originY, vx, vy, color, size, decay, 0.04);
            }
        };

        const spawnStardustTwinkle = (originX, originY) => {
            audio.playSparkle(s.soundEnabled);
            const count = isMobile ? 35 : 65;
            for (let i = 0; i < count; i++) {
                const p = getPooledParticle();
                if (!p) break;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 1;
                const vx = Math.cos(angle) * speed;
                const vy = Math.sin(angle) * speed - 1.2;
                const color = Math.random() > 0.3 ? '#fff9c4' : '#ff80ab';
                p.spawn(originX, originY, vx, vy, color, 1.8, 0.02, 0.045);
            }
        };

        const triggerRandomFirework = (x, y) => {
            const types = ['heart', 'floral', 'twinkle'];
            const chosen = types[Math.floor(Math.random() * types.length)];
            const colors = ['#ff2a70', '#e040fb', '#f50057', '#00e5ff', '#ff9100', '#ffd700'];
            const randCol = colors[Math.floor(Math.random() * colors.length)];
            if (chosen === 'heart') spawnHeartFirework(x, y, randCol);
            else if (chosen === 'floral') spawnFloralFirework(x, y, randCol);
            else spawnStardustTwinkle(x, y);
        };

        const renderSinglePetal = (cx, cy, length, width, angle, c1, c2, progress) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);

            const curL = length * progress;
            const curW = width * progress;

            const grad = ctx.createLinearGradient(0, 0, 0, -curL);
            grad.addColorStop(0, c1);
            grad.addColorStop(1, c2);

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-curW * 0.8, -curL * 0.4, -curW * 0.9, -curL * 0.85, 0, -curL);
            ctx.bezierCurveTo(curW * 0.9, -curL * 0.85, curW * 0.8, -curL * 0.4, 0, 0);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(255, 230, 240, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(0, -curL * 0.5, 0, -curL * 0.88);
            ctx.stroke();

            ctx.restore();
        };

        const renderMagicRose = (cx, cy, bloom) => {
            if (bloom <= 0.01) return;

            const layers = [
                { petals: 5, length: 110, width: 58, c1: '#7b003a', c2: '#ff2a70', delay: 0.35 },
                { petals: 6, length: 85, width: 48, c1: '#9b0849', c2: '#ff5e98', delay: 0.22 },
                { petals: 5, length: 62, width: 38, c1: '#c2185b', c2: '#ff88b6', delay: 0.1 },
                { petals: 4, length: 40, width: 28, c1: '#d81b60', c2: '#ffb3cf', delay: 0.0 },
            ];

            const time = Date.now() * 0.0008;

            for (let l = 0; l < layers.length; l++) {
                const layer = layers[l];
                const layerBloom = Math.max(0, Math.min(1, (bloom - layer.delay) / (1 - layer.delay)));
                if (layerBloom <= 0) continue;

                const step = (Math.PI * 2) / layer.petals;
                const offset = l * 0.38 + Math.sin(time) * 0.04;

                for (let i = 0; i < layer.petals; i++) {
                    const angle = i * step + offset;
                    renderSinglePetal(cx, cy, layer.length, layer.width, angle, layer.c1, layer.c2, layerBloom);
                }
            }

            const coreRadius = 14 * Math.min(1, bloom * 1.4);
            const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.2);
            coreGrad.addColorStop(0, '#fffde7');
            coreGrad.addColorStop(0.4, '#ffd54f');
            coreGrad.addColorStop(1, 'rgba(255, 112, 67, 0)');

            ctx.beginPath();
            ctx.arc(cx, cy, coreRadius * 2.2, 0, Math.PI * 2);
            ctx.fillStyle = coreGrad;
            ctx.fill();
        };

        const updateAndRenderVortex = (cx, cy) => {
            let remaining = 0;
            for (let i = 0; i < s.vortexParticles.length; i++) {
                const vp = s.vortexParticles[i];
                vp.dist -= isMobile ? 2.6 : 3.0;
                vp.angle += vp.speed;

                if (vp.dist > 4) {
                    remaining++;
                    const px = cx + Math.cos(vp.angle) * vp.dist;
                    const py = cy + Math.sin(vp.angle) * vp.dist;
                    ctx.fillStyle = vp.color;
                    ctx.fillRect(px, py, vp.radius, vp.radius);
                }
            }
            return remaining;
        };

        let animId;
        const animate = (timestamp) => {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(7, 4, 13, 0.28)';
            ctx.fillRect(0, 0, s.width, s.height);

            ctx.fillStyle = '#ffffff';
            for (let i = 0; i < s.stars.length; i++) {
                const star = s.stars[i];
                star.phase += star.twinkleSpeed;
                const a = star.alpha * (0.6 + 0.4 * Math.sin(star.phase));
                ctx.globalAlpha = a;
                ctx.fillRect(star.x, star.y, star.radius, star.radius);
            }
            ctx.globalAlpha = 1;

            for (let i = 0; i < s.petals.length; i++) {
                const p = s.petals[i];
                p.y += p.vy;
                p.wobble += 0.02;
                p.x += Math.sin(p.wobble) * 0.5 + p.vx;
                p.angle += p.angleV;

                if (p.y > s.height + 20) {
                    p.y = -20;
                    p.x = Math.random() * s.width;
                }

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-p.size, -p.size * 0.6, -p.size * 0.5, p.size, 0, p.size * 1.1);
                ctx.bezierCurveTo(p.size * 0.5, p.size, p.size, -p.size * 0.6, 0, 0);
                ctx.fill();
                ctx.restore();
            }

            const flowerX = s.width / 2;
            const flowerY = s.height * (s.stage === 'BLOOMING' ? 0.45 : 0.40);

            if (s.stage === 'BLOOMING') {
                if (s.flowerBloomProgress < 1) {
                    s.flowerBloomProgress += 0.007;
                }
                renderMagicRose(flowerX, flowerY, s.flowerBloomProgress);
            } else if (s.stage === 'VORTEX') {
                s.flowerBloomProgress = Math.max(0, s.flowerBloomProgress - 0.03);
                renderMagicRose(flowerX, flowerY, s.flowerBloomProgress);

                ctx.globalCompositeOperation = 'lighter';
                const activeSparks = updateAndRenderVortex(flowerX, flowerY);

                if (s.flowerBloomProgress <= 0.03 && activeSparks < 10) {
                    s.stage = 'ROCKET_ASCENT';
                    setStage('ROCKET_ASCENT');
                    s.rocket.x = flowerX;
                    s.rocket.y = flowerY;
                    s.rocket.targetY = s.height * (isMobile ? 0.26 : 0.22);
                    s.rocket.vy = -7.5;
                    s.rocket.active = true;
                    audio.playSparkle(s.soundEnabled);
                }
            } else if (s.stage === 'ROCKET_ASCENT') {
                ctx.globalCompositeOperation = 'lighter';
                const r = s.rocket;
                r.y += r.vy;
                r.vy *= 0.985;

                const p1 = getPooledParticle();
                if (p1) p1.spawn(r.x, r.y, (Math.random() - 0.5) * 2, Math.random() * 2 + 1, '#ffd700', 2.8, 0.03, 0.01);
                const p2 = getPooledParticle();
                if (p2) p2.spawn(r.x, r.y, (Math.random() - 0.5) * 2, Math.random() * 2 + 1, '#ff69b4', 2.4, 0.03, 0.01);

                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(r.x, r.y, 4, 0, Math.PI * 2);
                ctx.fill();

                if (r.y <= r.targetY || r.vy > -1.5) {
                    s.stage = 'CELEBRATION';
                    setStage('CELEBRATION');
                    r.active = false;

                    spawnHeartFirework(r.x, r.y, '#ff2a70');
                    setTimeout(() => spawnFloralFirework(r.x - (isMobile ? 70 : 130), r.y - 30, '#f06292'), 180);
                    setTimeout(() => spawnFloralFirework(r.x + (isMobile ? 70 : 130), r.y - 30, '#ba68c8'), 320);
                    setTimeout(() => spawnHeartFirework(r.x, r.y - 50, '#ffd700'), 500);

                    onCelebrationStart();
                }
            } else if (s.stage === 'CELEBRATION') {
                if (timestamp - s.lastAmbientTime > 2600) {
                    s.lastAmbientTime = timestamp;
                    const rx = Math.random() * (s.width * 0.7) + s.width * 0.15;
                    const ry = Math.random() * (s.height * 0.35) + s.height * 0.1;
                    triggerRandomFirework(rx, ry);
                }
            }

            ctx.globalCompositeOperation = 'lighter';
            for (let i = 0; i < MAX_PARTICLES; i++) {
                const p = s.particlePool[i];
                if (p.active) {
                    p.update();
                    p.draw(ctx);
                }
            }

            animId = requestAnimationFrame(animate);
        };

        animId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handlePointerDown = (e) => {
        audio.init();
        const s = stateRef.current;
        if (s.stage === 'BLOOMING') {
            if (s.flowerBloomProgress < 0.95) {
                s.flowerBloomProgress = Math.min(1, s.flowerBloomProgress + 0.25);
                audio.playSparkle(s.soundEnabled);
            }
        } else if (s.stage === 'CELEBRATION') {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const types = ['heart', 'floral'];
            const chosen = types[Math.floor(Math.random() * types.length)];
            if (chosen === 'heart') {
                audio.playBoom(s.soundEnabled);
                audio.playSparkle(s.soundEnabled);
                const count = 75;
                const colors = ['#ff2a70', '#ff6384', '#ffd1dc', '#fff', '#ffd700'];
                for (let i = 0; i < count; i++) {
                    const p = s.particlePool.find((item) => !item.active);
                    if (!p) break;
                    const t = (i / count) * Math.PI * 2;
                    const hx = 16 * Math.pow(Math.sin(t), 3);
                    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                    p.spawn(x, y, hx * 0.24, hy * 0.24, colors[i % colors.length], 2.4, 0.015, 0.035);
                }
            } else {
                audio.playBoom(s.soundEnabled);
                const colors = ['#e040fb', '#ff80ab', '#ffffff', '#ffd54f', '#00e5ff'];
                for (let i = 0; i < 70; i++) {
                    const p = s.particlePool.find((item) => !item.active);
                    if (!p) break;
                    const angle = Math.random() * Math.PI * 2;
                    const spd = 3.8 * (0.3 + 0.7 * Math.random());
                    p.spawn(x, y, Math.cos(angle) * spd, Math.sin(angle) * spd, colors[i % colors.length], 2.2, 0.015, 0.04);
                }
            }
        }
    };

    const handleTouchMove = (e) => {
        const now = performance.now();
        const s = stateRef.current;
        if (now - s.lastTouchDrag > 35 && e.touches.length > 0) {
            s.lastTouchDrag = now;
            const touch = e.touches[0];
            const p = s.particlePool.find((item) => !item.active);
            if (p) {
                p.spawn(
                    touch.clientX,
                    touch.clientY,
                    (Math.random() - 0.5) * 1.5,
                    (Math.random() - 0.5) * 1.5,
                    '#ffd700',
                    1.8,
                    0.035,
                    0.01
                );
            }
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full z-0 block cursor-pointer"
            onPointerDown={handlePointerDown}
            onTouchMove={handleTouchMove}
        />
    );
};

export default StageCanvas;