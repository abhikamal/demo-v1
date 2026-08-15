import { useEffect, useRef, useState } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 1;
    let dy = 0;
    const inputQueue: {x: number, y: number}[] = [];
    
    let gameLoop: number;
    let isGameOver = false;

    const tileSize = 20;
    const tileCount = canvas.width / tileSize;

    const draw = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isGameOver) {
        ctx.fillStyle = '#0077b6';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        return;
      }

      // Process input queue
      if (inputQueue.length > 0) {
        const input = inputQueue.shift();
        if (input) {
          dx = input.x;
          dy = input.y;
        }
      }

      // Move snake
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      snake.unshift(head);

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        isGameOver = true;
        setGameOver(true);
      }

      // Self collision
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          isGameOver = true;
          setGameOver(true);
        }
      }

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < tileCount; i++) {
        ctx.beginPath(); ctx.moveTo(i * tileSize, 0); ctx.lineTo(i * tileSize, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(canvas.width, i * tileSize); ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#d946ef'; // Neon pink accent
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#d946ef';
      ctx.fillRect(food.x * tileSize + 1, food.y * tileSize + 1, tileSize - 2, tileSize - 2);
      ctx.shadowBlur = 0;

      // Draw snake
      snake.forEach((part, i) => {
        if (i === 0) ctx.fillStyle = '#023e8a'; // darker head
        else ctx.fillStyle = '#0077b6';
        ctx.shadowBlur = i === 0 ? 10 : 0;
        ctx.shadowColor = '#0077b6';
        ctx.fillRect(part.x * tileSize + 1, part.y * tileSize + 1, tileSize - 2, tileSize - 2);
      });
      ctx.shadowBlur = 0;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Get the last queued direction, or current direction if queue empty
      const lastDir = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : {x: dx, y: dy};
      
      if ((e.key === 'ArrowUp' || e.key === 'w') && lastDir.y !== 1) inputQueue.push({x: 0, y: -1});
      else if ((e.key === 'ArrowDown' || e.key === 's') && lastDir.y !== -1) inputQueue.push({x: 0, y: 1});
      else if ((e.key === 'ArrowLeft' || e.key === 'a') && lastDir.x !== 1) inputQueue.push({x: -1, y: 0});
      else if ((e.key === 'ArrowRight' || e.key === 'd') && lastDir.x !== -1) inputQueue.push({x: 1, y: 0});
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Start loop
    gameLoop = window.setInterval(draw, 100);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(gameLoop);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505]">
      <div className="w-full max-w-[400px] flex justify-between items-center mb-4 px-4">
        <span className="text-white font-mono font-bold text-xl">Score: <span className="text-brand-neon">{score}</span></span>
        {gameOver && <span className="text-red-500 font-mono font-bold">GAME OVER</span>}
      </div>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Use Arrow Keys or WASD to move</p>
    </div>
  );
}
