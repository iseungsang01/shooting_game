import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export default class Projectile {
  constructor(x, y, vx, vy, config) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = config.width || 8;
    this.height = config.height || 8;
    this.damage = config.damage;
    this.color = config.color;
    this.pierce = config.pierce || 0;
    this.homing = config.homing || false;
    this.target = config.target || null;
    this.life = config.life || null;
  }

  update(enemies) {
    // Homing behavior
    if (this.homing && this.target && enemies.includes(this.target)) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > 0) {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        this.vx = (dx / dist) * speed;
        this.vy = (dy / dist) * speed;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.life !== null) {
      this.life--;
    }
  }

  isOutOfBounds() {
    if (this.life !== null && this.life <= 0) return true;
    
    return (
      this.x < -50 ||
      this.x > CANVAS_WIDTH + 50 ||
      this.y < -50 ||
      this.y > CANVAS_HEIGHT + 50
    );
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    
    // Draw as rectangle
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    // Add glow effect
    if (this.homing) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillRect(
        this.x - this.width / 2,
        this.y - this.height / 2,
        this.width,
        this.height
      );
      ctx.shadowBlur = 0;
    }
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }

  hit() {
    this.pierce--;
    return this.pierce < 0;
  }
}