import React, { useState } from "react";

interface AuthProps {
  onLogin: (email: string, name: string) => void;
  logoUrl: string;
}

const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    // 🔐 Future: Supabase / Firebase auth yahin lagega
    setTimeout(() => {
      onLogin(email.trim().toLowerCase(), name.trim());
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white px-4">
      <div className="w-full max-w-md bg-[#020617] border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <img
            src={logoUrl}
            alt="Logo"
            className="w-20 h-20 mb-3"
            draggable={false}
          />
          <h1 className="text-xl font-semibold">AT Scrims</h1>
          <p className="text-sm text-slate-400">
            Login to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">
              Name
            </label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:border-cyan-500"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:border-cyan-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* 🔮 Future OAuth placeholder */}
        <div className="mt-4 text-center text-xs text-slate-500">
          Google / Facebook login coming soon
        </div>
      </div>
    </div>
  );
};

export default Auth;
