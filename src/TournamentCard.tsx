import React, { useState } from 'react';
import { Tournament, RegistrationStatus } from './types';
import { ASSETS } from './constants';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: () => void; // ✅ FIXED (no id mismatch)
  userStatus?: RegistrationStatus;
  slotNumber?: number;
  logoUrl: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onJoin,
  userStatus,
  slotNumber,
  logoUrl,
}) => {
  const [showRoomInfo, setShowRoomInfo] = useState(false);

  const isFull = tournament.filledSlots >= tournament.slots;
  const isApproved = userStatus === RegistrationStatus.APPROVED;
  const isPending = userStatus === RegistrationStatus.PENDING;

  /* 🔊 TAP SOUND */
  const playClick = () => {
    const audio = document.getElementById(
      'global-click-audio'
    ) as HTMLAudioElement | null;

    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const handleJoin = () => {
    if (isFull || isPending || isApproved) return;
    playClick();
    onJoin();
  };

  return (
    <div className="relative flex flex-col h-full glass rounded-3xl p-5 overflow-hidden border border-cyan-500/10">
      {/* BG */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src={ASSETS.cardBg}
          alt=""
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* CONTENT */}
      <div className="relative flex flex-col h-full z-10">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={logoUrl}
            alt="logo"
            className="w-10 h-10 object-contain select-none"
            draggable={false}
          />
          <div>
            <h3 className="font-bold text-lg">{tournament.name}</h3>
            <p className="text-xs text-cyan-400">
              {tournament.game}
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-300 mb-4">
          Entry: ₹{tournament.entryFee} • Prize: ₹{tournament.prize}
        </div>

        <div className="text-xs text-slate-400 mb-6">
          Slots: {tournament.filledSlots}/{tournament.slots}
        </div>

        {/* JOIN BUTTON */}
        <button
          type="button"
          onClick={handleJoin}
          disabled={isFull || isPending || isApproved}
          className={`at-btn mt-auto w-full py-5 rounded-[28px] text-[11px] uppercase tracking-[0.2em] shadow-2xl border transition-transform active:scale-95 ${
            isApproved
              ? 'bg-emerald-600 text-white border-emerald-500/20 shadow-none'
              : isPending
              ? 'bg-slate-800 text-cyan-400 border-cyan-500/20 shadow-none'
              : isFull
              ? 'bg-slate-800 text-slate-600 border-slate-700 shadow-none'
              : 'bg-cyan-600 text-white border-cyan-400/20 shadow-cyan-950'
          }`}
        >
          {isApproved
            ? 'Arena Entry Verified'
            : isPending
            ? 'Audit Pending'
            : isFull
            ? 'Lobby Full'
            : 'Join Match'}
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
