import React, { useState } from "react";
import { Tournament } from "./types";

interface JoinModalProps {
  tournament: Tournament;
  onClose: () => void;
  onSubmit: (gameId: string, gameUid: string, txnId: string) => void;
}

const JoinModal: React.FC<JoinModalProps> = ({
  tournament,
  onClose,
  onSubmit,
}) => {
  const [gameId, setGameId] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!tournament) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!gameId.trim()) {
      setError("Game ID is required");
      return;
    }

    if (!gameUid.trim()) {
      setError("Game UID is required");
      return;
    }

    if (!txnId.trim()) {
      setError("Transaction ID is required");
      return;
    }

    setLoading(true);

    // 🔐 Future: server / Supabase validation yahin lagegi
    setTimeout(() => {
      onSubmit(
        gameId.trim(),
        gameUid.trim(),
        txnId.trim()
      );
      setLoading(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md bg-[#020617] border border-slate-800 rounded-xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Join Tournament
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* TOURNAMENT INFO */}
        <div className="mb-4 text-sm text-slate-300 space-y-1">
          <div className="flex justify-between">
            <span>Game</span>
            <span>{tournament.game}</span>
          </div>
          <div className="flex justify-between">
            <span>Entry Fee</span>
            <span>₹{tournament.entryFee}</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">
              In-Game ID
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:border-cyan-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              In-Game UID
            </label>
            <input
              type="text"
              value={gameUid}
              onChange={(e) => setGameUid(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:border-cyan-500"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Payment Transaction ID
            </label>
            <input
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:outline-none focus:border-cyan-500"
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
            {loading ? "Submitting..." : "Confirm Join"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinModal;
