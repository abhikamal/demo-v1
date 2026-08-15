import { useState, useEffect } from 'react';
import { Gamepad2, Timer, Play, X } from 'lucide-react';
import SnakeGame from '../components/games/SnakeGame';
import PongGame from '../components/games/PongGame';
import BreakoutGame from '../components/games/BreakoutGame';
import TetrisGame from '../components/games/TetrisGame';
import SpaceInvadersGame from '../components/games/SpaceInvadersGame';
import Match3Game from '../components/games/Match3Game';
import FlappyBirdGame from '../components/games/FlappyBirdGame';
import AsteroidsGame from '../components/games/AsteroidsGame';
import MazeRunnerGame from '../components/games/MazeRunnerGame';
import PinballGame from '../components/games/PinballGame';

export default function ArcadeLounge() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  useEffect(() => {
    // Randomize time between 1h 15m and 3h 45m
    const minSecs = 75 * 60;
    const maxSecs = 225 * 60;
    const initialTime = Math.floor(Math.random() * (maxSecs - minSecs + 1) + minSecs);
    setTimeLeft(initialTime);

    const interval = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const games = [
    { id: 'snake', name: 'Neon Snake', ready: true },
    { id: 'pong', name: 'Cyber Pong', ready: true },
    { id: 'breakout', name: 'Block Breaker', ready: true },
    { id: 'tetris', name: 'Tetris Matrix', ready: true },
    { id: 'invaders', name: 'Space Invaders', ready: true },
    { id: 'match', name: 'Candy Match', ready: true },
    { id: 'flappy', name: 'Flappy Bird', ready: true },
    { id: 'asteroids', name: 'Asteroids', ready: true },
    { id: 'pac', name: 'Maze Runner', ready: true },
    { id: 'pinball', name: 'Pinball', ready: true },
  ];

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'snake': return <SnakeGame />;
      case 'pong': return <PongGame />;
      case 'breakout': return <BreakoutGame />;
      case 'tetris': return <TetrisGame />;
      case 'invaders': return <SpaceInvadersGame />;
      case 'match': return <Match3Game />;
      case 'flappy': return <FlappyBirdGame />;
      case 'asteroids': return <AsteroidsGame />;
      case 'pac': return <MazeRunnerGame />;
      case 'pinball': return <PinballGame />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 max-w-6xl w-full mx-auto animate-in fade-in zoom-in-95 duration-700">
      {/* Dashboard Top */}
      <div className="bg-[#050505] border border-brand-neon rounded-2xl p-6 mb-8 shadow-[0_0_20px_rgba(0,119,182,0.2)] flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-neon/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <Timer className="text-brand-neon animate-pulse" size={24} />
            <h2 className="text-2xl font-extrabold text-white">Generation Status</h2>
          </div>
          <p className="text-gray-400">NATAD Tech Neural Engine is compiling your game assets in the cloud.</p>
        </div>
        
        <div className="flex flex-col items-end min-w-[200px] relative z-10">
          <div className="px-5 py-3 bg-brand-deep/30 rounded-xl border border-brand-neon flex flex-col items-center shadow-[0_0_15px_rgba(0,119,182,0.4)]">
            <span className="text-xs text-brand-neon uppercase tracking-wider font-bold mb-1">Estimated Time</span>
            <span className="text-white font-mono font-bold text-2xl">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Arcade Grid */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white flex items-center mb-6">
          <Gamepad2 className="text-brand-neon mr-3" size={24} />
          Retro Arcade Lounge
          <span className="text-sm font-normal text-gray-500 ml-4 hidden sm:inline">Play while you wait...</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {games.map((game) => (
             <div 
                key={game.id} 
                onClick={() => game.ready && setActiveGame(game.id)}
                className={`group relative bg-[#0a0a0a] border ${game.ready ? 'border-brand-deep hover:border-brand-neon cursor-pointer' : 'border-surface-dark opacity-60'} rounded-xl aspect-square flex flex-col items-center justify-center p-4 transition-all overflow-hidden`}
             >
                <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className={`w-12 h-12 rounded-lg mb-3 flex items-center justify-center ${game.ready ? 'bg-brand-deep/50 text-brand-neon shadow-[0_0_10px_rgba(0,119,182,0.5)]' : 'bg-surface-dark text-gray-500'}`}>
                  <Gamepad2 size={24} />
                </div>
                
                <h4 className="text-white font-bold text-center text-sm">{game.name}</h4>
                
                {game.ready ? (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <button className="flex items-center bg-brand-neon text-white px-4 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(0,119,182,0.5)]">
                      <Play size={16} className="mr-2 fill-current" /> Play
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-2">Coming Soon</span>
                )}
             </div>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      {activeGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setActiveGame(null)}></div>
          <div className="relative w-full max-w-4xl h-[80vh] bg-[#050505] border border-brand-neon rounded-2xl shadow-[0_0_50px_rgba(0,119,182,0.4)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-4 border-b border-brand-deep bg-surface-dark">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="text-brand-neon" size={20} />
                <h3 className="text-white font-bold">{games.find(g => g.id === activeGame)?.name}</h3>
              </div>
              <button 
                onClick={() => setActiveGame(null)}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              {renderActiveGame()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
