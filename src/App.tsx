import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { ADMIN_EMAIL, ASSETS } from './constants';
import Navbar from './Navbar';
import Auth from './Auth';
import TournamentCard from './TournamentCard';
import JoinModal from './JoinModal';
import AdminPanel from './AdminPanel';
import { User, Tournament } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'admin' | 'wallet'>('home');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  // --- SOUND SYSTEM ---
  const playTap = () => {
    const audio = new Audio(ASSETS.clickSound);
    audio.play().catch(() => {});
  };

  const bgAudio = useRef(new Audio(ASSETS.bgMusic));
  useEffect(() => {
    bgAudio.current.loop = true;
    if (isMusicPlaying) {
      bgAudio.current.play().catch(() => {});
    } else {
      bgAudio.current.pause();
    }
  }, [isMusicPlaying]);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchTournaments = async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setTournaments(data);
      if (error) console.error("Database Error:", error);
    };
    fetchTournaments();
  }, []);

  const handleLogin = (email: string, name: string) => {
    playTap();
    setUser({
      id: '1',
      name,
      email,
      isAdmin: email === ADMIN_EMAIL,
      walletBalance: 0
    });
  };

  const handleLogout = () => {
    playTap();
    setUser(null);
    setIsMusicPlaying(false);
  };

  if (!user) return <Auth onLogin={handleLogin} logoUrl={ASSETS.officialLogo} />;

  return (
    <div className="bg-[#020617] min-h-screen text-white font-sans selection:bg-cyan-500/30">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNavigate={(v) => { playTap(); setView(v); }}
        currentView={view}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={() => { playTap(); setIsMusicPlaying(!isMusicPlaying); }}
        logoUrl={ASSETS.officialLogo}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.length > 0 ? (
              tournaments.map(t => (
                <TournamentCard 
                  key={t.id} 
                  tournament={t} 
                  onJoin={() => { playTap(); setSelectedTournament(t); }} 
                  logoUrl={ASSETS.officialLogo} 
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 opacity-50">
                Koi Tournament abhi available nahi hai.
              </div>
            )}
          </div>
        )}

        {view === 'admin' && user.isAdmin && (
          <AdminPanel 
            onBack={() => { playTap(); setView('home'); }} 
          />
        )}

        {view === 'wallet' && (
          <div className="max-w-md mx-auto bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
            <h2 className="text-2xl font-bold mb-4">Aapka Wallet</h2>
            <div className="text-5xl font-black text-cyan-400 mb-6">₹{user.walletBalance}</div>
            <button className="w-full bg-cyan-500 py-3 rounded-xl font-bold">Add Money</button>
          </div>
        )}
      </main>

      {selectedTournament && (
        <JoinModal 
          tournament={selectedTournament} 
          onClose={() => { playTap(); setSelectedTournament(null); }} 
          onSubmit={() => { playTap(); setSelectedTournament(null); alert('Request Sent!'); }} 
        />
      )}
    </div>
  );
};

export default App;
