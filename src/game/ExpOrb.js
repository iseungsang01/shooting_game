import { getDistance, getNormalizedDirection } from '../utils/collision';

export default class ExpOrb {
  constructor(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.size = 6 + value * 2;
    this.collected = false;
  }

  update(playerX, playerY, attractRange) {
    const dist = getDistance(this.x, this.y, playerX, playerY);

    if (dist < attractRange) {
      const direction = getNormalizedDirection(this.x, this.y, playerX, playerY);
      const speed = 5;
      this.x += direction.x * speed;
      this.y += direction.y * speed;
    }

    // Check if collected
    if (dist < 20) {
      this.collected = true;
      return true;
    }

    return false;
  }

  draw(ctx) {
    // Outer glow
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 1.5
    );
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Inner orb
    ctx.fillStyle = '#00ff88';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // Shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x - this.size / 3, this.y - this.size / 3, this.size / 3, 0, Math.PI * 2);
    ctx.fill();
  }
}