import { WEAPON_TYPES } from '../utils/constants';
import Projectile from './Projectile';

export default class Weapon {
  constructor(type) {
    this.type = type;
    this.level = 1;
    this.lastFire = 0;
    
    const config = WEAPON_TYPES[type];
    this.baseDamage = config.damage;
    this.cooldown = config.cooldown;
    this.config = config;
  }

  upgrade() {
    this.level++;
    this.baseDamage *= 1.2;
  }

  canFire(currentTime, attackSpeedMultiplier) {
    const adjustedCooldown = this.cooldown / attackSpeedMultiplier;
    return currentTime - this.lastFire >= adjustedCooldown;
  }

  fire(player, target, passives) {
    this.lastFire = Date.now();
    const projectiles = [];
    const damage = this.baseDamage * passives.damage;

    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const angle = Math.atan2(dy, dx);

    const projectileCount = passives.projectileCount;
    const spreadAngle = 0.2;

    switch (this.type) {
      case 'PISTOL':
        for (let i = 0; i < projectileCount; i++) {
          const offset = (i - (projectileCount - 1) / 2) * spreadAngle;
          const finalAngle = angle + offset;
          
          const vx = Math.cos(finalAngle) * this.config.projectileSpeed;
          const vy = Math.sin(finalAngle) * this.config.projectileSpeed;

          projectiles.push(new Projectile(player.x, player.y, vx, vy, {
            width: 8 * passives.projectileSize,
            height: 8 * passives.projectileSize,
            damage,
            color: this.config.color,
            pierce: 0
          }));
        }
        break;

      case 'SHOTGUN':
        for (let i = 0; i < projectileCount; i++) {
          const baseOffset = (i - (projectileCount - 1) / 2) * spreadAngle;
          
          for (let j = 0; j < this.config.pellets; j++) {
            const spread = (j - 2) * this.config.spread;
            const finalAngle = angle + baseOffset + spread;
            
            const vx = Math.cos(finalAngle) * this.config.projectileSpeed;
            const vy = Math.sin(finalAngle) * this.config.projectileSpeed;

            projectiles.push(new Projectile(player.x, player.y, vx, vy, {
              width: 6,
              height: 6,
              damage: damage * 0.6,
              color: this.config.color,
              pierce: 0,
              life: 30
            }));
          }
        }
        break;

      case 'LASER':
        for (let i = 0; i < projectileCount; i++) {
          const offset = (i - (projectileCount - 1) / 2) * spreadAngle;
          const finalAngle = angle + offset;
          
          const vx = Math.cos(finalAngle) * this.config.projectileSpeed;
          const vy = Math.sin(finalAngle) * this.config.projectileSpeed;

          projectiles.push(new Projectile(player.x, player.y, vx, vy, {
            width: 6,
            height: 20,
            damage: damage * 0.8,
            color: this.config.color,
            pierce: this.config.pierce
          }));
        }
        break;

      case 'MISSILE':
        for (let i = 0; i < projectileCount; i++) {
          const offset = (i - (projectileCount - 1) / 2) * spreadAngle;
          const finalAngle = angle + offset;
          
          const vx = Math.cos(finalAngle) * this.config.projectileSpeed;
          const vy = Math.sin(finalAngle) * this.config.projectileSpeed;

          projectiles.push(new Projectile(player.x, player.y, vx, vy, {
            width: 10,
            height: 10,
            damage: damage * 1.5,
            color: this.config.color,
            pierce: 0,
            homing: true,
            target
          }));
        }
        break;
    }

    return projectiles;
  }
}