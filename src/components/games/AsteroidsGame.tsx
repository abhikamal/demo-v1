import { useEffect, useRef, useState } from 'react';

export default function AsteroidsGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isGameOver = false;
    let scoreVal = 0;
    
    const ship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      angle: 0,
      velX: 0,
      velY: 0,
      radius: 10
    };

    let bullets: {x: number, y: number, velX: number, velY: number, life: number}[] = [];
    let asteroids: {x: number, y: number, velX: number, velY: number, radius: number, points: number[]}[] = [];
    
    // Spawn initial asteroids
    const spawnAsteroid = (x: number, y: number, radius: number) => {
      const numPoints = Math.floor(Math.random() * 5) + 5;
      const points = [];
      for (let i = 0; i < numPoints; i++) {
        points.push(Math.random() * 0.4 + 0.8); // variance in radius
      }
      asteroids.push({
        x, y,
        velX: (Math.random() - 0.5) * 2,
        velY: (Math.random() - 0.5) * 2,
        radius,
        points
      });
    };

    for (let i = 0; i < 4; i++) {
      spawnAsteroid(Math.random() * canvas.width, Math.random() * canvas.height, 40);
    }

    const keys = { ArrowUp: false, ArrowLeft: false, ArrowRight: false, Space: false };
    let lastBulletTime = 0;
    let animationId: number;

    const wrap = (obj: {x: number, y: number, radius: number}) => {
      if (obj.x < -obj.radius) obj.x = canvas.width + obj.radius;
      else if (obj.x > canvas.width + obj.radius) obj.x = -obj.radius;
      if (obj.y < -obj.radius) obj.y = canvas.height + obj.radius;
      else if (obj.y > canvas.height + obj.radius) obj.y = -obj.radius;
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

      // Ship physics
      if (keys.ArrowLeft) ship.angle -= 0.1;
      if (keys.ArrowRight) ship.angle += 0.1;
      if (keys.ArrowUp) {
        ship.velX += Math.cos(ship.angle) * 0.1;
        ship.velY += Math.sin(ship.angle) * 0.1;
      }
      
      // friction
      ship.velX *= 0.99;
      ship.velY *= 0.99;

      ship.x += ship.velX;
      ship.y += ship.velY;
      wrap(ship);

      // Draw Ship
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle);
      ctx.strokeStyle = '#00f0f0';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00f0f0';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.stroke();
      
      // Thruster
      if (keys.ArrowUp) {
        ctx.strokeStyle = '#d946ef';
        ctx.beginPath();
        ctx.moveTo(-5, 0);
        ctx.lineTo(-15, 5);
        ctx.lineTo(-12, 0);
        ctx.lineTo(-15, -5);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      // Bullets
      if (keys.Space) {
        const now = Date.now();
        if (now - lastBulletTime > 200) {
          bullets.push({
            x: ship.x + Math.cos(ship.angle) * 15,
            y: ship.y + Math.sin(ship.angle) * 15,
            velX: Math.cos(ship.angle) * 6,
            velY: Math.sin(ship.angle) * 6,
            life: 100
          });
          lastBulletTime = now;
        }
      }

      ctx.fillStyle = '#fff';
      bullets.forEach(b => {
        b.x += b.velX;
        b.y += b.velY;
        b.life--;
        wrap(b as any);
        ctx.fillRect(b.x, b.y, 2, 2);
      });
      bullets = bullets.filter(b => b.life > 0);

      // Asteroids
      ctx.strokeStyle = '#d946ef';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#d946ef';
      
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i];
        a.x += a.velX;
        a.y += a.velY;
        wrap(a);

        ctx.beginPath();
        for (let j = 0; j < a.points.length; j++) {
          const ang = (j / a.points.length) * Math.PI * 2;
          const r = a.radius * a.points[j];
          if (j === 0) ctx.moveTo(a.x + Math.cos(ang) * r, a.y + Math.sin(ang) * r);
          else ctx.lineTo(a.x + Math.cos(ang) * r, a.y + Math.sin(ang) * r);
        }
        ctx.closePath();
        ctx.stroke();

        // Ship collision
        const distToShip = Math.hypot(ship.x - a.x, ship.y - a.y);
        if (distToShip < a.radius + ship.radius - 5) {
          isGameOver = true;
        }

        // Bullet collision
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          const distToBullet = Math.hypot(b.x - a.x, b.y - a.y);
          if (distToBullet < a.radius) {
            // Hit!
            bullets.splice(j, 1);
            asteroids.splice(i, 1);
            scoreVal += 100;
            setScore(scoreVal);
            
            // split
            if (a.radius > 15) {
              spawnAsteroid(a.x, a.y, a.radius / 2);
              spawnAsteroid(a.x, a.y, a.radius / 2);
            }
            break;
          }
        }
      }
      ctx.shadowBlur = 0;

      // Respawn wave if all dead
      if (asteroids.length === 0) {
        for (let i = 0; i < 4 + Math.floor(scoreVal/500); i++) {
          spawnAsteroid(Math.random() * canvas.width, Math.random() * canvas.height, 40);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleKey = (e: KeyboardEvent, state: boolean) => {
      if (e.key === 'ArrowUp') keys.ArrowUp = state;
      if (e.key === 'ArrowLeft') keys.ArrowLeft = state;
      if (e.key === 'ArrowRight') keys.ArrowRight = state;
      if (e.key === ' ') {
        e.preventDefault();
        keys.Space = state;
      }
    };

    const keyDown = (e: KeyboardEvent) => handleKey(e, true);
    const keyUp = (e: KeyboardEvent) => handleKey(e, false);

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
        height={400} 
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Arrows to rotate/thrust, Space to shoot</p>
    </div>
  );
}
