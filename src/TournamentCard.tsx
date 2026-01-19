import React from "react";
import { Tournament } from "./types";

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: () => void;
  logoUrl: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onJoin,
  logoUrl,
}) => {
  // 🛡 Safety checks (runtime crash prevention)
  if (!tournament) return null;

  const {
    title,
    game,
    entryFee,
    prizePool,
    maxPlayers,
    registeredPlayers,
    startTime,
  } = tournament;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500 transition">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={logoUrl}
          alt="Logo"
          className="w-10 h-10"
          draggable={false}
        />
        <div>
          <h3 className="font-semibold text-lg leading-tight">
            {title || "Tournament"}
          </h3>
          <p className="text-sm text-slate-400">
            {game || "Game"}
          </p>
        </div>
      </div>

      {/* INFO */}
      <div className="space-y-2 text-sm text-slate-300">
        <div className="flex justify-between">
          <span>Entry Fee</span>
          <span className="font-medium">
            ₹{entryFee ?? 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Prize Pool</span>
          <span className="font-medium text-green-400">
            ₹{prizePool ?? 0}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Slots</span>
          <span>
            {registeredPlayers ?? 0}/{maxPlayers ?? 0}
          </span>
        </div>

        {startTime && (
          <div className="flex justify-between">
            <span>Start</span>
            <span>
              {new Date(startTime).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={onJoin}
        className="mt-5 w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition font-medium"
      >
        Join Tournament
      </button>
    </div>
  );
};

export default TournamentCard;
