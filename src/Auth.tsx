import React, { useState, useRef } from 'react';

interface Props {
  onLogin: (email: string, name: string) => void;
  logoUrl: string;
}

/* 🔒 ADMIN FIXED CREDENTIALS */
const ADMIN_EMAIL = 'tournamentsakamao@gmail.com';
const ADMIN_PASS = 'musicstudio250@gmail.com';

const Auth: React.FC<Props> = ({ onLogin, logoUrl }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const isSubmitting = useRef(false);

  /* 🔊 GLOBAL TAP SOUND */
  const playClick = () => {
    const audio = document.getElementById(
      'global-click-audio'
    ) as HTMLAudioElement | null;

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  /* ✅ MAIN LOGIN */
  const handleLogin = () => {
    playClick();

    if (isSubmitting.current) return;
    isSubmitting.current = true;

    setError('');

    if (!email.trim() || !name.trim()) {
      setError('Fill all fields');
      isSubmitting.current = false;
      return;
    }

    /* 🔐 ADMIN STRICT CHECK */
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      if (!password) {
        setError('Admin password required');
        isSubmitting.current = false;
        return;
      }

      if (password !== ADMIN_PASS) {
        setError('Admin password incorrect');
        isSubmitting.current = false;
        return;
      }
    }

    onLogin(email.trim(), name.trim());
    isSubmitting.current = false;
  };

  /* 🌐 GOOGLE LOGIN (CONTROLLED MOCK) */
  const handleGoogleLogin = () => {
    playClick();
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    onLogin('googleuser@gmail.com', 'Google User');
    isSubmitting.current = false;
  };

  /* 🌐 FACEBOOK LOGIN (CONTROLLED MOCK) */
  const handleFacebookLogin = () => {
    playClick();
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    onLogin('facebookuser@gmail.com', 'Facebook User');
    isSubmitting.current = false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
      {/* 🔊 CLICK SOUND */}
      <audio id="global-click-audio" src="/click.mp3" preload="auto" />

      <div className="bg-slate-900 p-6 rounded-xl w-full max-w-sm border border-slate-700">
        <div className="flex flex-col items-center gap-4 mb-4">
          <img
            src={logoUrl}
            alt="logo"
            className="w-20 h-20 object-contain"
            draggable={false}
          />
          <h2 className="text-xl font-bold">Login</h2>
        </div>

        {error && (
          <div className="mb-3 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 px-4 py-2 rounded bg-slate-800 outline-none"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 px-4 py-2 rounded bg-slate-800 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* 🔐 ADMIN PASSWORD ONLY */}
        {email.trim().toLowerCase() === ADMIN_EMAIL && (
          <input
            type="password"
            className="w-full mb-3 px-4 py-2 rounded bg-slate-800 outline-none"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <button
          onClick={handleLogin}
          className="w-full mb-3 py-2 rounded-xl bg-cyan-600 font-bold active:scale-95 transition-transform"
        >
          Login
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleGoogleLogin}
            className="flex-1 py-2 rounded-xl bg-red-600 font-bold active:scale-95 transition-transform"
          >
            Google
          </button>
          <button
            onClick={handleFacebookLogin}
            className="flex-1 py-2 rounded-xl bg-blue-600 font-bold active:scale-95 transition-transform"
          >
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
