import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient'; // Supabase connection

interface AuthProps {
  onLogin: (email: string, name: string) => void;
  logoUrl: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [error, setError] = useState('');
  
  // Audio setup
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  // --- 1. Sound & Touch Effects ---
  const playTap = () => {
    const audio = new Audio('/tap.mp3'); 
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const startBGM = () => {
    if (bgmRef.current) {
      bgmRef.current.play().catch(() => console.log("User interaction needed for audio"));
    }
  };

  // --- 2. Backend Social Login (Supabase) ---
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    playTap();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });
    if (error) setError(error.message);
  };

  // --- 3. High Security Admin Logic ---
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    playTap();
    setError('');
    
    // Fixed Admin Credentials as requested
    const ADMIN_ID = "tournamentsakamao@gmail.com";
    const ADMIN_PW = "musicstudio250@gmail.com";

    if (emailInput.trim() === ADMIN_ID && passwordInput === ADMIN_PW) {
      onLogin(ADMIN_ID, 'Super Admin');
    } else {
      setError('SECURITY ALERT: INVALID ACCESS KEY.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden" onClick={startBGM}>
      {/* Background Music */}
      <audio ref={bgmRef} src="/bgm.mp3" loop />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse"></div>
      
      <div className="max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[48px] border border-cyan-500/20 shadow-[0_32px_64px_rgba(0,0,0,0.6)] relative overflow-hidden z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center relative">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-500/30 blur-[40px] rounded-full"></div>
            <div className="w-56 h-56 mx-auto relative z-10 flex items-center justify-center">
              {/* Image with Touch Effect & Animation */}
              <img 
                src="/logo.png" 
                alt="AT Logo" 
                className="w-full h-full object-contain logo-glow transform hover:scale-105 active:scale-90 transition-all duration-300 ease-out animate-bounce-subtle cursor-pointer" 
                onClick={playTap}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150'; }}
              />
            </div>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-tight">Admin's Tournament</h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-px w-6 bg-cyan-500/50"></span>
            <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.4em]">Esports Destination</p>
            <span className="h-px w-6 bg-cyan-500/50"></span>
          </div>
        </div>

        {!showAdminLogin ? (
          <div className="space-y-4 pt-6 relative">
            {/* Google Button with Animation */}
            <button 
              onClick={() => handleSocialLogin('google')}
              className="at-btn w-full flex items-center justify-center gap-4 px-6 py-5 bg-white text-slate-950 rounded-2xl font-black shadow-xl transform active:scale-95 transition-transform hover:bg-slate-100"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt=""/>
              Login with Google
            </button>

            {/* Facebook Button with Animation */}
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="at-btn w-full flex items-center justify-center gap-4 px-6 py-5 bg-[#1877F2] text-white rounded-2xl font-black shadow-xl transform active:scale-95 transition-transform hover:brightness-110"
            >
              <i className="fab fa-facebook text-lg"></i>
              Login with Facebook
            </button>

            <div className="pt-6 flex items-center justify-center gap-4">
              <span className="h-[1px] flex-1 bg-slate-800"></span>
              <button 
                onClick={() => { playTap(); setShowAdminLogin(true); setError(''); }}
                className="text-[10px] text-slate-500 hover:text-cyan-400 font-black uppercase tracking-[0.2em] transition-colors"
              >
                Admin Access
              </button>
              <span className="h-[1px] flex-1 bg-slate-800"></span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAdminAuth} className="space-y-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl text-center shadow-lg">
                <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter Registered Email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white focus:border-cyan-500 outline-none font-bold transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-2">Access Key</label>
                <input 
                  type="password" 
                  placeholder="Enter Admin Password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-5 text-white focus:border-cyan-500 outline-none font-bold transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="at-btn w-full bg-cyan-600 text-white py-5 rounded-2xl font-black shadow-2xl uppercase tracking-[0.1em] text-sm transform active:scale-95 transition-transform"
            >
              Verify & Enter
            </button>
            
            <button 
              type="button" 
              onClick={() => { playTap(); setShowAdminLogin(false); }}
              className="w-full text-slate-500 text-[10px] font-black uppercase tracking-widest py-2 hover:text-white transition-colors"
            >
              Back to Player Login
            </button>
          </form>
        )}
        
        <div className="pt-8 border-t border-slate-800/50">
          <p className="text-center text-[9px] text-slate-600 font-black uppercase tracking-[0.15em] leading-relaxed">
            Authorized Personnel Only<br/>Security Protocols Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
            
