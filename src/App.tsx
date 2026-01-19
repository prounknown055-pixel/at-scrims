import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Tournament,
  Registration,
  RegistrationStatus,
  GameType,
  ChatMessage,
  AppSettings,
  WithdrawalRequest,
} from './types';
import { ADMIN_EMAIL, GAMES, ASSETS } from './constants';
import Navbar from './Navbar';
import Auth from './Auth';
import TournamentCard from './TournamentCard';
import AdminPanel from './AdminPanel';
import JoinModal from './JoinModal';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'home' | 'admin' | 'wallet'>('home');
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [selectedGameFilter, setSelectedGameFilter] =
    useState<GameType | 'All'>('All');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [appSettings, setAppSettings] = useState<AppSettings>({
    logoUrl: ASSETS.officialLogo,
    bgMusicUrl: ASSETS.bgMusic,
    clickSoundUrl: ASSETS.clickSound,
    googleSheetId: '',
    paymentMode: 'MANUAL',
    upiId: 'tournamentsakamao@upi',
    isMaintenanceMode: false,
  });

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  /* ---------------- LOAD SAFE ---------------- */
  useEffect(() => {
    try {
      const s = (k: string) => localStorage.getItem(k);
      if (s('at_settings')) setAppSettings(JSON.parse(s('at_settings')!));
      if (s('at_tourneys')) setTournaments(JSON.parse(s('at_tourneys')!));
      if (s('at_regs')) setRegistrations(JSON.parse(s('at_regs')!));
      if (s('at_chats')) setChatMessages(JSON.parse(s('at_chats')!));
      if (s('at_withdrawals')) setWithdrawals(JSON.parse(s('at_withdrawals')!));
      if (s('at_user_session')) {
        const u = JSON.parse(s('at_user_session')!);
        setUser(u);
        if (u.isAdmin) setView('admin');
      }
    } catch {}

    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  /* ---------------- SAVE SAFE ---------------- */
  useEffect(() => {
    localStorage.setItem('at_tourneys', JSON.stringify(tournaments));
  }, [tournaments]);
  useEffect(() => {
    localStorage.setItem('at_regs', JSON.stringify(registrations));
  }, [registrations]);
  useEffect(() => {
    localStorage.setItem('at_chats', JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem('at_withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);
  useEffect(() => {
    localStorage.setItem('at_settings', JSON.stringify(appSettings));
  }, [appSettings]);
  useEffect(() => {
    user
      ? localStorage.setItem('at_user_session', JSON.stringify(user))
      : localStorage.removeItem('at_user_session');
  }, [user]);

  /* ---------------- AUDIO ENGINE ---------------- */
  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.pause();

    bgAudioRef.current = new Audio(appSettings.bgMusicUrl);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.15;

    clickAudioRef.current = new Audio(appSettings.clickSoundUrl);
    clickAudioRef.current.volume = 0.4;
  }, [appSettings.bgMusicUrl, appSettings.clickSoundUrl]);

  /* 🔊 GLOBAL CLICK SOUND (ALL BUTTONS) */
  useEffect(() => {
    const playClick = () => {
      if (!clickAudioRef.current) return;
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    };
    document.addEventListener('click', playClick);
    document.addEventListener('touchstart', playClick);
    return () => {
      document.removeEventListener('click', playClick);
      document.removeEventListener('touchstart', playClick);
    };
  }, []);

  const toggleMusic = () => {
    if (!bgAudioRef.current) return;
    if (isMusicPlaying) {
      bgAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      bgAudioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  /* ---------------- AUTH ---------------- */
  const handleLogin = (email: string, name: string) => {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    setUser({
      id: crypto.randomUUID(),
      email,
      name,
      isAdmin,
      walletBalance: 0,
    });
    if (isAdmin) setView('admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} logoUrl={appSettings.logoUrl} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar
        user={user}
        onLogout={() => {
          setUser(null);
          setView('home');
        }}
        onNavigate={setView}
        currentView={view}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        logoUrl={appSettings.logoUrl}
      />

      {view === 'home' && (
        <main className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onJoin={() => setSelectedTournament(t)}
                logoUrl={appSettings.logoUrl}
              />
            ))}
          </div>
        </main>
      )}

      {view === 'admin' && user.isAdmin && (
        <AdminPanel
          tournaments={tournaments}
          registrations={registrations}
          chatMessages={chatMessages}
          appSettings={appSettings}
          withdrawals={withdrawals}
          onUpdateSettings={setAppSettings}
          onSetTournaments={setTournaments}
          onAddTournament={(t) => setTournaments((p) => [t, ...p])}
          onUpdateRegistration={() => {}}
          onUpdateRoomDetails={() => {}}
          onSendReply={() => {}}
          onDeclareWinner={() => {}}
          onProcessWithdrawal={(id, status) =>
            setWithdrawals((p) =>
              p.map((w) => (w.id === id ? { ...w, status } : w))
            )
          }
        />
      )}

      {selectedTournament && (
        <JoinModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          onSubmit={(gameId, gameUid, txnId) => {
            if (!user || !selectedTournament) return;
            setRegistrations((p) => [
              ...p,
              {
                id: crypto.randomUUID(),
                userId: user.id,
                tournamentId: selectedTournament.id,
                gameId,
                gameUid,
                transactionId: txnId,
                status: RegistrationStatus.PENDING,
                slotNumber: undefined,
              },
            ]);
            setSelectedTournament(null);
            alert('Registration submitted!');
          }}
        />
      )}
    </div>
  );
};

export default App;
