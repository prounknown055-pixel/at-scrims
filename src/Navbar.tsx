import React from "react";
import { User } from "./types";

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: "home" | "admin" | "wallet") => void;
  currentView: "home" | "admin" | "wallet";
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  logoUrl: string;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onNavigate,
  currentView,
  isMusicPlaying,
  onToggleMusic,
  logoUrl,
}) => {
  return (
    <nav className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Logo"
            className="w-9 h-9"
            draggable={false}
          />
          <span className="font-semibold text-lg">
            AT Scrims
          </span>
        </div>

        {/* CENTER */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onNavigate("home")}
            className={`text-sm font-medium transition ${
              currentView === "home"
                ? "text-cyan-400"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Home
          </button>

          {user.isAdmin && (
            <button
              onClick={() => onNavigate("admin")}
              className={`text-sm font-medium transition ${
                currentView === "admin"
                  ? "text-cyan-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Admin
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* Music */}
          <button
            onClick={onToggleMusic}
            title="Toggle Music"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 transition"
          >
            <i
              className={`fa-solid ${
                isMusicPlaying ? "fa-volume-high" : "fa-volume-xmark"
              }`}
            />
          </button>

          {/* User */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-medium">
              {user.name}
            </span>
            <span className="text-xs text-slate-400">
              {user.email}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg text-sm bg-red-600 hover:bg-red-700 transition font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
