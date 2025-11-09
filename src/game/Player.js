import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.radius = 15;
  }

  move(keys, speed) {
    const diagonal = (keys.left || keys.right) && (keys.up || keys.down);
    const adjustedSpeed = diagonal ? speed * 0.707 : speed;

    if (keys.left) this.x -= adjustedSpeed;
    if (keys.right) this.x += adjustedSpeed;
    if (keys.up) this.y -= adjustedSpeed;
    if (keys.down) this.y += adjustedSpeed;

    // Keep player within bounds
    this.x = Math.max(this.radius, Math.min(CANVAS_WIDTH - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(CANVAS_HEIGHT - this.radius, this.y));
  }

  draw(ctx) {
    // Outer circle
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner circle
    ctx.fillStyle = '#00aa00';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius - 5, 0, Math.PI * 2);
    ctx.fill();

    // Center dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  getBounds() {
    return {
      x: this.x - this.radius,
      y: this.y - this.radius,
      width: this.radius * 2,
      height: this.radius * 2
    };
  }
}