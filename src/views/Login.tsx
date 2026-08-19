import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, navigateTo } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate network request
    setTimeout(() => {
      // Basic validation mock
      const mockUsers = JSON.parse(localStorage.getItem('croevo_mock_users') || '{}');
      
      if (mockUsers[email]) {
        if (mockUsers[email].password === password) {
          login(mockUsers[email].name, email);
        } else {
          setError('Invalid password');
        }
      } else {
        // If not found in mock DB, just mock a successful generic login for prototype flexibility
        // Or actually enforce signup. Let's enforce signup for "logical" behavior.
        setError('No account found with this email. Please sign up.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-background-black p-4">
      <div className="w-full max-w-md bg-surface-dark border border-brand-deep rounded-xl shadow-[0_0_30px_rgba(0,119,182,0.15)] p-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-neon/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-deep/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to continue to Croevo AI</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:ring-1 focus:ring-brand-neon focus:border-brand-neon transition-colors sm:text-sm" 
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:ring-1 focus:ring-brand-neon focus:border-brand-neon transition-colors sm:text-sm" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400">
                <input type="checkbox" className="rounded border-gray-700 bg-[#0a0a0a] text-brand-neon focus:ring-brand-neon focus:ring-offset-background-black" />
                <span className="ml-2">Remember me</span>
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-brand-neon hover:text-brand-neon-light transition-colors">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-background-black bg-brand-neon hover:bg-brand-neon-light hover:shadow-[0_0_15px_rgba(0,240,240,0.4)] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-neon disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : (
                <>
                  Sign In
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => navigateTo('signup')} className="text-brand-neon hover:text-brand-neon-light font-medium transition-colors">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
