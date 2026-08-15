import { Coins, LayoutDashboard, Store, User } from 'lucide-react'
import Home from './views/Home'
import GameLab from './views/GameLab'
import CostEstimation from './views/CostEstimation'
import CoinMarket from './views/CoinMarket'
import ArcadeLounge from './views/ArcadeLounge'
import { useAppContext } from './context/AppContext'

export type View = 'home' | 'lab' | 'estimate' | 'market' | 'arcade';

function AppContent() {
  const { currentView, navigateTo, coinBalance } = useAppContext();

  return (
    <div className="min-h-screen bg-background-black text-white font-sans flex flex-col">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-background-black/80 backdrop-blur-md border-b border-brand-deep">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-10 h-10 rounded-lg border border-brand-neon flex items-center justify-center mr-3 overflow-hidden shadow-[0_0_15px_rgba(0,119,182,0.4)]">
                <img src="/logo.jpg" alt="Croevo AI Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">Croevo AI</span>
                <span className="ml-3 text-xs font-medium text-brand-neon uppercase tracking-widest hidden sm:inline-block">Elevating Gaming Intelligence</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigateTo('home')}
                className={`p-2 rounded-md transition-colors ${currentView === 'home' ? 'bg-brand-deep text-brand-neon' : 'text-gray-400 hover:text-brand-neon-light hover:bg-brand-deep/50'}`}
                title="Home"
              >
                <LayoutDashboard size={20} />
              </button>
              
              <div 
                className="flex items-center bg-surface-dark border border-brand-deep rounded-full px-4 py-1.5 cursor-pointer hover:border-brand-neon/50 transition-colors"
                onClick={() => navigateTo('market')}
              >
                <Coins className="text-brand-neon mr-2" size={16} />
                <span className="font-semibold text-white">{coinBalance}</span>
              </div>
              
              <button 
                onClick={() => navigateTo('market')}
                className={`p-2 rounded-md transition-colors ${currentView === 'market' ? 'bg-brand-deep text-brand-neon' : 'text-gray-400 hover:text-brand-neon-light hover:bg-brand-deep/50'}`}
                title="Coin Market"
              >
                <Store size={20} />
              </button>

              <div className="flex items-center space-x-2 pl-4 border-l border-brand-deep">
                <div className="w-8 h-8 rounded-full bg-brand-deep flex items-center justify-center text-brand-neon">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-gray-200 hidden md:block">Abhinav</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {currentView === 'home' && <Home />}
        {currentView === 'lab' && <GameLab />}
        {currentView === 'estimate' && <CostEstimation />}
        {currentView === 'market' && <CoinMarket />}
        {currentView === 'arcade' && <ArcadeLounge />}
      </main>
    </div>
  )
}

export default AppContent
