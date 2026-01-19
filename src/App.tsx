import React, { useState, useEffect } from 'react';

/* =====================
   TEMP SAFE TYPES
   ===================== */
type User = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  walletBalance: number;
};

type Tournament = {
  id: string;
  name: string;
};

const ADMIN_EMAIL = 'admin@example.com';

/* =====================
   APP
   ===================== */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setUser({
      id: '1',
      email: ADMIN_EMAIL,
      name: 'Admin',
      isAdmin: true,
      walletBalance: 0,
    });

    setTournaments([
      { id: 't1', name: 'BGMI Scrim #1' },
      { id: 't2', name: 'BGMI Scrim #2' },
    ]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-cyan-600 rounded-xl font-bold"
        >
          Login (Test)
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        AT Scrims – App Running ✅
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tournaments.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4"
          >
            {t.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
