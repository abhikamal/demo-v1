import { useEffect, useRef, useState } from 'react';

// 1 = wall, 0 = path
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const ROWS = MAZE.length;
const COLS = MAZE[0].length;
const SIZE = 40; // 15*40=600, 11*40=440

export default function MazeRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'win' | 'lose'>('playing');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let player = { r: 1, c: 1 };
    let enemy = { r: 9, c: 13 };
    const exit = { r: 9, c: 1 };
    
    let isGameOver = false;
    let animationId: number;
    let frameCount = 0;

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isGameOver) {
        ctx.fillStyle = gameState === 'win' ? '#d946ef' : '#0077b6';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(gameState === 'win' ? 'ESCAPED!' : 'CAUGHT!', canvas.width/2, canvas.height/2);
        return;
      }

      // Enemy logic
      if (frameCount % 15 === 0) { // Enemy speed
        // Simple random wander for prototype
        const dirs = [
          {dr: -1, dc: 0}, {dr: 1, dc: 0}, {dr: 0, dc: -1}, {dr: 0, dc: 1}
        ];
        const validDirs = dirs.filter(d => MAZE[enemy.r + d.dr][enemy.c + d.dc] === 0);
        if (validDirs.length > 0) {
          const move = validDirs[Math.floor(Math.random() * validDirs.length)];
          enemy.r += move.dr;
          enemy.c += move.dc;
        }
      }
      frameCount++;

      // Win/Lose condition
      if (player.r === exit.r && player.c === exit.c) {
        isGameOver = true;
        setGameState('win');
      } else if (player.r === enemy.r && player.c === enemy.c) {
        isGameOver = true;
        setGameState('lose');
      }

      // Draw Maze
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (MAZE[r][c] === 1) {
            ctx.fillStyle = '#023e8a';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#0077b6';
            ctx.fillRect(c * SIZE, r * SIZE, SIZE, SIZE);
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#0077b6';
            ctx.fillRect(c * SIZE + 2, r * SIZE + 2, SIZE - 4, SIZE - 4);
          }
        }
      }
      ctx.shadowBlur = 0;

      // Draw exit
      ctx.fillStyle = '#d946ef';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#d946ef';
      ctx.beginPath();
      ctx.arc(exit.c * SIZE + SIZE/2, exit.r * SIZE + SIZE/2, SIZE/3, 0, Math.PI*2);
      ctx.fill();

      // Draw enemy
      ctx.fillStyle = '#f00000';
      ctx.shadowColor = '#f00000';
      ctx.fillRect(enemy.c * SIZE + 5, enemy.r * SIZE + 5, SIZE - 10, SIZE - 10);

      // Draw player
      ctx.fillStyle = '#00f0f0';
      ctx.shadowColor = '#00f0f0';
      ctx.fillRect(player.c * SIZE + 8, player.r * SIZE + 8, SIZE - 16, SIZE - 16);
      
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      let newR = player.r;
      let newC = player.c;
      
      if (e.key === 'ArrowUp' || e.key === 'w') newR--;
      else if (e.key === 'ArrowDown' || e.key === 's') newR++;
      else if (e.key === 'ArrowLeft' || e.key === 'a') newC--;
      else if (e.key === 'ArrowRight' || e.key === 'd') newC++;
      
      if (MAZE[newR][newC] === 0) {
        player.r = newR;
        player.c = newC;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    draw();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationId);
    };
  }, [gameState]); // Add dependency if state needs to trigger re-renders, but ref holds logic

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505]">
      <div className="w-full max-w-[600px] flex justify-between items-center mb-2 px-4">
        <span className="text-white font-mono font-bold text-xl">
          {gameState === 'playing' ? 'Reach the Pink Portal' : gameState === 'win' ? 'You Escaped!' : 'You Died!'}
        </span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={440} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <p className="text-gray-500 font-mono text-sm mt-2">Arrows or WASD to navigate</p>
    </div>
  );
}
