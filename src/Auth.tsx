import React, { useState } from 'react';
import { ADMIN_EMAIL, ADMIN_PASSWORD, ASSETS } from './constants';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
  logoUrl: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const playTap = () => {
    const audio = new Audio(ASSETS.clickSound);
    audio.play().catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTap();

    if (isAdminMode) {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin(email, 'Super Admin');
      } else {
        alert('Galat Admin Password!');
      }
    } else {
      if (!name || !email) return alert('Naam aur Email bhariye');
      onLogin(email, name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-4 font-sans">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <img src={logoUrl} alt="Logo" className="w-20 h-20 mb-4 animate-pulse" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            {isAdminMode ? 'Admin Access' : 'Welcome Player'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isAdminMode && (
            <input
              type="text"
              placeholder="Aapka Naam"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {isAdminMode && (
            <input
              type="password"
              placeholder="Admin Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
          >
            {isAdminMode ? 'Login as Admin' : 'Start Playing'}
          </button>
        </form>

        <button
          onClick={() => { playTap(); setIsAdminMode(!isAdminMode); }}
          className="w-full mt-6 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
        >
          {isAdminMode ? 'Back to Player Login' : 'Are you an Admin?'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
