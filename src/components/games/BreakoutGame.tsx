import { useEffect, useRef, useState } from 'react';

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let dx = 3;
    let dy = -3;
    const ballRadius = 6;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 4;
    const brickColumnCount = 6;
    const brickWidth = 75;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 35;

    let isGameOver = false;
    let animationId: number;

    const bricks: {x: number, y: number, status: number}[] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks.push({ x: 0, y: 0, status: 1 });
      }
    }

    const collisionDetection = () => {
      let bIdx = 0;
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[bIdx++];
          if (b.status === 1) {
            if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              setScore(s => s + 10);
            }
          }
        }
      }
    };

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

      // Draw bricks
      let bIdx = 0;
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[bIdx++];
          if (b.status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            b.x = brickX;
            b.y = brickY;
            ctx.fillStyle = r % 2 === 0 ? '#0077b6' : '#d946ef';
            ctx.shadowBlur = 5;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
          }
        }
      }
      ctx.shadowBlur = 0;

      // Draw paddle
      ctx.fillStyle = '#023e8a';
      ctx.fillRect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.closePath();

      collisionDetection();

      // Bounce walls
      if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) dx = -dx;
      if (ballY + dy < ballRadius) dy = -dy;
      else if (ballY + dy > canvas.height - ballRadius - paddleHeight - 10) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
          dy = -dy;
          // Add english
          dx = 4 * ((ballX - (paddleX + paddleWidth / 2)) / paddleWidth);
        } else if (ballY + dy > canvas.height - ballRadius) {
          isGameOver = true;
          setGameOver(true);
        }
      }

      if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 6;
      else if (leftPressed && paddleX > 0) paddleX -= 6;

      ballX += dx;
      ballY += dy;

      animationId = requestAnimationFrame(draw);
    };

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = true;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = true;
    };
    
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight') rightPressed = false;
      else if (e.key === 'Left' || e.key === 'ArrowLeft') leftPressed = false;
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    
    draw();

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505]">
      <div className="w-full max-w-[600px] flex justify-between items-center mb-4 px-4">
        <span className="text-white font-mono font-bold text-xl">Score: {score}</span>
        {gameOver && <span className="text-red-500 font-mono font-bold">GAME OVER</span>}
      </div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Use Left/Right Arrows to move paddle</p>
    </div>
  );
}
