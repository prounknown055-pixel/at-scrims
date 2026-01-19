import React, { useState } from "react";
import {
  Tournament,
  Registration,
  ChatMessage,
  AppSettings,
  WithdrawalRequest,
  RegistrationStatus,
} from "./types";

interface AdminPanelProps {
  tournaments: Tournament[];
  registrations: Registration[];
  chatMessages: ChatMessage[];
  withdrawals: WithdrawalRequest[];
  appSettings: AppSettings;

  onUpdateSettings: (s: AppSettings) => void;
  onSetTournaments: (t: Tournament[]) => void;
  onAddTournament: (t: Tournament) => void;

  onUpdateRegistration: (id: string, status: RegistrationStatus) => void;
  onUpdateRoomDetails: (id: string, details: string) => void;
  onSendReply: (email: string, text: string) => void;
  onDeclareWinner: (tournamentId: string, userId: string, prize: number) => void;
  onProcessWithdrawal: (id: string, status: "PAID" | "REJECTED") => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  tournaments,
  registrations,
  chatMessages,
  withdrawals,
  appSettings,
  onUpdateSettings,
  onAddTournament,
  onUpdateRegistration,
  onProcessWithdrawal,
}) => {
  /* -------------------- ADD TOURNAMENT STATE -------------------- */
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("");
  const [entryFee, setEntryFee] = useState(0);
  const [prizePool, setPrizePool] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(0);

  /* -------------------- SAFE ADD TOURNAMENT -------------------- */
  const handleAddTournament = () => {
    if (!title.trim() || !game.trim() || maxPlayers <= 0) {
      alert("Please fill all required fields correctly");
      return;
    }

    const newTournament: Tournament = {
      id: crypto.randomUUID(),
      title: title.trim(),
      game: game.trim(),
      entryFee,
      prizePool,
      maxPlayers,
      filledSlots: 0,
      status: "UPCOMING",
      startTime: Date.now(),
    };

    onAddTournament(newTournament);

    setTitle("");
    setGame("");
    setEntryFee(0);
    setPrizePool(0);
    setMaxPlayers(0);
  };

  return (
    <div className="space-y-10">

      {/* ================= SETTINGS ================= */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4 uppercase">App Settings</h2>

        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <label className="text-slate-400">UPI ID</label>
            <input
              value={appSettings.upiId}
              onChange={(e) =>
                onUpdateSettings({ ...appSettings, upiId: e.target.value })
              }
              className="w-full mt-1 p-3 rounded-xl bg-slate-950 border border-slate-800"
            />
          </div>

          <label className="flex items-center gap-3 mt-6 text-sm">
            <input
              type="checkbox"
              checked={appSettings.isMaintenanceMode}
              onChange={(e) =>
                onUpdateSettings({
                  ...appSettings,
                  isMaintenanceMode: e.target.checked,
                })
              }
            />
            Maintenance Mode
          </label>
        </div>
      </section>

      {/* ================= ADD TOURNAMENT ================= */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4 uppercase">
          Add Tournament
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          />
          <input
            placeholder="Game"
            value={game}
            onChange={(e) => setGame(e.target.value)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          />
          <input
            type="number"
            placeholder="Entry Fee"
            value={entryFee}
            onChange={(e) => setEntryFee(Number(e.target.value))}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          />
          <input
            type="number"
            placeholder="Prize Pool"
            value={prizePool}
            onChange={(e) => setPrizePool(Number(e.target.value))}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          />
          <input
            type="number"
            placeholder="Max Players"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800"
          />
        </div>

        <button
          onClick={handleAddTournament}
          className="mt-6 px-6 py-3 bg-cyan-600 rounded-xl font-black uppercase"
        >
          Create Tournament
        </button>
      </section>

      {/* ================= REGISTRATIONS ================= */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4 uppercase">
          Registrations
        </h2>

        {registrations.length === 0 && (
          <p className="text-slate-500 text-sm">No registrations yet</p>
        )}

        <div className="space-y-3">
          {registrations.map((r) => (
            <div
              key={r.id}
              className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800"
            >
              <span className="text-sm">
                {r.userId} → {r.tournamentId}
              </span>

              <select
                value={r.status}
                onChange={(e) =>
                  onUpdateRegistration(
                    r.id,
                    e.target.value as RegistrationStatus
                  )
                }
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs"
              >
                <option value="PENDING">PENDING</option>
                <option value="APPROVED">APPROVED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WITHDRAWALS ================= */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-lg font-black mb-4 uppercase">
          Withdrawals
        </h2>

        {withdrawals.length === 0 && (
          <p className="text-slate-500 text-sm">No withdrawals</p>
        )}

        <div className="space-y-3">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="flex justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800"
            >
              <span className="text-sm">
                {w.userName} – ₹{w.amount}
              </span>

              {w.status === "PENDING" ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => onProcessWithdrawal(w.id, "PAID")}
                    className="px-3 py-1 bg-emerald-600 rounded text-xs"
                  >
                    Pay
                  </button>
                  <button
                    onClick={() => onProcessWithdrawal(w.id, "REJECTED")}
                    className="px-3 py-1 bg-rose-600 rounded text-xs"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-xs">{w.status}</span>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
