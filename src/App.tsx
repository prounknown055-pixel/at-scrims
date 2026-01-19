import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import { ADMIN_EMAIL, ASSETS } from './constants';
import Navbar from './Navbar';
import Auth from './Auth';
import TournamentCard from './TournamentCard';
import AdminPanel from './AdminPanel';
import JoinModal from './JoinModal';
import { User, Tournament } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'admin' | 'wallet'>('home');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  // --- SOUND LOGIC ---
  const bgAudio = useRef(new Audio(ASSETS.bgMusic));
  
  const playTap = () => {
    const audio = new Audio(ASSETS.clickSound);
    audio.play().catch(() => {});
  };

  useEffect(() => {
    bgAudio.current.loop = true;
    if (isMusicPlaying) {
      bgAudio.current.play().catch(() => console.log("Music play blocked"));
    } else {
      bgAudio.current.pause();
    }
  }, [isMusicPlaying]);

  // --- DATABASE FETCH ---
  const fetchTournaments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_time', { ascending: true });
    
    if (!error && data) setTournaments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleLogin = (email: string, name: string) => {
    playTap();
    setUser({
      id: Math.random().toString(),
      name,
      email,
      isAdmin: email === ADMIN_EMAIL,
      walletBalance: 0
    });
  };

  if (!user) return <Auth onLogin={handleLogin} logoUrl={ASSETS.officialLogo} />;

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-cyan-500/30">
      <Navbar 
        user={user} 
        onLogout={() => { playTap(); setUser(null); }} 
        onNavigate={(v) => { playTap(); setView(v); }}
        currentView={view}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={() => { playTap(); setIsMusicPlaying(!isMusicPlaying); }}
        logoUrl={ASSETS.officialLogo}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {view === 'home' && (
          <>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black italic tracking-tighter">LIVE TOURNAMENTS</h2>
              <button onClick={() => { playTap(); fetchTournaments(); }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                🔄
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
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
                  <div className="col-span-full text-center py-20 text-gray-500 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    No tournaments available right now.
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {view === 'admin' && user.isAdmin && (
          <AdminPanel 
            tournaments={tournaments} 
            onRefresh={fetchTournaments} 
          />
        )}

        {view === 'wallet' && (
          <div className="max-w-md mx-auto bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
            <h2 className="text-2xl font-bold mb-4">Aapka Wallet</h2>
            <div className="text-5xl font-black text-cyan-400 mb-6">₹{user.walletBalance}</div>
            <button onClick={playTap} className="w-full bg-cyan-500 py-3 rounded-xl font-bold">Add Money</button>
          </div>
        )}
      </main>

      {selectedTournament && (
        <JoinModal 
          tournament={selectedTournament} 
          onClose={() => { playTap(); setSelectedTournament(null); }} 
          onSubmit={() => { playTap(); setSelectedTournament(null); alert('Successfully Joined!'); }} 
        />
      )}
    </div>
  );
};

export default App;
