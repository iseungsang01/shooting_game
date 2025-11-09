import React, { useRef, useEffect } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../utils/constants';

export default function Canvas({ gameManager, gameState }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    const drawStartScreen = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#00ff00';
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SURVIVOR GAME', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);
      
      ctx.fillStyle = '#fff';
      ctx.font = '20px monospace';
      ctx.fillText('Press ENTER to Start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.fillText('WASD or Arrows: Move', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
      ctx.fillText('Auto Attack - Survive!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      ctx.textAlign = 'left';
    };

    const drawGameOverScreen = (time, level) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ff0000';
      ctx.font = '48px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
      
      ctx.fillStyle = '#fff';
      ctx.font = '24px monospace';
      const mins = Math.floor(time / 60);
      const secs = time % 60;
      ctx.fillText(`Survived: ${mins}:${secs.toString().padStart(2, '0')}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
      ctx.fillText(`Level: ${level}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 45);
      ctx.fillText('Press ENTER to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 90);
      ctx.textAlign = 'left';
    };

    if (gameState === 'start') {
      drawStartScreen();
    } else if (gameState === 'gameOver') {
      drawGameOverScreen(gameManager.time, gameManager.level);
    } else if (gameState === 'playing') {
      gameManager.draw(ctx);
    }
  }, [gameManager, gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ display: 'block' }}
    />
  );
}