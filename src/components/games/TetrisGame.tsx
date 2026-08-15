import { useEffect, useRef, useState } from 'react';

// Tetromino definitions (I, J, L, O, S, T, Z)
const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#00f0f0' }, // Cyan
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#0000f0' }, // Blue
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }, // Orange
  O: { shape: [[1, 1], [1, 1]], color: '#f0f000' }, // Yellow
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' }, // Green
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' }, // Purple
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' }  // Red
};

type TetrominoType = keyof typeof TETROMINOES;

interface Piece {
  x: number;
  y: number;
  shape: number[][];
  color: string;
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 25; // 10 * 25 = 250px width, 20 * 25 = 500px height
    
    let board: (string | 0)[][] = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    let scoreVal = 0;
    let isGameOver = false;

    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let animationId: number;

    const getRandomPiece = (): Piece => {
      const keys = Object.keys(TETROMINOES) as TetrominoType[];
      const type = keys[Math.floor(Math.random() * keys.length)];
      const tet = TETROMINOES[type];
      return {
        x: Math.floor(COLS / 2) - Math.floor(tet.shape[0].length / 2),
        y: 0,
        shape: tet.shape,
        color: tet.color
      };
    };

    let currentPiece = getRandomPiece();

    const collide = (b: (string | 0)[][], p: Piece) => {
      for (let y = 0; y < p.shape.length; y++) {
        for (let x = 0; x < p.shape[y].length; x++) {
          if (p.shape[y][x] !== 0) {
            const newY = p.y + y;
            const newX = p.x + x;
            if (newY >= ROWS || newX < 0 || newX >= COLS || (newY >= 0 && b[newY][newX] !== 0)) {
              return true;
            }
          }
        }
      }
      return false;
    };

    const merge = (b: (string | 0)[][], p: Piece) => {
      p.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0 && p.y + y >= 0) {
            b[p.y + y][p.x + x] = p.color;
          }
        });
      });
    };

    const rotate = (matrix: number[][]) => {
      return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    };

    const playerRotate = () => {
      const originalShape = currentPiece.shape;
      const originalX = currentPiece.x;
      currentPiece.shape = rotate(currentPiece.shape);
      
      // Wall kick logic
      let offset = 1;
      while (collide(board, currentPiece)) {
        currentPiece.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > currentPiece.shape[0].length) {
          // Revert if rotation fails
          currentPiece.shape = originalShape;
          currentPiece.x = originalX;
          return;
        }
      }
    };

    const clearLines = () => {
      let linesCleared = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        let isFull = true;
        for (let x = 0; x < COLS; x++) {
          if (board[y][x] === 0) {
            isFull = false;
            break;
          }
        }
        if (isFull) {
          board.splice(y, 1);
          board.unshift(Array(COLS).fill(0));
          linesCleared++;
          y++; // check same row again since it moved down
        }
      }
      
      if (linesCleared > 0) {
        const points = [0, 40, 100, 300, 1200];
        scoreVal += points[linesCleared];
        setScore(scoreVal);
        // speed up
        dropInterval = Math.max(100, 1000 - (scoreVal / 10)); 
      }
    };

    const drop = () => {
      currentPiece.y++;
      if (collide(board, currentPiece)) {
        currentPiece.y--;
        merge(board, currentPiece);
        clearLines();
        currentPiece = getRandomPiece();
        if (collide(board, currentPiece)) {
          isGameOver = true;
          setGameOver(true);
        }
      }
      dropCounter = 0;
    };

    const move = (dir: number) => {
      currentPiece.x += dir;
      if (collide(board, currentPiece)) {
        currentPiece.x -= dir;
      }
    };

    const drawMatrix = (matrix: (string | number)[][], offsetX: number, offsetY: number) => {
      matrix.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            ctx.fillStyle = typeof value === 'string' ? value : currentPiece.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fillRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            
            // Add grid line inner detail
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, BLOCK_SIZE - 1, 2);
            ctx.fillRect((offsetX + x) * BLOCK_SIZE, (offsetY + y) * BLOCK_SIZE, 2, BLOCK_SIZE - 1);
          }
        });
      });
    };

    const update = (time = 0) => {
      if (isGameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f0f0';
        ctx.font = '30px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width/2, canvas.height/2);
        return;
      }

      const deltaTime = time - lastTime;
      lastTime = time;
      dropCounter += deltaTime;

      if (dropCounter > dropInterval) {
        drop();
      }

      // Draw background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      for(let i = 0; i <= COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i * BLOCK_SIZE, 0); ctx.lineTo(i * BLOCK_SIZE, canvas.height); ctx.stroke();
      }
      for(let i = 0; i <= ROWS; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * BLOCK_SIZE); ctx.lineTo(canvas.width, i * BLOCK_SIZE); ctx.stroke();
      }

      drawMatrix(board, 0, 0);
      drawMatrix(currentPiece.shape, currentPiece.x, currentPiece.y);

      animationId = requestAnimationFrame(update);
    };

    const keyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft') {
        move(-1);
      } else if (e.key === 'ArrowRight') {
        move(1);
      } else if (e.key === 'ArrowDown') {
        drop();
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        playerRotate();
      }
    };

    window.addEventListener('keydown', keyDown);
    update();

    return () => {
      window.removeEventListener('keydown', keyDown);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505] py-4">
      <div className="w-full max-w-[250px] flex justify-between items-center mb-4 px-2">
        <span className="text-white font-mono font-bold text-xl">Score: <span className="text-brand-neon">{score}</span></span>
        {gameOver && <span className="text-red-500 font-mono font-bold text-sm">GAME OVER</span>}
      </div>
      <canvas 
        ref={canvasRef} 
        width={250} 
        height={500} 
        className="bg-[#0a0a0a] border border-brand-deep rounded-sm shadow-[0_0_30px_rgba(0,119,182,0.3)]"
      />
      <div className="text-gray-500 font-mono text-xs mt-4 flex gap-4">
        <span>⬅️➡️ Move</span>
        <span>⬆️ Rotate</span>
        <span>⬇️ Drop</span>
      </div>
    </div>
  );
}
