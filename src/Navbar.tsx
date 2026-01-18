
import React from 'react';
import { User } from '../types';
import { ASSETS } from './constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'admin' | 'wallet') => void;
  currentView: string;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  logoUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate, currentView, isMusicPlaying, onToggleMusic, logoUrl }) => {
  return (
    <nav className="bg-slate-950/80 backdrop-blur-2xl border-b border-cyan-500/10 sticky top-0 z-[100] h-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('home')}>
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img src={logoUrl || ASSETS.officialLogo} alt="AT Logo" className="w-16 h-16 object-contain relative z-10 logo-glow" onError={(e) => { e.currentTarget.src = ASSETS.officialLogo; }} />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-black text-white tracking-tighter uppercase italic block">Admin's Tournament</span>
              <span className="text-[8px] text-cyan-500/60 font-black uppercase tracking-[0.4em] block mt-1">Esports Arena</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {user && !user.isAdmin && (
              <button 
                onClick={() => onNavigate('wallet')}
                className={`at-btn flex flex-col items-center px-6 py-2 rounded-2xl transition-all border ${currentView === 'wallet' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}
              >
                <span className="text-[7px] text-slate-500 font-black uppercase tracking-widest">Balance</span>
                <span className="text-emerald-400 font-black text-sm">₹{user.walletBalance}</span>
              </button>
            )}

            <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
               {isMusicPlaying && (
                 <div className="flex gap-0.5 h-4 items-end px-2">
                   {[...Array(4)].map((_, i) => <div key={i} className={`w-0.5 bg-cyan-500 rounded-full animate-bounce`} style={{ animationDelay: `${i * 0.1}s`, height: `${30 + Math.random() * 70}%` }}></div>)}
                 </div>
               )}
               <button onClick={(e) => { e.stopPropagation(); onToggleMusic(); }} className={`at-btn w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isMusicPlaying ? 'bg-cyan-600/10 text-cyan-500' : 'text-slate-700'}`}>
                <i className={`fas ${isMusicPlaying ? 'fa-volume-up' : 'fa-volume-mute'} text-sm`}></i>
              </button>
            </div>

            {user && (
              <div className="flex items-center gap-4 border-l border-slate-900 pl-4">
                {user.isAdmin && (
                  <button onClick={() => onNavigate('admin')} className={`at-btn w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${currentView === 'admin' ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-slate-900 text-slate-600 border-slate-800'}`}>
                    <i className="fas fa-crown"></i>
                  </button>
                )}
                <button onClick={onLogout} className="at-btn w-12 h-12 bg-slate-900 text-slate-600 rounded-2xl flex items-center justify-center hover:text-red-400 border border-slate-800">
                  <i className="fas fa-power-off"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
