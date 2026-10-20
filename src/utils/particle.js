// src/utils/particle.js
export class PooledParticle {
    constructor() {
        this.active = false;
        this.x = 0;
        this.y = 0;
        this.prevX = 0;
        this.prevY = 0;
        this.vx = 0;
        this.vy = 0;
        this.color = '#fff';
        this.alpha = 1;
        this.size = 2;
        this.decay = 0.015;
        this.friction = 0.985;
        this.gravity = 0.04;
    }

    spawn = (x, y, vx, vy, color, size, decay, gravity = 0.04) => {
        this.active = true;
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.alpha = 1;
        this.size = size;
        this.decay = decay;
        this.gravity = gravity;
    };

    update = () => {
        if (!this.active) return;
        this.prevX = this.x;
        this.prevY = this.y;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        if (this.alpha <= 0) {
            this.active = false;
        }
    };

    draw = (context) => {
        if (!this.active || this.alpha <= 0) return;
        context.strokeStyle = this.color;
        context.lineWidth = this.size;
        context.globalAlpha = Math.max(0, this.alpha);
        context.beginPath();
        context.moveTo(this.prevX, this.prevY);
        context.lineTo(this.x, this.y);
        context.stroke();
    };
}