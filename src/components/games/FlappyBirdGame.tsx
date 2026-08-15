import { useEffect, useRef, useState } from 'react';

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isGameOver = false;
    let scoreVal = 0;
    
    // Physics
    const gravity = 0.5;
    const lift = -8;
    const velocityX = 3;
    
    let bird = { x: 100, y: canvas.height / 2, velocityY: 0, radius: 12 };
    
    // Pipes
    const pipeWidth = 50;
    const pipeGap = 130;
    let pipes: {x: number, topHeight: number, passed: boolean}[] = [];
    
    let frameCount = 0;
    let animationId: number;

    const spawnPipe = () => {
      const minHeight = 50;
      const maxHeight = canvas.height - pipeGap - 50;
      const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      pipes.push({ x: canvas.width, topHeight, passed: false });
    };

    const draw = () => {
      if (isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f0f0';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        return;
      }

      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (frameCount % 90 === 0) {
        spawnPipe();
      }
      frameCount++;

      // Bird physics
      bird.velocityY += gravity;
      bird.y += bird.velocityY;

      // Floor/Ceiling collision
      if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        isGameOver = true;
      }

      // Draw and move pipes
      ctx.fillStyle = '#023e8a';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0077b6';
      
      pipes.forEach(p => {
        p.x -= velocityX;
        
        // Top pipe
        ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
        // Bottom pipe
        ctx.fillRect(p.x, p.topHeight + pipeGap, pipeWidth, canvas.height - p.topHeight - pipeGap);

        // Collision
        if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + pipeWidth) {
          if (bird.y - bird.radius < p.topHeight || bird.y + bird.radius > p.topHeight + pipeGap) {
            isGameOver = true;
          }
        }

        // Score
        if (p.x + pipeWidth < bird.x && !p.passed) {
          scoreVal += 1;
          setScore(scoreVal);
          p.passed = true;
        }
      });
      ctx.shadowBlur = 0;

      // Filter offscreen pipes
      pipes = pipes.filter(p => p.x + pipeWidth > 0);

      // Draw Bird
      ctx.beginPath();
      ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#d946ef';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#d946ef';
      ctx.fill();
      ctx.closePath();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    const jump = () => {
      if (!isGameOver) {
        bird.velocityY = lift;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') jump();
    };

    const handleMouseClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousedown', handleMouseClick);
    
    spawnPipe();
    draw();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousedown', handleMouseClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505]">
      <div className="w-full max-w-[400px] flex justify-between items-center mb-4 px-4">
        <span className="text-white font-mono font-bold text-xl">Score: <span className="text-brand-neon">{score}</span></span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={400} 
        height={500} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)] cursor-pointer"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Spacebar or Click to jump</p>
    </div>
  );
}
