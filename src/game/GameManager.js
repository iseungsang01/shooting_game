import Player from './Player';
import Enemy from './Enemy';
import Weapon from './Weapon';
import ExpOrb from './ExpOrb';
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT, 
  ENEMY_TYPES,
  INITIAL_PLAYER_STATS,
  INITIAL_PASSIVES
} from '../utils/constants';
import { checkCollision, getDistance } from '../utils/collision';

export default class GameManager {
  constructor() {
    this.reset();
  }

  reset() {
    this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.enemies = [];
    this.projectiles = [];
    this.expOrbs = [];
    this.weapons = [new Weapon('PISTOL')];
    
    this.stats = { ...INITIAL_PLAYER_STATS };
    this.passives = { ...INITIAL_PASSIVES };
    
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false
    };
    
    this.time = 0;
    this.level = 1;
    this.exp = 0;
    this.kills = 0;
    
    this.lastEnemySpawn = Date.now();
    this.enemySpawnRate = 1000;
    this.lastRegenTick = Date.now();
  }

  handleKeyDown(key) {
    switch(key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keys.up = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keys.down = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keys.left = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keys.right = true;
        break;
    }
  }

  handleKeyUp(key) {
    switch(key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.keys.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.keys.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.keys.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.keys.right = false;
        break;
    }
  }

  spawnEnemy() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
      case 0: // Top
        x = Math.random() * CANVAS_WIDTH;
        y = -30;
        break;
      case 1: // Right
        x = CANVAS_WIDTH + 30;
        y = Math.random() * CANVAS_HEIGHT;
        break;
      case 2: // Bottom
        x = Math.random() * CANVAS_WIDTH;
        y = CANVAS_HEIGHT + 30;
        break;
      case 3: // Left
        x = -30;
        y = Math.random() * CANVAS_HEIGHT;
        break;
    }

    // Select enemy type based on weights
    const rand = Math.random();
    let enemyType = 'NORMAL';
    let cumWeight = 0;
    
    for (const [type, config] of Object.entries(ENEMY_TYPES)) {
      cumWeight += config.weight;
      if (rand <= cumWeight) {
        enemyType = type;
        break;
      }
    }

    this.enemies.push(new Enemy(x, y, enemyType));
  }

  findNearestEnemy() {
    if (this.enemies.length === 0) return null;

    let nearest = this.enemies[0];
    let minDist = getDistance(
      this.player.x, 
      this.player.y, 
      nearest.x, 
      nearest.y
    );

    for (const enemy of this.enemies) {
      const dist = getDistance(
        this.player.x, 
        this.player.y, 
        enemy.x, 
        enemy.y
      );
      
      if (dist < minDist) {
        minDist = dist;
        nearest = enemy;
      }
    }

    return nearest;
  }

  update(deltaTime) {
    const now = Date.now();

    // Regeneration
    if (this.stats.regen > 0 && now - this.lastRegenTick >= 1000) {
      this.stats.hp = Math.min(this.stats.maxHp, this.stats.hp + this.stats.regen);
      this.lastRegenTick = now;
    }

    // Move player
    this.player.move(this.keys, this.stats.moveSpeed);

    // Spawn enemies
    const spawnRate = Math.max(200, this.enemySpawnRate - this.time * 10);
    if (now - this.lastEnemySpawn >= spawnRate) {
      this.spawnEnemy();
      this.lastEnemySpawn = now;
    }

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(this.player.x, this.player.y);
      
      // Check collision with player
      if (checkCollision(enemy.getBounds(), this.player.getBounds())) {
        this.stats.hp -= 0.5;
        if (this.stats.hp <= 0) {
          return 'gameOver';
        }
      }
    }

    // Fire weapons
    const target = this.findNearestEnemy();
    if (target) {
      for (const weapon of this.weapons) {
        if (weapon.canFire(now, this.passives.attackSpeed)) {
          const newProjectiles = weapon.fire(this.player, target, this.passives);
          this.projectiles.push(...newProjectiles);
        }
      }
    }

    // Update projectiles
    this.projectiles = this.projectiles.filter(proj => {
      proj.update(this.enemies);
      return !proj.isOutOfBounds();
    });

    // Check projectile-enemy collisions
    this.projectiles = this.projectiles.filter(proj => {
      let shouldRemove = false;
      
      this.enemies = this.enemies.filter(enemy => {
        if (checkCollision(proj.getBounds(), enemy.getBounds())) {
          const killed = enemy.takeDamage(proj.damage);
          
          if (killed) {
            this.expOrbs.push(new ExpOrb(enemy.x, enemy.y, enemy.exp));
            this.kills++;
            return false;
          }
          
          if (proj.hit()) {
            shouldRemove = true;
          }
        }
        return true;
      });
      
      return !shouldRemove;
    });

    // Update and collect exp orbs
    this.expOrbs = this.expOrbs.filter(orb => {
      const collected = orb.update(this.player.x, this.player.y, this.stats.expRange);
      if (collected) {
        this.exp += orb.value;
      }
      return !collected;
    });

    return 'playing';
  }

  draw(ctx) {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < CANVAS_WIDTH; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_WIDTH, i);
      ctx.stroke();
    }

    // Draw exp orbs
    for (const orb of this.expOrbs) {
      orb.draw(ctx);
    }

    // Draw projectiles
    for (const proj of this.projectiles) {
      proj.draw(ctx);
    }

    // Draw enemies
    for (const enemy of this.enemies) {
      enemy.draw(ctx);
    }

    // Draw player
    this.player.draw(ctx);
  }

  addWeapon(weaponType) {
    const existing = this.weapons.find(w => w.type === weaponType);
    if (existing) {
      existing.upgrade();
    } else {
      this.weapons.push(new Weapon(weaponType));
    }
  }

  upgradePassive(passiveType) {
    switch(passiveType) {
      case 'damage':
        this.passives.damage *= 1.2;
        break;
      case 'attackSpeed':
        this.passives.attackSpeed *= 1.15;
        break;
      case 'projectileCount':
        this.passives.projectileCount += 1;
        break;
      case 'health':
        this.stats.maxHp += 30;
        this.stats.hp = Math.min(this.stats.hp + 30, this.stats.maxHp);
        break;
      case 'moveSpeed':
        this.stats.moveSpeed *= 1.1;
        break;
      case 'expRange':
        this.stats.expRange *= 1.2;
        break;
      case 'regen':
        this.stats.regen += 1;
        break;
    }
  }

  getExpToLevel() {
    return this.level * 10 + 10;
  }

  checkLevelUp() {
    if (this.exp >= this.getExpToLevel()) {
      this.exp -= this.getExpToLevel();
      this.level++;
      return true;
    }
    return false;
  }
}