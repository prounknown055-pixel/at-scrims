import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { ASSETS } from "../constants";

interface AuthProps {
  onLogin: (email: string, name: string) => void;
  logoUrl: string;
}

const ADMIN_EMAIL = "admin@gmail.com"; // ← apna admin email

const Auth: React.FC<AuthProps> = ({ onLogin, logoUrl }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [error, setError] = useState("");

  // 🔵 GOOGLE LOGIN
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // ✅ Cloudflare safe
      },
    });
  };

  // 🔵 FACEBOOK LOGIN
  const loginWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: window.location.origin, // ✅ Cloudflare safe
      },
    });
  };

  // 🔴 ADMIN LOGIN (Email + Password)
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });

    if (error || !data.user) {
      setError("Invalid Credentials. Access Denied.");
      return;
    }

    if (data.user.email === ADMIN_EMAIL) {
      onLogin(data.user.email, "Super Admin");
    } else {
      setError("You are not authorized as Admin.");
      await supabase.auth.signOut();
    }
  };

  // ✅ OAuth Login Detect (Google / Facebook)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const user = session.user;
        onLogin(
          user.email || "",
          user.user_metadata?.full_name || "Player"
        );
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[160px]"></div>

      <div className="max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-2xl p-10 rounded-[48px] border border-cyan-500/20 relative z-10">

        {/* LOGO */}
        <div className="text-center">
          <img
            src={logoUrl || ASSETS.officialLogo}
            className="w-40 mx-auto logo-glow"
          />
          <h2 className="text-3xl font-black text-white mt-4">
            Admin's Tournament
          </h2>
        </div>

        {/* PLAYER LOGIN */}
        {!showAdminLogin ? (
          <div className="space-y-4">
            <button
              onClick={loginWithGoogle}
              className="at-btn w-full py-5 bg-white text-black rounded-2xl font-black"
            >
              Login with Google
            </button>

            <button
              onClick={loginWithFacebook}
              className="at-btn w-full py-5 bg-[#1877F2] text-white rounded-2xl font-black"
            >
              Login with Facebook
            </button>

            <button
              onClick={() => setShowAdminLogin(true)}
              className="block mx-auto text-[10px] text-slate-500 uppercase tracking-widest mt-4"
            >
              Admin Access
            </button>
          </div>
        ) : (
          // ADMIN LOGIN
          <form onSubmit={handleAdminAuth} className="space-y-4">
            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <input
              type="email"
              placeholder="Admin Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-slate-950 text-white"
            />

            <input
              type="password"
              placeholder="Admin Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-slate-950 text-white"
            />

            <button
              type="submit"
              className="at-btn w-full py-4 bg-cyan-600 rounded-xl font-black"
            >
              Verify & Enter
            </button>

            <button
              type="button"
              onClick={() => setShowAdminLogin(false)}
              className="w-full text-xs text-slate-500"
            >
              Back to Player Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
