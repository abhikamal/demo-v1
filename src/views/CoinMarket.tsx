import { useState } from 'react';
import { ArrowLeft, Coins, CreditCard, History } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CoinMarket() {
  const { navigateTo, coinBalance, setCoinBalance } = useAppContext();
  const [amountStr, setAmountStr] = useState('');
  const amount = parseInt(amountStr) || 0;
  const costPerCoin = 5;
  const totalPrice = amount * costPerCoin;

  const handlePurchase = () => {
    if (amount > 0) {
      setCoinBalance(coinBalance + amount);
      navigateTo('estimate');
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 max-w-2xl w-full mx-auto">
      <button 
        onClick={() => navigateTo('estimate')}
        className="self-start flex items-center text-gray-500 hover:text-brand-neon transition-colors mb-8 group"
      >
        <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
        Return to Estimation
      </button>

      <div className="flex-1 flex flex-col justify-center pb-20">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-brand-deep border border-brand-neon/30 text-brand-neon mb-6 shadow-[0_0_30px_rgba(217,70,239,0.2)]">
            <Coins size={40} />
          </div>
          <h2 className="text-5xl font-extrabold mb-4 text-white tracking-tight">Coin Market</h2>
          <p className="text-gray-400 text-lg">Current Available Balance: <span className="text-brand-neon font-bold ml-1">{coinBalance} Coins</span></p>
        </div>

        <div className="bg-surface-dark border border-brand-deep p-8 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-neon/10 rounded-full blur-3xl pointer-events-none" />
          
          <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide uppercase">Enter Coin Amount</label>
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Coins className="text-brand-neon/70" size={20} />
            </div>
            <input
              type="number"
              min="0"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="e.g. 1000"
              className="block w-full pl-12 pr-4 py-5 bg-background-black border border-brand-deep rounded-xl text-2xl font-bold text-white focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition-all placeholder:text-gray-700"
            />
          </div>

          <div className="bg-background-black rounded-xl p-6 mb-8 flex justify-between items-center border border-brand-deep">
            <span className="text-gray-400 font-medium">Total Price (USD)</span>
            <span className="text-3xl font-black text-white">
              ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handlePurchase}
            disabled={amount <= 0}
            className="w-full flex items-center justify-center py-5 px-6 bg-gradient-to-r from-brand-neon to-brand-neon-dark hover:from-brand-neon-light hover:to-brand-neon disabled:opacity-50 disabled:grayscale text-background-black font-extrabold text-lg rounded-xl transition-all shadow-[0_0_30px_-10px_rgba(217,70,239,0.5)]"
          >
            <CreditCard className="mr-3" size={22} />
            Authorize Purchase
          </button>

          {/* Transaction History Link */}
          <div className="mt-6 flex justify-center">
            <button className="flex items-center text-gray-500 hover:text-brand-neon transition-colors text-sm font-medium">
              <History className="mr-2" size={16} />
              View Transaction History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
