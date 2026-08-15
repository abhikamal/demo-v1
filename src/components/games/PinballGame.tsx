import { useEffect, useRef, useState } from 'react';

export default function PinballGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scoreVal = 0;
    let isGameOver = false;
    let animationId: number;

    const gravity = 0.2;
    const friction = 0.99;
    
    let ball = {
      x: canvas.width / 2,
      y: 50,
      radius: 10,
      vx: (Math.random() - 0.5) * 4,
      vy: 0
    };

    const paddle = {
      x: canvas.width / 2 - 50,
      y: canvas.height - 40,
      width: 100,
      height: 15,
      speed: 8
    };

    const bumpers = [
      { x: 100, y: 150, radius: 25, color: '#d946ef', points: 50 },
      { x: 300, y: 150, radius: 25, color: '#d946ef', points: 50 },
      { x: 200, y: 250, radius: 35, color: '#00f0f0', points: 100 },
      { x: 100, y: 350, radius: 20, color: '#f0f000', points: 25 },
      { x: 300, y: 350, radius: 20, color: '#f0f000', points: 25 },
    ];

    let leftPressed = false;
    let rightPressed = false;

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (isGameOver) {
        ctx.fillStyle = '#0077b6';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        return;
      }

      // Physics
      ball.vy += gravity;
      ball.vx *= friction;
      ball.vy *= friction;
      
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall bounds
      if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= -0.8;
      } else if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx *= -0.8;
      }
      
      if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= -0.8;
      }

      // Bottom death
      if (ball.y > canvas.height) {
        isGameOver = true;
      }

      // Paddle move
      if (leftPressed && paddle.x > 0) paddle.x -= paddle.speed;
      if (rightPressed && paddle.x < canvas.width - paddle.width) paddle.x += paddle.speed;

      // Paddle collision
      if (ball.vy > 0 && 
          ball.y + ball.radius > paddle.y && 
          ball.y - ball.radius < paddle.y + paddle.height &&
          ball.x > paddle.x && 
          ball.x < paddle.x + paddle.width) {
        
        ball.y = paddle.y - ball.radius;
        // Bounce based on where it hit paddle (english)
        const hitPoint = (ball.x - (paddle.x + paddle.width/2)) / (paddle.width/2);
        ball.vx = hitPoint * 6;
        ball.vy = -12; // Powerful upwards bounce
      }

      // Bumpers collision
      bumpers.forEach(b => {
        const dx = ball.x - b.x;
        const dy = ball.y - b.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < ball.radius + b.radius) {
          // Collision resolution vector
          const angle = Math.atan2(dy, dx);
          
          // Repel ball strongly
          const repelForce = 12;
          ball.vx = Math.cos(angle) * repelForce;
          ball.vy = Math.sin(angle) * repelForce;
          
          // Push ball outside bumper
          ball.x = b.x + Math.cos(angle) * (ball.radius + b.radius + 1);
          ball.y = b.y + Math.sin(angle) * (ball.radius + b.radius + 1);
          
          scoreVal += b.points;
          setScore(scoreVal);
        }
        
        // Draw bumper
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI*2);
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = b.color;
        ctx.fill();
        
        // Inner detail
        ctx.fillStyle = '#050505';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius * 0.5, 0, Math.PI*2);
        ctx.fill();
      });

      // Draw paddle
      ctx.fillStyle = '#023e8a';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0077b6';
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      ctx.shadowBlur = 0;

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffffff';
      ctx.fill();
      ctx.shadowBlur = 0;

      animationId = requestAnimationFrame(draw);
    };

    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
      if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    
    draw();

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
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
        height={600} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Arrows or WASD to move paddle</p>
    </div>
  );
}
