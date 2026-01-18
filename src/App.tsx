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
    isMaintenanceMode: false,
  });

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const savedSettings = localStorage.getItem('at_settings');
    if (savedSettings) setAppSettings(JSON.parse(savedSettings));

    const savedTournaments = localStorage.getItem('at_tourneys');
    const savedRegs = localStorage.getItem('at_regs');
    const savedChats = localStorage.getItem('at_chats');
    const savedWithdrawals = localStorage.getItem('at_withdrawals');
    const savedUser = localStorage.getItem('at_user_session');

    if (savedTournaments) setTournaments(JSON.parse(savedTournaments));
    if (savedRegs) setRegistrations(JSON.parse(savedRegs));
    if (savedChats) setChatMessages(JSON.parse(savedChats));
    if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      if (parsedUser.isAdmin) setView('admin');
    }

    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
    if (user)
      localStorage.setItem('at_user_session', JSON.stringify(user));
    else localStorage.removeItem('at_user_session');
  }, [user]);

  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.pause();
    bgAudioRef.current = new Audio(appSettings.bgMusicUrl);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.15;

    clickAudioRef.current = new Audio(appSettings.clickSoundUrl);
    clickAudioRef.current.volume = 0.4;
  }, [appSettings.bgMusicUrl, appSettings.clickSoundUrl]);

  const toggleMusic = () => {
    if (!bgAudioRef.current) return;
    if (isMusicPlaying) {
      bgAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      bgAudioRef.current.play().then(() => setIsMusicPlaying(true));
    }
  };

  const handleLogin = (email: string, name: string) => {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      isAdmin,
      walletBalance: 0,
    };
    setUser(newUser);
    if (isAdmin) setView('admin');
  };

  const handleWithdrawRequest = (amount: number, upiId: string) => {
    if (!user || user.walletBalance < amount) {
      alert('Insufficient balance');
      return;
    }
    const req: WithdrawalRequest = {
      id: Math.random().toString(36).substring(2, 9),
      userId: user.id,
      userName: user.name,
      amount,
      upiId,
      status: 'PENDING',
      timestamp: Date.now(),
    };
    setWithdrawals((p) => [req, ...p]);
    setUser((p) => (p ? { ...p, walletBalance: p.walletBalance - amount } : p));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!user) return <Auth onLogin={handleLogin} logoUrl={appSettings.logoUrl} />;

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
          onProcessWithdrawal={() => {}}
        />
      )}

      {selectedTournament && (
        <JoinModal
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          onSubmit={(gameId, gameUid, txnId) => {
            if (!user || !selectedTournament) return;

            const newReg: Registration = {
              id: Math.random().toString(36).substring(2, 9),
              userId: user.id,
              tournamentId: selectedTournament.id,
              gameId,
              gameUid,
              transactionId: txnId,
              status: RegistrationStatus.PENDING,
              slotNumber: undefined,
            };

            setRegistrations((p) => [...p, newReg]);
            setSelectedTournament(null);
            alert('Registration submitted!');
          }}
        />
      )}
    </div>
  );
};

export default App;
