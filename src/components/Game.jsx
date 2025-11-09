import React, { useState, useEffect, useRef } from 'react';
import GameManager from '../game/GameManager';
import Canvas from './Canvas';
import UI from './UI';
import LevelUpModal from './LevelUpModal';
import { GAME_STATES } from '../utils/constants';

export default function Game() {
  const [gameState, setGameState] = useState(GAME_STATES.START);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [time, setTime] = useState(0);
  const [, forceUpdate] = useState({});

  const gameManagerRef = useRef(new GameManager());
  const animationRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const gameManager = gameManagerRef.current;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (gameState === GAME_STATES.START || gameState === GAME_STATES.GAME_OVER) {
          startGame();
        }
        return;
      }

      if (gameState === GAME_STATES.PLAYING && !showLevelUp) {
        gameManager.handleKeyDown(e.key);
      }
    };

    const handleKeyUp = (e) => {
      if (gameState === GAME_STATES.PLAYING) {
        gameManager.handleKeyUp(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, showLevelUp]);

  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING && !showLevelUp) {
      const gameManager = gameManagerRef.current;
      let lastTime = Date.now();

      const gameLoop = () => {
        const now = Date.now();
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;

        const result = gameManager.update(deltaTime);
        
        if (result === 'gameOver') {
          setGameState(GAME_STATES.GAME_OVER);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return;
        }

        // Check for level up
        if (gameManager.checkLevelUp()) {
          setShowLevelUp(true);
        }

        forceUpdate({});
        animationRef.current = requestAnimationFrame(gameLoop);
      };

      animationRef.current = requestAnimationFrame(gameLoop);

      // Timer
      timerRef.current = setInterval(() => {
        gameManager.time++;
        setTime(gameManager.time);
      }, 1000);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [gameState, showLevelUp]);

  const startGame = () => {
    gameManagerRef.current.reset();
    setTime(0);
    setShowLevelUp(false);
    setGameState(GAME_STATES.PLAYING);
  };

  const handleSelectSkill = (skillId) => {
    const gameManager = gameManagerRef.current;
    
    // Check if it's a weapon or passive
    if (['pistol', 'shotgun', 'laser', 'missile'].includes(skillId)) {
      gameManager.addWeapon(skillId.toUpperCase());
    } else {
      gameManager.upgradePassive(skillId);
    }

    setShowLevelUp(false);
  };

  return (
    <div className="canvas-wrapper">
      <Canvas 
        gameManager={gameManagerRef.current} 
        gameState={gameState}
      />
      
      {gameState === GAME_STATES.PLAYING && (
        <UI 
          gameManager={gameManagerRef.current} 
          time={time}
        />
      )}
      
      {showLevelUp && (
        <LevelUpModal onSelectSkill={handleSelectSkill} />
      )}
    </div>
  );
}