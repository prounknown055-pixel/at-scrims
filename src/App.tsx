import React, { useState, useEffect, useRef } from 'react';
import Auth from './Auth';
import Navbar from './Navbar';
import TournamentCard from './TournamentCard';
import JoinModal from './JoinModal';
import AdminPanel from './AdminPanel';

import {
  Tournament,
  Registration,
  ChatMessage,
  AppSettings,
  WithdrawalRequest,
} from './types';

/* 🔒 ADMIN EMAIL */
const ADMIN_EMAIL = 'tournamentsakamao@gmail.com';

const App: React.FC = () => {
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);

  /* DATA */
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  const [settings, setSettings] = useState<AppSettings>({
    backgroundMusic: true,
    tapSound: true,
    isMaintenanceMode: false,
  });

  /* 🔊 AUDIO */
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const tapSoundRef = useRef<HTMLAudioElement | null>(null);

  /* ===================== LOAD FROM STORAGE ===================== */
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('at_user');
      const savedSettings = localStorage.getItem('at_settings');

      if (savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        setIsAdmin(u.email === ADMIN_EMAIL);
      }

      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch {}
  }, []);

  /* ===================== SAVE TO STORAGE ===================== */
  useEffect(() => {
    if (user) {
      localStorage.setItem('at_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('at_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('at_settings', JSON.stringify(settings));
  }, [settings]);

  /* ===================== AUDIO INIT ===================== */
  useEffect(() => {
    bgMusicRef.current = new Audio('/bg-music.mp3');
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.15;

    tapSoundRef.current = new Audio('/click.mp3');
    tapSoundRef.current.volume = 0.4;
  }, []);

  useEffect(() => {
    if (!bgMusicRef.current) return;

    if (settings.backgroundMusic) {
      bgMusicRef.current.play().catch(() => {});
    } else {
      bgMusicRef.current.pause();
    }
  }, [settings.backgroundMusic]);

  /* ===================== LOGIN ===================== */
  const handleLogin = (email: string, name: string) => {
    const u = { email, name };
    setUser(u);
    setIsAdmin(email === ADMIN_EMAIL);
  };

  /* ===================== LOGOUT ===================== */
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  /* ===================== MAINTENANCE MODE ===================== */
  if (settings.isMaintenanceMode && (!user || !isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <div className="glass p-6 rounded-xl text-center max-w-sm">
          <h2 className="text-xl font-bold mb-2">Maintenance Mode</h2>
          <p className="text-slate-400 text-sm">
            App is under maintenance.<br />
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  /* ===================== AUTH ===================== */
  if (!user) {
    return (
      <Auth
        logoUrl="/logo.png"
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* ================= ADMIN ================= */}
      {isAdmin ? (
        <AdminPanel
          tournaments={tournaments}
          registrations={registrations}
          chatMessages={chatMessages}
          withdrawals={withdrawals}
          appSettings={settings}
          onUpdateSettings={setSettings}
          onSetTournaments={setTournaments}
          onAddTournament={(t) => setTournaments((p) => [...p, t])}
          onUpdateRegistration={(id, status) => {
            setRegistrations((p) =>
              p.map((r) => (r.id === id ? { ...r, status } : r))
            );
          }}
          onUpdateRoomDetails={(id, roomId, roomPass) => {
            setTournaments((p) =>
              p.map((t) =>
                t.id === id ? { ...t, roomId, roomPass } : t
              )
            );
          }}
          onSendReply={(id, reply) => {
            setChatMessages((p) =>
              p.map((m) => (m.id === id ? { ...m, reply } : m))
            );
          }}
          onDeclareWinner={(tid, uid) => {
            console.log('Winner:', tid, uid);
          }}
          onProcessWithdrawal={(id, status) => {
            setWithdrawals((p) =>
              p.map((w) => (w.id === id ? { ...w, status } : w))
            );
          }}
        />
      ) : (
        <>
          {/* ================= USER ================= */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onJoin={() => setSelectedTournament(t)}
              />
            ))}
          </div>

          {selectedTournament && (
            <JoinModal
              tournament={selectedTournament}
              onClose={() => setSelectedTournament(null)}
              onJoin={(data) => {
                setRegistrations((p) => [
                  ...p,
                  {
                    id: Date.now().toString(),
                    ...data,
                    status: 'PENDING',
                  },
                ]);
                setSelectedTournament(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
