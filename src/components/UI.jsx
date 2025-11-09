import React from 'react';
import { CANVAS_WIDTH } from '../utils/constants';

export default function UI({ gameManager, time }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <svg 
      width={CANVAS_WIDTH} 
      height="60" 
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      {/* Background */}
      <rect width={CANVAS_WIDTH} height="60" fill="rgba(0, 0, 0, 0.7)" />
      
      {/* Time */}
      <text x="10" y="25" fill="#fff" fontSize="18" fontFamily="monospace">
        Time: {formatTime(time)}
      </text>
      
      {/* Level */}
      <text x="10" y="50" fill="#fff" fontSize="18" fontFamily="monospace">
        Level: {gameManager.level}
      </text>
      
      {/* HP Bar */}
      <rect x="200" y="15" width="200" height="20" fill="#333" />
      <rect 
        x="200" 
        y="15" 
        width={200 * (gameManager.stats.hp / gameManager.stats.maxHp)} 
        height="20" 
        fill="#ff0000" 
      />
      <rect x="200" y="15" width="200" height="20" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="260" y="30" fill="#fff" fontSize="14" fontFamily="monospace">
        {Math.floor(gameManager.stats.hp)}/{gameManager.stats.maxHp}
      </text>
      
      {/* EXP Bar */}
      <rect x="200" y="42" width="200" height="10" fill="#333" />
      <rect 
        x="200" 
        y="42" 
        width={200 * (gameManager.exp / gameManager.getExpToLevel())} 
        height="10" 
        fill="#00ffff" 
      />
      <rect x="200" y="42" width="200" height="10" fill="none" stroke="#fff" strokeWidth="1" />
      
      {/* Kills */}
      <text x="450" y="25" fill="#fff" fontSize="18" fontFamily="monospace">
        Kills: {gameManager.kills}
      </text>
      
      {/* Weapon Count */}
      <text x="450" y="50" fill="#fff" fontSize="18" fontFamily="monospace">
        Weapons: {gameManager.weapons.length}
      </text>
    </svg>
  );
}