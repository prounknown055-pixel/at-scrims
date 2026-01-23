
import React, { useState, useEffect, useRef } from 'react';
import { User, Tournament, Registration, RegistrationStatus, GameType, ChatMessage, AppSettings, WithdrawalRequest } from './types';
import { ADMIN_EMAIL, GAMES, ASSETS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import Auth from './components/Auth.tsx';
import TournamentCard from './components/TournamentCard.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import JoinModal from './components/JoinModal.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'admin' | 'wallet'>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [selectedGameFilter, setSelectedGameFilter] = useState<GameType | 'All'>('All');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userChatText, setUserChatText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    logoUrl: ASSETS.officialLogo,
    bgMusicUrl: ASSETS.bgMusic,
    clickSoundUrl: ASSETS.clickSound,
    googleSheetId: '',
    paymentMode: 'MANUAL',
    upiId: 'tournamentsakamao@upi',
    isMaintenanceMode: false
  });

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    // 1. Load Settings
    const savedSettings = localStorage.getItem('at_settings');
    if (savedSettings) {
      setAppSettings(JSON.parse(savedSettings));
    }

    // 2. Load Data
    const savedTournaments = localStorage.getItem('at_tourneys');
    const savedRegs = localStorage.getItem('at_regs');
    const savedChats = localStorage.getItem('at_chats');
    const savedWithdrawals = localStorage.getItem('at_withdrawals');
    const savedUser = localStorage.getItem('at_user_session');

    if (savedTournaments) setTournaments(JSON.parse(savedTournaments));
    if (savedRegs) setRegistrations(JSON.parse(savedRegs));
    if (savedChats) setChatMessages(JSON.parse(savedChats));
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));
    
    // Persistent Login Logic
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.isAdmin) setView('admin');
    }

    const timer = setTimeout(() => setIsLoading(false), 1500);

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.at-btn')) playClick();
    };

    window.addEventListener('mousedown', handleGlobalClick);
    return () => {
      bgAudioRef.current?.pause();
      window.removeEventListener('mousedown', handleGlobalClick);
      clearTimeout(timer);
    };
  }, []);

  // Sync state to LocalStorage
  useEffect(() => { localStorage.setItem('at_tourneys', JSON.stringify(tournaments)); }, [tournaments]);
  useEffect(() => { localStorage.setItem('at_regs', JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem('at_chats', JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem('at_withdrawals', JSON.stringify(withdrawals)); }, [withdrawals]);
  useEffect(() => { localStorage.setItem('at_settings', JSON.stringify(appSettings)); }, [appSettings]);
  useEffect(() => { 
    if (user) {
      localStorage.setItem('at_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('at_user_session');
    }
  }, [user]);

  // Audio engine
  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.pause();
    bgAudioRef.current = new Audio(appSettings.bgMusicUrl);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.15;
    if (isMusicPlaying) bgAudioRef.current.play().catch(() => setIsMusicPlaying(false));

    clickAudioRef.current = new Audio(appSettings.clickSoundUrl);
    clickAudioRef.current.volume = 0.4;
  }, [appSettings.bgMusicUrl, appSettings.clickSoundUrl]);

  const playClick = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!bgAudioRef.current) return;
    playClick();
    if (isMusicPlaying) {
      bgAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      bgAudioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const handleLogin = (email: string, name: string) => {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      email, 
      name, 
      isAdmin, 
      walletBalance: 0 
    };
    setUser(newUser);
    if (isAdmin) setView('admin');
    
    if (bgAudioRef.current && !isMusicPlaying) {
      bgAudioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const handleSendChatMessage = (text: string, isAdmin: boolean = false, targetEmail?: string) => {
    if (!user || !text.trim()) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderEmail: isAdmin ? ADMIN_EMAIL : user.email,
      senderName: isAdmin ? 'Admin Support' : user.name,
      text: isAdmin && targetEmail ? `[To: ${targetEmail}] ${text}` : text,
      timestamp: Date.now(),
      isAdminReply: isAdmin
    };
    setChatMessages(prev => [...prev, msg]);
    setUserChatText('');
  };

  const handleDeclareWinner = (tournamentId: string, userId: string, prize: number) => {
    setTournaments(prev => prev.map(t => t.id === tournamentId ? { ...t, winnerUserId: userId, status: 'COMPLETED' } : t));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance + prize } : null);
    }
    alert(`Winner declared! ₹${prize} added to winner's wallet.`);
  };

  const handleWithdrawRequest = (amount: number, upiId: string) => {
    if (!user || user.walletBalance < amount) {
      alert("Insufficient balance!");
      return;
    }
    const req: WithdrawalRequest = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      amount,
      upiId,
      status: 'PENDING',
      timestamp: Date.now()
    };
    setWithdrawals(prev => [req, ...prev]);
    setUser(prev => prev ? { ...prev, walletBalance: prev.walletBalance - amount } : null);
    alert("Withdrawal submitted! Will be processed within 12-24h.");
  };

  if (appSettings.isMaintenanceMode && (!user || !user.isAdmin)) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full animate-pulse"></div>
          <i className="fas fa-tools text-8xl text-amber-500 relative z-10 animate-bounce"></i>
        </div>
        <h1 className="text-4xl font-black italic uppercase text-white mb-4 tracking-tighter">Arena Maintenance</h1>
        <p className="max-w-md text-slate-500 font-bold leading-relaxed mb-12">
          The arena is being upgraded. Login is currently disabled for players. Please check our socials for updates.
        </p>
        <div className="flex items-center gap-2 bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mode: Server Upgrade</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <img src={appSettings.logoUrl} alt="Logo" className="w-64 h-64 object-contain animate-pulse logo-glow" />
        <p className="mt-8 text-cyan-500 font-black uppercase tracking-[0.8em] text-[10px] animate-pulse">Elite Esports Arena</p>
      </div>
    );
  }

  if (!user) return <Auth onLogin={handleLogin} logoUrl={appSettings.logoUrl} />;

  return (
    <div className="min-h-screen bg-[#020617] pb-24 text-slate-100 font-sans">
      <Navbar 
        user={user} 
        onLogout={() => { setUser(null); setView('home'); localStorage.removeItem('at_user_session'); }} 
        onNavigate={setView} 
        currentView={view} 
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        logoUrl={appSettings.logoUrl}
      />

      {view === 'wallet' && !user.isAdmin && (
        <main className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <button onClick={() => setView('home')} className="at-btn mb-12 flex items-center gap-3 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all">
             <i className="fas fa-arrow-left text-xs"></i>
             <span className="text-[10px] font-black uppercase tracking-widest">Back to Arena</span>
          </button>

          <div className="bg-slate-900/60 p-12 rounded-[56px] border border-cyan-500/20 shadow-2xl">
            <h2 className="text-4xl font-black italic uppercase text-white mb-12">My <span className="text-cyan-500">Wallet</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
               <div className="bg-slate-950 p-10 rounded-[40px] border border-slate-800 shadow-inner">
                 <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest block mb-4">Current Balance</span>
                 <span className="text-6xl font-black text-emerald-400 italic">₹{user.walletBalance}</span>
               </div>
               <form onSubmit={(e) => {
                 e.preventDefault();
                 const amt = Number((e.currentTarget.elements.namedItem('amount') as HTMLInputElement).value);
                 const upi = (e.currentTarget.elements.namedItem('upi') as HTMLInputElement).value;
                 handleWithdrawRequest(amt, upi);
               }} className="bg-slate-900 p-8 rounded-[40px] border border-slate-800 space-y-4">
                 <input name="amount" type="number" placeholder="Amount to Withdraw" required className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                 <input name="upi" type="text" placeholder="UPI ID / Number" required className="w-full bg-slate-950 border border-slate-800 p-4 rounded-2xl outline-none focus:border-cyan-500 font-bold" />
                 <button type="submit" className="at-btn w-full bg-cyan-600 py-4 rounded-2xl font-black uppercase text-white shadow-xl shadow-cyan-950">Withdraw Rewards</button>
               </form>
            </div>
            
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {withdrawals.filter(w => w.userId === user.id).map(w => (
                <div key={w.id} className="bg-slate-950 p-6 rounded-3xl border border-slate-800 flex justify-between items-center group">
                  <div>
                    <p className="font-black text-white text-sm">Withdrawal Payout</p>
                    <p className="text-[9px] text-slate-500 uppercase">{new Date(w.timestamp).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-rose-500 text-lg italic">₹{w.amount}</p>
                    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${w.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{w.status}</span>
                  </div>
                </div>
              ))}
              {withdrawals.filter(w => w.userId === user.id).length === 0 && <p className="text-center py-10 text-slate-800 italic">No activity yet</p>}
            </div>
          </div>
        </main>
      )}

      {view === 'home' && (
        <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter drop-shadow-2xl">AT <span className="text-cyan-500">Scrims</span></h1>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.6em] mt-3">Professional Arena</p>
          </div>

          <div className="flex overflow-x-auto gap-3 mb-12 pb-6 no-scrollbar">
            <button onClick={() => setSelectedGameFilter('All')} className={`at-btn whitespace-nowrap px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${selectedGameFilter === 'All' ? 'bg-cyan-600 text-white' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>All Matches</button>
            {GAMES.map(g => (
              <button key={g} onClick={() => setSelectedGameFilter(g)} className={`at-btn whitespace-nowrap px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border ${selectedGameFilter === g ? 'bg-cyan-600 text-white' : 'bg-slate-900/50 text-slate-500 border-slate-800'}`}>{g}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tournaments.filter(t => selectedGameFilter === 'All' || t.game === selectedGameFilter).map(t => {
              const reg = registrations.find(r => r.tournamentId === t.id && r.userId === user.id);
              return <TournamentCard key={t.id} tournament={t} onJoin={() => setSelectedTournament(t)} userStatus={reg?.status} slotNumber={reg?.slotNumber} logoUrl={appSettings.logoUrl} />;
            })}
          </div>
        </main>
      )}

      {view === 'admin' && user.isAdmin && (
        <div className="max-w-7xl mx-auto px-4 py-12">
           <button onClick={() => setView('home')} className="at-btn mb-8 flex items-center gap-3 bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-800 text-slate-400 hover:text-white transition-all">
             <i className="fas fa-home text-xs"></i>
             <span className="text-[10px] font-black uppercase tracking-widest">Player View</span>
          </button>
          
          <AdminPanel 
            tournaments={tournaments} registrations={registrations} chatMessages={chatMessages} appSettings={appSettings} withdrawals={withdrawals}
            onUpdateSettings={setAppSettings} onSetTournaments={setTournaments}
            onAddTournament={(t) => { setTournaments(p => [t, ...p]); setView('home'); }} 
            onUpdateRegistration={(regId, status) => { 
              const reg = registrations.find(r => r.id === regId);
              if (!reg) return;
              const updatedRegs = registrations.map(r => {
                if (r.id === regId) {
                  const tourneyRegsCount = registrations.filter(x => x.tournamentId === reg.tournamentId && x.status === RegistrationStatus.APPROVED).length;
                  return { ...r, status, slotNumber: status === RegistrationStatus.APPROVED ? tourneyRegsCount + 1 : undefined };
                }
                return r;
              });
              setRegistrations(updatedRegs);
              if (status === RegistrationStatus.APPROVED) {
                setTournaments(ts => ts.map(t => t.id === reg.tournamentId ? { ...t, filledSlots: t.filledSlots + 1 } : t));
              }
            }}
            onUpdateRoomDetails={(tourneyId, details) => setTournaments(prev => prev.map(t => t.id === tourneyId ? { ...t, roomDetails: details } : t))}
            onSendReply={(email, text) => handleSendChatMessage(text, true, email)}
            onDeclareWinner={handleDeclareWinner}
            onProcessWithdrawal={(id, status) => setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w))}
          />
        </div>
      )}

      {/* Floating Chat for Players */}
      {user && !user.isAdmin && (
        <div className="fixed bottom-24 right-6 z-[100]">
          {showChat ? (
            <div className="bg-slate-900 border border-slate-800 w-80 h-96 rounded-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 rounded-t-[32px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase text-cyan-500 tracking-widest">Support Chat</span>
                </div>
                <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {chatMessages.filter(m => m.senderEmail === user.email || (m.isAdminReply && m.text.includes(user.email))).map(m => (
                  <div key={m.id} className={`flex flex-col ${m.isAdminReply ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-[10px] font-bold ${m.isAdminReply ? 'bg-slate-800 text-slate-300 rounded-tl-none' : 'bg-cyan-600 text-white rounded-tr-none shadow-lg'}`}>
                      {m.isAdminReply ? m.text.replace(`[To: ${user.email}] `, '') : m.text}
                    </div>
                  </div>
                ))}
                {chatMessages.filter(m => m.senderEmail === user.email || (m.isAdminReply && m.text.includes(user.email))).length === 0 && (
                  <p className="text-center py-10 text-[9px] text-slate-700 font-black uppercase tracking-widest">Type a message to start audit support</p>
                )}
              </div>
              <div className="p-4 border-t border-slate-800 flex gap-2 bg-slate-950/50 rounded-b-[32px]">
                <input 
                  type="text" 
                  placeholder="Ask for help..." 
                  value={userChatText}
                  onChange={(e) => setUserChatText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage(userChatText)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[10px] text-white outline-none focus:border-cyan-500 font-bold"
                />
                <button onClick={() => handleSendChatMessage(userChatText)} className="at-btn bg-cyan-600 w-10 h-10 rounded-xl flex items-center justify-center text-white">
                  <i className="fas fa-paper-plane text-xs"></i>
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowChat(true)} className="at-btn w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-950/50 group border border-cyan-400/20">
              <i className="fas fa-comment-dots text-white text-2xl group-hover:scale-110 transition-transform"></i>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-slate-950 animate-bounce"></div>
            </button>
          )}
        </div>
      )}

      {selectedTournament && (
        <JoinModal 
          tournament={selectedTournament} onClose={() => setSelectedTournament(null)} 
          onSubmit={(gameId, gameUid, txnId) => {
            const newReg: Registration = {
              id: Math.random().toString(36).substr(2, 9), tournamentId: selectedTournament.id, userId: user.id, userName: user.name, userEmail: user.email, gameId, gameUid, transactionId: txnId, status: RegistrationStatus.PENDING, timestamp: Date.now()
            };
            setRegistrations(prev => [...prev, newReg]);
            setSelectedTournament(null);
            alert('Audit ongoing. Your Slot No. will be assigned on approval.');
          }} 
          upiId={appSettings.upiId}
        />
      )}
    </div>
  );
};

export default App;
