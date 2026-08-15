import { useEffect, useRef, useState } from 'react';

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 4;

    const paddleHeight = 80;
    const paddleWidth = 10;
    let playerY = (canvas.height - paddleHeight) / 2;
    let aiY = (canvas.height - paddleHeight) / 2;

    const draw = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move AI paddle
      const aiCenter = aiY + paddleHeight / 2;
      if (aiCenter < ballY - 35) aiY += 4;
      else if (aiCenter > ballY + 35) aiY -= 4;

      // Move ball
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Bounce top/bottom
      if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;

      // Bounce paddles
      if (ballX < paddleWidth) {
        if (ballY > playerY && ballY < playerY + paddleHeight) {
          ballSpeedX = -ballSpeedX;
          const deltaY = ballY - (playerY + paddleHeight / 2);
          ballSpeedY = deltaY * 0.2;
        } else {
          setAiScore(s => s + 1);
          resetBall();
        }
      }
      
      if (ballX > canvas.width - paddleWidth) {
        if (ballY > aiY && ballY < aiY + paddleHeight) {
          ballSpeedX = -ballSpeedX;
          const deltaY = ballY - (aiY + paddleHeight / 2);
          ballSpeedY = deltaY * 0.2;
        } else {
          setPlayerScore(s => s + 1);
          resetBall();
        }
      }

      // Draw paddles
      ctx.fillStyle = '#0077b6';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0077b6';
      ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
      
      ctx.fillStyle = '#d946ef';
      ctx.shadowColor = '#d946ef';
      ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

      // Draw ball
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.beginPath();
      ctx.arc(ballX, ballY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Draw net
      ctx.fillStyle = '#333';
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.fillRect(canvas.width / 2 - 1, i, 2, 20);
      }
    };

    const resetBall = () => {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = -ballSpeedX;
      ballSpeedY = 4;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      playerY = mouseY - paddleHeight / 2;
      
      // bounds
      if (playerY < 0) playerY = 0;
      if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    
    let animationId: number;
    const loop = () => {
      draw();
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505]">
      <div className="w-full max-w-[600px] flex justify-between items-center mb-4 px-8">
        <span className="text-brand-neon font-mono font-bold text-2xl">{playerScore}</span>
        <span className="text-white font-mono text-sm">YOU vs AI</span>
        <span className="text-[#d946ef] font-mono font-bold text-2xl">{aiScore}</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)] cursor-none"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Use Mouse to move paddle</p>
    </div>
  );
}
