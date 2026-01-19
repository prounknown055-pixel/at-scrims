import React, { useState } from 'react';
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

  /* MOCK DATA (UI SAME) */
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    backgroundMusic: true,
    tapSound: true,
  });

  /* ✅ LOGIN HANDLER */
  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
    setIsAdmin(email === ADMIN_EMAIL);
  };

  /* ✅ LOGOUT */
  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
  };

  /* 🔒 IF NOT LOGGED IN → AUTH */
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

      {/* 🛡 ADMIN PANEL */}
      {isAdmin ? (
        <AdminPanel
          tournaments={tournaments}
          registrations={registrations}
          chatMessages={chatMessages}
          withdrawals={withdrawals}
          appSettings={settings}
          onUpdateSettings={setSettings}
          onSetTournaments={setTournaments}
          onAddTournament={(t) => setTournaments([...tournaments, t])}
          onUpdateRegistration={(id, status) => {
            setRegistrations((prev) =>
              prev.map((r) =>
                r.id === id ? { ...r, status } : r
              )
            );
          }}
          onUpdateRoomDetails={(id, roomId, roomPass) => {
            setTournaments((prev) =>
              prev.map((t) =>
                t.id === id
                  ? { ...t, roomId, roomPass }
                  : t
              )
            );
          }}
          onSendReply={(id, reply) => {
            setChatMessages((prev) =>
              prev.map((m) =>
                m.id === id ? { ...m, reply } : m
              )
            );
          }}
          onDeclareWinner={(tid, uid) => {
            console.log('Winner:', tid, uid);
          }}
          onProcessWithdrawal={(id, status) => {
            setWithdrawals((prev) =>
              prev.map((w) =>
                w.id === id ? { ...w, status } : w
              )
            );
          }}
        />
      ) : (
        <>
          {/* 🎮 USER SIDE */}
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
                setRegistrations((prev) => [
                  ...prev,
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
