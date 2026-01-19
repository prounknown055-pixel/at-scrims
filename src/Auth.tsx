import React, { useState } from 'react';
import { supabase } from './supabaseClient';

interface Props {
  onLogin: (email: string, name: string) => void;
  logoUrl: string;
}

const ADMIN_EMAIL = 'tournamentsakamao@gmail.com';
const ADMIN_PASS_EMAIL = 'musicstudio250@gmail.com';

const Auth: React.FC<Props> = ({ onLogin, logoUrl }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passEmail, setPassEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /* ---------------- GOOGLE LOGIN ---------------- */
  const loginWithGoogle = async () => {
    if (loading) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  /* ---------------- FACEBOOK LOGIN ---------------- */
  const loginWithFacebook = async () => {
    if (loading) return;
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  /* ---------------- MANUAL LOGIN (ADMIN ONLY) ---------------- */
  const handleManualLogin = () => {
    if (!name || !email || !passEmail) {
      alert('All fields required');
      return;
    }

    if (
      email.trim().toLowerCase() !== ADMIN_EMAIL ||
      passEmail.trim().toLowerCase() !== ADMIN_PASS_EMAIL
    ) {
      alert('Invalid admin credentials');
      return;
    }

    onLogin(email.trim(), name.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white px-4">
      <img
        src={logoUrl}
        alt="logo"
        className="w-40 h-40 object-contain mb-8"
        draggable={false}
      />

      <button
        onClick={loginWithGoogle}
        className="at-btn w-full max-w-xs bg-white text-black py-3 rounded-2xl font-bold mb-4"
      >
        <i className="fab fa-google mr-2"></i>
        Continue with Google
      </button>

      <button
        onClick={loginWithFacebook}
        className="at-btn w-full max-w-xs bg-blue-600 text-white py-3 rounded-2xl font-bold mb-6"
      >
        <i className="fab fa-facebook mr-2"></i>
        Continue with Facebook
      </button>

      {/* ADMIN LOGIN */}
      <div className="w-full max-w-xs space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Admin Name"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Admin Email"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
        />

        <input
          value={passEmail}
          onChange={(e) => setPassEmail(e.target.value)}
          placeholder="Admin Pass Email"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 outline-none"
        />

        <button
          onClick={handleManualLogin}
          className="at-btn w-full bg-cyan-600 py-3 rounded-2xl font-black"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

export default Auth;
