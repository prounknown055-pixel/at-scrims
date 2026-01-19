import React from 'react';
import { User } from './types';

interface Props {
  user: User;
  onLogout: () => void;
  onNavigate: (view: 'home' | 'admin' | 'wallet') => void;
  currentView: 'home' | 'admin' | 'wallet';
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  logoUrl: string;
}

const Navbar: React.FC<Props> = ({
  user,
  onLogout,
  onNavigate,
  currentView,
  isMusicPlaying,
  onToggleMusic,
  logoUrl,
}) => {
  /* 🔊 TAP SOUND */
  const playClick = () => {
    const audio = document.getElementById(
      'global-click-audio'
    ) as HTMLAudioElement | null;

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const handleNav = (view: 'home' | 'admin' | 'wallet') => {
    playClick();
    onNavigate(view);
  };

  const handleLogout = () => {
    playClick();
    onLogout();
  };

  const handleMusicToggle = () => {
    playClick();
    onToggleMusic();
  };

  return (
    <header className="w-full border-b border-slate-800 bg-[#020617]">
      {/* 🔊 GLOBAL CLICK SOUND (SINGLE SOURCE) */}
      <audio id="global-click-audio" src="/click.mp3" preload="auto" />

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="logo"
            className="w-10 h-10 object-contain select-none"
            draggable={false}
          />
          <span className="font-bold text-lg">AT Scrims</span>
        </div>

        {/* CENTER NAV */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-1 rounded-lg transition-transform active:scale-95 ${
              currentView === 'home'
                ? 'bg-cyan-600'
                : 'bg-slate-800'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNav('wallet')}
            className={`px-3 py-1 rounded-lg transition-transform active:scale-95 ${
              currentView === 'wallet'
                ? 'bg-cyan-600'
                : 'bg-slate-800'
            }`}
          >
            Wallet
          </button>

          {user.isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-1 rounded-lg transition-transform active:scale-95 ${
                currentView === 'admin'
                  ? 'bg-red-600'
                  : 'bg-slate-800'
              }`}
            >
              Admin
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleMusicToggle}
            className="px-3 py-1 rounded-lg bg-slate-800 transition-transform active:scale-95"
            title="Music"
          >
            {isMusicPlaying ? '🔊' : '🔇'}
          </button>

          <span className="hidden sm:block text-sm text-slate-300">
            {user.name}
          </span>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg bg-slate-800 transition-transform active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
