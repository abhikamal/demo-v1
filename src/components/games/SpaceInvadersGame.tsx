import { useEffect, useRef, useState } from 'react';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  alive: boolean;
}

export default function SpaceInvadersGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scoreVal = 0;
    const player = { x: canvas.width / 2 - 20, y: canvas.height - 40, width: 40, height: 20 };
    let bullets: {x: number, y: number}[] = [];
    let enemies: Entity[] = [];
    
    // Init enemies (5 rows, 10 cols)
    const initEnemies = () => {
      enemies = [];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 10; col++) {
          enemies.push({ 
            x: 50 + col * 45, 
            y: 40 + row * 35, 
            width: 30, 
            height: 20, 
            alive: true 
          });
        }
      }
    };
    initEnemies();

    let enemyDir = 1;
    let enemySpeed = 1.5;
    let rightPressed = false;
    let leftPressed = false;
    let isGameOver = false;
    let isWin = false;
    let animationId: number;
    let lastBulletTime = 0;

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      if (isGameOver || isWin) {
        ctx.fillStyle = isWin ? '#d946ef' : '#0077b6';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isWin ? 'YOU WIN!' : 'GAME OVER', canvas.width/2, canvas.height/2 - 20);
        ctx.font = '20px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`SCORE: ${scoreVal}`, canvas.width/2, canvas.height/2 + 20);
        return;
      }

      // Draw player
      ctx.fillStyle = '#0077b6';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#0077b6';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      // ship gun
      ctx.fillRect(player.x + 15, player.y - 10, 10, 10);
      ctx.shadowBlur = 0;

      // Draw bullets
      ctx.fillStyle = '#fff';
      bullets.forEach(b => {
        b.y -= 8;
        ctx.fillRect(b.x, b.y, 4, 12);
      });
      bullets = bullets.filter(b => b.y > 0);

      // Enemy logic
      let hitWall = false;
      let allDead = true;

      enemies.forEach(e => {
        if (!e.alive) return;
        allDead = false;
        e.x += enemyDir * enemySpeed;
        if (e.x > canvas.width - e.width - 10 || e.x < 10) hitWall = true;
      });

      if (hitWall) {
        enemyDir *= -1;
        enemies.forEach(e => { 
          if (e.alive) e.y += 20; 
        });
        enemySpeed += 0.2; // Increase speed as they drop
      }

      // Draw and check collision for enemies
      ctx.fillStyle = '#d946ef';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#d946ef';
      enemies.forEach(e => {
        if (!e.alive) return;
        
        ctx.fillRect(e.x, e.y, e.width, e.height);
        
        // Game over if they reach bottom
        if (e.y + e.height >= player.y) {
          isGameOver = true;
        }
        
        // Bullet collision
        bullets.forEach(b => {
          if (b.x > e.x && b.x < e.x + e.width && b.y > e.y && b.y < e.y + e.height) {
            e.alive = false;
            b.y = -100; // remove bullet
            scoreVal += 50;
            setScore(scoreVal);
          }
        });
      });
      ctx.shadowBlur = 0;

      if (allDead) {
        isWin = true;
      }

      // Player move
      if (rightPressed && player.x < canvas.width - player.width - 5) player.x += 6;
      if (leftPressed && player.x > 5) player.x -= 6;

      animationId = requestAnimationFrame(draw);
    };

    const keyDown = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
      
      if (e.key === ' ' || e.key === 'ArrowUp') {
        const now = Date.now();
        if (now - lastBulletTime > 250 && !isGameOver && !isWin) { // Fire rate limit
          bullets.push({ x: player.x + player.width/2 - 2, y: player.y - 10 });
          lastBulletTime = now;
        }
      }
    };
    const keyUp = (e: KeyboardEvent) => {
      if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
      if (e.key === 'Left' || e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
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
      <div className="w-full max-w-[600px] flex justify-between items-center mb-4 px-4">
        <span className="text-white font-mono font-bold text-xl">Score: <span className="text-brand-neon">{score}</span></span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={450} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Arrows to Move | Space to Shoot</p>
    </div>
  );
}
