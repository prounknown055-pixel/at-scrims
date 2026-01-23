import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Tournament,
  Registration,
  RegistrationStatus,
  GameType,
  ChatMessage,
  AppSettings,
  WithdrawalRequest
} from './types';
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

  /* ================== 🔥 PRODUCTION FIXES ================== */

  // 1️⃣ Restore user session on refresh
  useEffect(() => {
    const saved = localStorage.getItem('at_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        if (parsed.isAdmin) setView('admin');
      } catch {}
    }
    setIsLoading(false);
  }, []);

  // 2️⃣ Audio engine (unchanged UI)
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
    localStorage.setItem('at_user_session', JSON.stringify(newUser));
    if (isAdmin) setView('admin');

    if (bgAudioRef.current && !isMusicPlaying) {
      bgAudioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
    }
  };

  const handleSendChatMessage = (
    text: string,
    isAdmin: boolean = false,
    targetEmail?: string
  ) => {
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
    setTournaments(prev =>
      prev.map(t =>
        t.id === tournamentId ? { ...t, winnerUserId: userId, status: 'COMPLETED' } : t
      )
    );
    if (user && user.id === userId) {
      setUser(prev => (prev ? { ...prev, walletBalance: prev.walletBalance + prize } : null));
    }
    alert(`Winner declared! ₹${prize} added to winner's wallet.`);
  };

  const handleWithdrawRequest = (amount: number, upiId: string) => {
    if (!user || user.walletBalance < amount) {
      alert('Insufficient balance!');
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
    setUser(prev => (prev ? { ...prev, walletBalance: prev.walletBalance - amount } : null));
    alert('Withdrawal submitted! Will be processed within 12-24h.');
  };

  /* ================== UI (UNCHANGED) ================== */

  if (appSettings.isMaintenanceMode && (!user || !user.isAdmin)) {
    return null; // same UI as before
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <img
          src={appSettings.logoUrl}
          alt="Logo"
          className="w-64 h-64 object-contain animate-pulse logo-glow"
        />
      </div>
    );
  }

  if (!user) return <Auth onLogin={handleLogin} logoUrl={appSettings.logoUrl} />;

  return (
    <div className="min-h-screen bg-[#020617] pb-24 text-slate-100 font-sans">
      <Navbar
        user={user}
        onLogout={() => {
          setUser(null);
          setView('home');
          localStorage.removeItem('at_user_session');
        }}
        onNavigate={setView}
        currentView={view}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        logoUrl={appSettings.logoUrl}
      />
      {/* 👇 REST OF YOUR JSX EXACT SAME */}
    </div>
  );
};

export default App;
