import { useEffect, useRef, useState } from 'react';

const COLORS = ['#00f0f0', '#0000f0', '#f0a000', '#f0f000', '#00f000', '#d946ef']; // Neon colors
const ROWS = 8;
const COLS = 8;
const SIZE = 40;
const OFFSET_X = (600 - (COLS * SIZE)) / 2;
const OFFSET_Y = (400 - (ROWS * SIZE)) / 2;

interface Gem {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  remove: boolean;
}

export default function Match3Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let grid: (Gem | null)[][] = Array.from({length: ROWS}, () => Array(COLS).fill(null));
    let scoreVal = 0;
    
    // Init grid
    const fillGrid = () => {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (!grid[r][c]) {
            grid[r][c] = {
              x: c * SIZE,
              y: r * SIZE - (ROWS * SIZE), // Start above screen for cascade drop
              targetX: c * SIZE,
              targetY: r * SIZE,
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              remove: false
            };
          }
        }
      }
    };
    fillGrid();

    let selected: {r: number, c: number} | null = null;
    let isAnimating = false;
    let animationId: number;

    const checkMatches = () => {
      let hasMatch = false;
      // Horiz
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 2; c++) {
          let g1 = grid[r][c];
          let g2 = grid[r][c+1];
          let g3 = grid[r][c+2];
          if (g1 && g2 && g3 && g1.color === g2.color && g2.color === g3.color) {
            g1.remove = true; g2.remove = true; g3.remove = true;
            hasMatch = true;
          }
        }
      }
      // Vert
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 2; r++) {
          let g1 = grid[r][c];
          let g2 = grid[r+1][c];
          let g3 = grid[r+2][c];
          if (g1 && g2 && g3 && g1.color === g2.color && g2.color === g3.color) {
            g1.remove = true; g2.remove = true; g3.remove = true;
            hasMatch = true;
          }
        }
      }
      return hasMatch;
    };

    const processMatches = () => {
      let removedCount = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (grid[r][c]?.remove) {
            grid[r][c] = null;
            removedCount++;
          }
        }
      }
      if (removedCount > 0) {
        scoreVal += removedCount * 10;
        setScore(scoreVal);
        
        // drop down
        for (let c = 0; c < COLS; c++) {
          let emptySpaces = 0;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (grid[r][c] === null) {
              emptySpaces++;
            } else if (emptySpaces > 0) {
              const gem = grid[r][c]!;
              grid[r + emptySpaces][c] = gem;
              gem.targetY = (r + emptySpaces) * SIZE;
              grid[r][c] = null;
            }
          }
        }
        fillGrid();
        return true;
      }
      return false;
    };

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(OFFSET_X, OFFSET_Y);

      // Draw grid background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, COLS * SIZE, ROWS * SIZE);
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      for (let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * SIZE, 0); ctx.lineTo(i * SIZE, ROWS * SIZE); ctx.stroke();
      }
      for (let i = 0; i <= ROWS; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * SIZE); ctx.lineTo(COLS * SIZE, i * SIZE); ctx.stroke();
      }

      isAnimating = false;

      // Draw gems
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const gem = grid[r][c];
          if (gem) {
            // Animate position
            if (Math.abs(gem.x - gem.targetX) > 1) {
              gem.x += (gem.targetX - gem.x) * 0.2;
              isAnimating = true;
            } else gem.x = gem.targetX;

            if (Math.abs(gem.y - gem.targetY) > 1) {
              gem.y += (gem.targetY - gem.y) * 0.2;
              isAnimating = true;
            } else gem.y = gem.targetY;

            // Render
            ctx.fillStyle = gem.color;
            ctx.shadowBlur = gem.remove ? 20 : 10;
            ctx.shadowColor = gem.color;
            ctx.beginPath();
            ctx.arc(gem.x + SIZE/2, gem.y + SIZE/2, SIZE/2 - 4, 0, Math.PI*2);
            ctx.fill();
            ctx.shadowBlur = 0;
            
            // Highlight
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(gem.x + SIZE/2 - 5, gem.y + SIZE/2 - 5, SIZE/4, 0, Math.PI*2);
            ctx.fill();
          }
        }
      }

      // Draw selection
      if (selected && !isAnimating) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(selected.c * SIZE, selected.r * SIZE, SIZE, SIZE);
      }

      ctx.restore();

      // State machine logic
      if (!isAnimating) {
        if (checkMatches()) {
          processMatches();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    const handleClick = (e: MouseEvent) => {
      if (isAnimating) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left - OFFSET_X;
      const clickY = e.clientY - rect.top - OFFSET_Y;

      if (clickX < 0 || clickX > COLS * SIZE || clickY < 0 || clickY > ROWS * SIZE) {
        selected = null;
        return;
      }

      const c = Math.floor(clickX / SIZE);
      const r = Math.floor(clickY / SIZE);

      if (!selected) {
        selected = {r, c};
      } else {
        const sr = selected.r;
        const sc = selected.c;
        // Check adjacent
        if ((Math.abs(sr - r) === 1 && sc === c) || (Math.abs(sc - c) === 1 && sr === r)) {
          // Swap
          const temp = grid[r][c];
          grid[r][c] = grid[sr][sc];
          grid[sr][sc] = temp;
          
          if (grid[r][c]) {
            grid[r][c]!.targetX = c * SIZE;
            grid[r][c]!.targetY = r * SIZE;
          }
          if (grid[sr][sc]) {
            grid[sr][sc]!.targetX = sc * SIZE;
            grid[sr][sc]!.targetY = sr * SIZE;
          }

          // Verify swap is valid
          setTimeout(() => {
            if (!checkMatches()) {
              // Swap back
              const temp2 = grid[r][c];
              grid[r][c] = grid[sr][sc];
              grid[sr][sc] = temp2;
              
              if (grid[r][c]) {
                grid[r][c]!.targetX = c * SIZE;
                grid[r][c]!.targetY = r * SIZE;
              }
              if (grid[sr][sc]) {
                grid[sr][sc]!.targetX = sc * SIZE;
                grid[sr][sc]!.targetY = sr * SIZE;
              }
            }
          }, 300);
        }
        selected = null;
      }
    };

    canvas.addEventListener('click', handleClick);
    draw();

    return () => {
      canvas.removeEventListener('click', handleClick);
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
        className="bg-[#0a0a0a] border-2 border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.3)] cursor-pointer"
      />
      <p className="text-gray-500 font-mono text-sm mt-4">Click to swap adjacent gems</p>
    </div>
  );
}
