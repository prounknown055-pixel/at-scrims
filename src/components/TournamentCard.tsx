import React, { useState } from "react";
import { Tournament, RegistrationStatus } from "../types";
import { ASSETS } from "../constants";
import { supabase } from "../supabaseClient";

interface TournamentCardProps {
  tournament: Tournament;
  userStatus?: RegistrationStatus;
  slotNumber?: number;
  logoUrl: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  userStatus,
  slotNumber,
  logoUrl,
}) => {
  const [loading, setLoading] = useState(false);

  const isFull = tournament.filledSlots >= tournament.slots;
  const isApproved = userStatus === RegistrationStatus.APPROVED;
  const isPending = userStatus === RegistrationStatus.PENDING;

  const handleJoin = async () => {
    if (isFull || userStatus) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("tournament_joins").insert({
      tournament_id: tournament.id,
      user_id: user.id,
      status: "pending",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Successfully joined. Waiting for approval.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-900/60 rounded-[40px] overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-500 flex flex-col h-full shadow-2xl relative backdrop-blur-sm">
      <div className="relative h-48 bg-slate-950/40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 z-10" />

        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          <span className="bg-cyan-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase">
            {tournament.game}
          </span>
          <span className="bg-slate-950 text-cyan-400 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase">
            {tournament.mode}
          </span>
        </div>

        {isApproved && slotNumber !== undefined && (
          <div className="absolute top-5 right-5 z-20 animate-bounce">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl">
              Slot {slotNumber}
            </span>
          </div>
        )}

        <img
          src={logoUrl || ASSETS.officialLogo}
          className="w-40 h-40 opacity-10 object-contain"
          onError={(e) => {
            e.currentTarget.src = ASSETS.officialLogo;
          }}
        />
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black italic uppercase text-white">
          {tournament.title}
        </h3>

        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="bg-slate-950/40 p-5 rounded-[24px]">
            <span className="text-[9px] uppercase text-slate-500 font-black">
              Prize
            </span>
            <span className="text-emerald-400 text-2xl font-black">
              ₹{tournament.prizePool}
            </span>
          </div>

          <div className="bg-slate-950/40 p-5 rounded-[24px]">
            <span className="text-[9px] uppercase text-slate-500 font-black">
              Entry
            </span>
            <span className="text-cyan-500 text-2xl font-black">
              ₹{tournament.entryFee}
            </span>
          </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={isFull || userStatus !== undefined || loading}
          className={`mt-auto w-full py-5 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em]
            ${
              isApproved
                ? "bg-emerald-600 text-white"
                : isPending
                ? "bg-slate-800 text-cyan-400"
                : isFull
                ? "bg-slate-800 text-slate-600"
                : "bg-cyan-600 text-white"
            }`}
        >
          {loading
            ? "Joining..."
            : isApproved
            ? "Arena Entry Verified"
            : isPending
            ? "Audit Pending"
            : isFull
            ? "Lobby Full"
            : "Join Match"}
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
