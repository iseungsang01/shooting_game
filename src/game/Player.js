import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export default class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 60;
    this.radius = 25;
    this.walkCycle = 0;
  }

  move(keys, speed) {
    const diagonal = (keys.left || keys.right) && (keys.up || keys.down);
    const adjustedSpeed = diagonal ? speed * 0.707 : speed;

    if (keys.left) this.x -= adjustedSpeed;
    if (keys.right) this.x += adjustedSpeed;
    if (keys.up) this.y -= adjustedSpeed;
    if (keys.down) this.y += adjustedSpeed;

    // Walking animation
    if (keys.left || keys.right || keys.up || keys.down) {
      this.walkCycle += 0.2;
    }

    this.x = Math.max(this.radius, Math.min(CANVAS_WIDTH - this.radius, this.x));
    this.y = Math.max(this.radius + 20, Math.min(CANVAS_HEIGHT - this.radius, this.y));
  }

  draw(ctx) {
    const bounce = Math.sin(this.walkCycle) * 3;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 35, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (red suit)
    ctx.fillStyle = '#dc143c';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + bounce, 22, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belt
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(this.x - 22, this.y + 5 + bounce, 44, 8);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(this.x - 6, this.y + 5 + bounce, 12, 8);

    // Arms
    ctx.fillStyle = '#dc143c';
    // Left arm
    ctx.beginPath();
    ctx.ellipse(this.x - 20, this.y - 5 + bounce, 8, 18, -0.3, 0, Math.PI * 2);
    ctx.fill();
    // Right arm
    ctx.beginPath();
    ctx.ellipse(this.x + 20, this.y - 5 + bounce, 8, 18, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // Hands
    ctx.fillStyle = '#ffd7a3';
    ctx.beginPath();
    ctx.arc(this.x - 24, this.y + 8 + bounce, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 24, this.y + 8 + bounce, 6, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#ffd7a3';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 20 + bounce, 16, 0, Math.PI * 2);
    ctx.fill();

    // Hat
    ctx.fillStyle = '#dc143c';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 28 + bounce, 18, 8, 0, 0, Math.PI);
    ctx.fill();
    ctx.fillRect(this.x - 12, this.y - 36 + bounce, 24, 16);
    // Hat pom-pom
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 38 + bounce, 6, 0, Math.PI * 2);
    ctx.fill();
    // Hat trim
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(this.x - 18, this.y - 28 + bounce, 36, 4);

    // Beard
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y - 12 + bounce, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#2c2c2c';
    ctx.beginPath();
    ctx.arc(this.x - 6, this.y - 22 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 6, this.y - 22 + bounce, 2, 0, Math.PI * 2);
    ctx.fill();

    // Rosy cheeks
    ctx.fillStyle = 'rgba(255, 105, 180, 0.4)';
    ctx.beginPath();
    ctx.arc(this.x - 12, this.y - 18 + bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x + 12, this.y - 18 + bounce, 5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(this.x, this.y - 20 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#dc143c';
    ctx.fillRect(this.x - 12, this.y + 25 + bounce, 10, 12);
    ctx.fillRect(this.x + 2, this.y + 25 + bounce, 10, 12);

    // Boots
    ctx.fillStyle = '#2c2c2c';
    ctx.fillRect(this.x - 14, this.y + 35 + bounce, 12, 8);
    ctx.fillRect(this.x + 2, this.y + 35 + bounce, 12, 8);
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