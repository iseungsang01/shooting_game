export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const GAME_STATES = {
  START: 'start',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
};

export const ENEMY_TYPES = {
  NORMAL: {
    hp: 30,
    speed: 1.5,
    size: 25,
    color: '#ff4444',
    exp: 1,
    weight: 0.7
  },
  FAST: {
    hp: 15,
    speed: 3,
    size: 20,
    color: '#ff44ff',
    exp: 2,
    weight: 0.2
  },
  TANK: {
    hp: 100,
    speed: 0.8,
    size: 40,
    color: '#4444ff',
    exp: 5,
    weight: 0.1
  }
};

export const WEAPON_TYPES = {
  PISTOL: {
    damage: 10,
    cooldown: 500,
    projectileSpeed: 6,
    color: '#ffff00'
  },
  SHOTGUN: {
    damage: 6,
    cooldown: 1000,
    projectileSpeed: 8,
    pellets: 5,
    spread: 0.15,
    color: '#ff8800'
  },
  LASER: {
    damage: 8,
    cooldown: 800,
    projectileSpeed: 10,
    pierce: 3,
    color: '#00ffff'
  },
  MISSILE: {
    damage: 15,
    cooldown: 1500,
    projectileSpeed: 4,
    homing: true,
    color: '#ff0088'
  }
};

export const SKILL_OPTIONS = [
  {
    id: 'pistol',
    name: '권총',
    desc: '기본 무기 강화 (+20% 데미지)',
    icon: '🔫',
    type: 'weapon'
  },
  {
    id: 'shotgun',
    name: '샷건',
    desc: '산탄 5발 동시 발사',
    icon: '💥',
    type: 'weapon'
  },
  {
    id: 'laser',
    name: '레이저',
    desc: '적 3명 관통',
    icon: '⚡',
    type: 'weapon'
  },
  {
    id: 'missile',
    name: '미사일',
    desc: '적 추적 고위력 미사일',
    icon: '🚀',
    type: 'weapon'
  },
  {
    id: 'damage',
    name: '공격력',
    desc: '모든 데미지 +20%',
    icon: '💪',
    type: 'passive'
  },
  {
    id: 'attackSpeed',
    name: '공격속도',
    desc: '모든 무기 공속 +15%',
    icon: '⏱️',
    type: 'passive'
  },
  {
    id: 'projectileCount',
    name: '다중 발사',
    desc: '탄환 개수 +1',
    icon: '🎯',
    type: 'passive'
  },
  {
    id: 'health',
    name: '체력',
    desc: '최대 HP +30',
    icon: '❤️',
    type: 'passive'
  },
  {
    id: 'moveSpeed',
    name: '이동속도',
    desc: '이동속도 +10%',
    icon: '👟',
    type: 'passive'
  },
  {
    id: 'expRange',
    name: '획득 범위',
    desc: '경험치 획득 범위 +20%',
    icon: '🧲',
    type: 'passive'
  },
  {
    id: 'regen',
    name: '체력 회복',
    desc: '초당 HP +1',
    icon: '💚',
    type: 'passive'
  }
];

export const INITIAL_PLAYER_STATS = {
  maxHp: 100,
  hp: 100,
  moveSpeed: 3,
  expRange: 50,
  regen: 0
};

export const INITIAL_PASSIVES = {
  damage: 1,
  attackSpeed: 1,
  projectileCount: 1,
  projectileSize: 1
};