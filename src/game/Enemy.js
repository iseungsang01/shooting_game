import { ENEMY_TYPES } from '../utils/constants';
import { getNormalizedDirection } from '../utils/collision';

export default class Enemy {
  constructor(x, y, type) {
    const config = ENEMY_TYPES[type];
    
    this.x = x;
    this.y = y;
    this.type = type;
    this.width = config.size;
    this.height = config.size;
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.speed = config.speed;
    this.color = config.color;
    this.exp = config.exp;
  }

  update(playerX, playerY) {
    const direction = getNormalizedDirection(this.x, this.y, playerX, playerY);
    this.x += direction.x * this.speed;
    this.y += direction.y * this.speed;
  }

  takeDamage(damage) {
    this.hp -= damage;
    return this.hp <= 0;
  }

  draw(ctx) {
    // Enemy body
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    // Inner detail
    const innerSize = this.width - 10;
    ctx.fillStyle = this.getDarkerColor(this.color);
    ctx.fillRect(
      this.x - innerSize / 2,
      this.y - innerSize / 2,
      innerSize,
      innerSize
    );

    // HP bar background
    const barWidth = this.width;
    const barHeight = 4;
    const barY = this.y - this.height / 2 - 8;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth, barHeight);

    // HP bar foreground
    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillRect(this.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);
  }

  getDarkerColor(color) {
    // Simple color darkening
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return `rgb(${Math.floor(r * 0.7)}, ${Math.floor(g * 0.7)}, ${Math.floor(b * 0.7)})`;
  }

  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height
    };
  }
}