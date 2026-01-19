import React, { useEffect, useRef, useState } from "react";
import {
  User,
  Tournament,
  Registration,
  RegistrationStatus,
  ChatMessage,
  AppSettings,
  WithdrawalRequest,
} from "./types";
import { ADMIN_EMAIL, ASSETS } from "./constants";

import Navbar from "./Navbar";
import Auth from "./Auth";
import TournamentCard from "./TournamentCard";
import AdminPanel from "./AdminPanel";
import JoinModal from "./JoinModal";

const App: React.FC = () => {
  /* -------------------- AUTH / VIEW -------------------- */
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<"home" | "admin" | "wallet">("home");

  /* -------------------- UI STATES -------------------- */
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  /* -------------------- DATA STATES -------------------- */
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

  /* -------------------- SETTINGS -------------------- */
  const [appSettings, setAppSettings] = useState<AppSettings>({
    logoUrl: ASSETS.officialLogo,
    bgMusicUrl: ASSETS.bgMusic,
    clickSoundUrl: ASSETS.clickSound,
    googleSheetId: "",
    paymentMode: "MANUAL",
    upiId: "tournamentsakamao@upi",
    isMaintenanceMode: false,
  });

  /* -------------------- AUDIO -------------------- */
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  /* -------------------- LOAD LOCAL STORAGE -------------------- */
  useEffect(() => {
    try {
      const settings = localStorage.getItem("at_settings");
      const tours = localStorage.getItem("at_tourneys");
      const regs = localStorage.getItem("at_regs");
      const chats = localStorage.getItem("at_chats");
      const wds = localStorage.getItem("at_withdrawals");
      const session = localStorage.getItem("at_user_session");

      if (settings) setAppSettings(JSON.parse(settings));
      if (tours) setTournaments(JSON.parse(tours));
      if (regs) setRegistrations(JSON.parse(regs));
      if (chats) setChatMessages(JSON.parse(chats));
      if (wds) setWithdrawals(JSON.parse(wds));

      if (session) {
        const parsedUser: User = JSON.parse(session);
        setUser(parsedUser);
        if (parsedUser.isAdmin) setView("admin");
      }
    } catch (err) {
      console.error("LocalStorage load error", err);
    }

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  /* -------------------- SAVE LOCAL STORAGE -------------------- */
  useEffect(() => {
    localStorage.setItem("at_tourneys", JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem("at_regs", JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem("at_chats", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem("at_withdrawals", JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    localStorage.setItem("at_settings", JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    if (user)
      localStorage.setItem("at_user_session", JSON.stringify(user));
    else localStorage.removeItem("at_user_session");
  }, [user]);

  /* -------------------- AUDIO INIT -------------------- */
  useEffect(() => {
    if (bgAudioRef.current) bgAudioRef.current.pause();

    bgAudioRef.current = new Audio(appSettings.bgMusicUrl);
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.15;

    clickAudioRef.current = new Audio(appSettings.clickSoundUrl);
    clickAudioRef.current.volume = 0.4;
  }, [appSettings.bgMusicUrl, appSettings.clickSoundUrl]);

  /* -------------------- HANDLERS -------------------- */
  const toggleMusic = () => {
    if (!bgAudioRef.current) return;

    if (isMusicPlaying) {
      bgAudioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      bgAudioRef.current
        .play()
        .then(() => setIsMusicPlaying(true))
        .catch(() => {});
    }
  };

  const handleLogin = (email: string, name: string) => {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      isAdmin,
      walletBalance: 0,
    };

    setUser(newUser);
    if (isAdmin) setView("admin");
  };

  /* -------------------- LOADING -------------------- */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  /* -------------------- AUTH -------------------- */
  if (!user) {
    return <Auth onLogin={handleLogin} logoUrl={appSettings.logoUrl} />;
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Navbar
        user={user}
        currentView={view}
        onNavigate={setView}
        onLogout={() => {
          setUser(null);
          setView("home");
        }}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={toggleMusic}
        logoUrl={appSettings.logoUrl}
      />

      {view === "home" && (
        <main className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((t) => (
              <TournamentCard
                key={t.id}
                tournament={t}
                logoUrl={appSettings.logoUrl}
                onJoin={() => setSelectedTournament(t)}
              />
            ))}
          </div>
        </main>
      )}

      {view === "admin" && user.isAdmin && (
        <AdminPanel
          tournaments={tournaments}
          registrations={registrations}
          chatMessages={chatMessages}
          withdrawals={withdrawals}
          appSettings={appSettings}
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
            if (!user) return;

            const newReg: Registration = {
              id: crypto.randomUUID(),
              userId: user.id,
              tournamentId: selectedTournament.id,
              gameId,
              gameUid,
              transactionId: txnId,
              status: RegistrationStatus.PENDING,
            };

            setRegistrations((p) => [...p, newReg]);
            setSelectedTournament(null);
            alert("Registration submitted!");
          }}
        />
      )}
    </div>
  );
};

export default App;
