import { CheckCircle2, ChevronRight, Coins, AlertCircle, Save, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CostEstimation() {
  const { navigateTo, coinBalance, isGeneratingGame, setIsGeneratingGame } = useAppContext();

  const estimatedCosts = [
    { category: 'Visuals & FX', cost: 150 },
    { category: 'Audio & Storyline', cost: 135 },
    { category: 'Core Loop Mechanics', cost: 210 },
    { category: 'World Generation', cost: 300 },
    { category: 'NPC AI Systems', cost: 300 },
  ];
  
  const totalCost = estimatedCosts.reduce((acc, curr) => acc + curr.cost, 0); // 1095
  const canAfford = coinBalance >= totalCost;

  const handleGenerate = () => {
    setIsGeneratingGame(true);
    // Simulate generation delay then route to arcade
    setTimeout(() => {
      setIsGeneratingGame(false);
      navigateTo('arcade');
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-surface-dark border border-brand-deep rounded-3xl overflow-hidden shadow-[0_0_50px_-15px_rgba(0,119,182,0.8)] animate-in fade-in zoom-in-95 duration-500">
        <div className="p-8 border-b border-brand-deep bg-background-black/50">
          <h2 className="text-3xl font-extrabold mb-2 text-white">Generation Estimate</h2>
          <p className="text-brand-neon text-sm tracking-widest uppercase font-semibold">NATAD Tech Neural Analysis</p>
        </div>
        
        <div className="p-8 space-y-4">
          {estimatedCosts.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-3 border-b border-brand-deep last:border-0">
              <span className="text-gray-300 font-medium">{item.category}</span>
              <div className="flex items-center text-brand-neon-light font-bold">
                <span className="mr-1.5">{item.cost}</span>
                <Coins size={16} />
              </div>
            </div>
          ))}
          
          <div className="pt-6 mt-4 border-t border-brand-deep flex justify-between items-center">
            <span className="text-xl font-bold text-white">Total Required</span>
            <div className="flex items-center text-3xl font-black text-brand-neon">
              <span className="mr-2">{totalCost}</span>
              <Coins size={28} />
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-background-black border-t border-brand-deep space-y-4 relative">
          {isGeneratingGame && (
            <div className="absolute inset-0 bg-background-black/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 rounded-b-3xl">
              <Loader2 className="animate-spin text-brand-neon mb-4" size={40} />
              <p className="text-white font-bold text-lg animate-pulse text-center">Compiling architectural prompt via NATAD Tech...</p>
              <p className="text-brand-neon text-sm mt-2 text-center">Generating high-fidelity structural constraints.</p>
            </div>
          )}

          {!canAfford ? (
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400">
                <AlertCircle className="mr-3 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm">Insufficient balance. You have {coinBalance} coins, but {totalCost} are required. Please acquire more coins to proceed.</p>
              </div>
              <button 
                onClick={() => navigateTo('market')}
                disabled={isGeneratingGame}
                className="w-full py-4 bg-surface-mid border border-brand-deep hover:border-brand-neon/50 text-white font-bold rounded-xl transition-all flex justify-center items-center group disabled:opacity-50"
              >
                Purchase More Coins
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform text-brand-neon" size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleGenerate}
              disabled={isGeneratingGame}
              className="w-full py-4 bg-gradient-to-r from-brand-neon to-brand-neon-dark hover:from-brand-neon-light hover:to-brand-neon text-background-black font-extrabold rounded-xl transition-all flex justify-center items-center shadow-[0_0_30px_-5px_rgba(217,70,239,0.5)] group disabled:opacity-50"
            >
              <CheckCircle2 className="mr-2" size={20} />
              Initialize Generation
            </button>
          )}

          {/* Preserve Estimation Visual Button */}
          <div className="pt-2">
            <button 
              disabled={isGeneratingGame}
              className="w-full py-3 bg-transparent border border-brand-deep hover:bg-brand-deep/30 text-gray-400 hover:text-brand-neon-light text-sm font-semibold rounded-xl transition-colors flex justify-center items-center disabled:opacity-50"
            >
              <Save className="mr-2" size={16} />
              Estimation Preserved in Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
