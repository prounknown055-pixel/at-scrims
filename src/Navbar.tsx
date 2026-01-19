import React from 'react';
import { User } from './types';
import { LogOut, Wallet, Shield, Music, Music2 } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'admin' | 'wallet') => void;
  currentView: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  logoUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, onLogout, onNavigate, currentView, isMusicPlaying, onToggleMusic, logoUrl 
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <img src={logoUrl} alt="Logo" className="w-10 h-10" />
          <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hidden sm:block">
            AT SCRIMS
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onToggleMusic}
            className={`p-2 rounded-xl transition-all ${isMusicPlaying ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-gray-400'}`}
          >
            {isMusicPlaying ? <Music size={20} className="animate-bounce" /> : <Music2 size={20} />}
          </button>

          <button 
            onClick={() => onNavigate('wallet')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${currentView === 'wallet' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-gray-300'}`}
          >
            <Wallet size={18} />
            <span className="font-bold">₹{user.walletBalance}</span>
          </button>

          {user.isAdmin && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`p-2 rounded-xl transition-all ${currentView === 'admin' ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-400'}`}
            >
              <Shield size={20} />
            </button>
          )}

          <button onClick={onLogout} className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
