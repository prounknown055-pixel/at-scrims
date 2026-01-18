import React, { useState, useEffect } from 'react';
import { Tournament, RegistrationStatus } from '../types';
import { ASSETS } from './constants';

interface TournamentCardProps {
  tournament: Tournament;
  onJoin: (id: string) => void;
  userStatus?: RegistrationStatus;
  slotNumber?: number;
  logoUrl: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onJoin, userStatus, slotNumber, logoUrl }) => {
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const isFull = tournament.filledSlots >= tournament.slots;
  const isApproved = userStatus === RegistrationStatus.APPROVED;
  const isPending = userStatus === RegistrationStatus.PENDING;

  useEffect(() => {
    if (!isApproved) return;
    
    const checkTime = () => {
      const matchTime = new Date(tournament.startTime).getTime();
      const now = new Date().getTime();
      const diffMinutes = (matchTime - now) / (1000 * 60);
      
      // Reveal 15 mins before
      if (diffMinutes <= 15 && diffMinutes > -120) {
        setShowRoomInfo(true);
      } else {
        setShowRoomInfo(false);
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 30000);
    return () => clearInterval(timer);
  }, [isApproved, tournament.startTime]);

  return (
    <div className="bg-slate-900/60 rounded-[40px] overflow-hidden border border-slate-800/80 hover:border-cyan-500/40 transition-all duration-500 group flex flex-col h-full shadow-2xl relative backdrop-blur-sm">
      <div className="relative h-48 bg-slate-950/40 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 z-10"></div>
        <div className="absolute top-5 left-5 z-20 flex flex-col gap-2">
          <span className="bg-cyan-600 text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.1em] shadow-xl">{tournament.game}</span>
          <span className="bg-slate-950 text-cyan-400 text-[8px] font-black px-3 py-1.5 rounded-lg uppercase border border-cyan-500/20">{tournament.mode}</span>
        </div>
        
        {isApproved && slotNumber && (
          <div className="absolute top-5 right-5 z-20 animate-bounce">
            <span className="bg-emerald-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase italic shadow-2xl border border-emerald-400/20">Slot {slotNumber}</span>
          </div>
        )}

        <div className="z-0 transition-all duration-700 group-hover:scale-110 opacity-10 group-hover:opacity-20 flex items-center justify-center">
          <img src={logoUrl || ASSETS.officialLogo} alt="AT Logo" className="w-40 h-40 object-contain grayscale brightness-200" onError={(e) => { e.currentTarget.src = ASSETS.officialLogo; }} />
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-black mb-1 truncate italic uppercase text-white leading-tight">{tournament.title}</h3>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-8">
          <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest flex items-center gap-1.5">
            <i className="far fa-calendar-alt"></i> {tournament.day}, {tournament.date}
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <i className="far fa-clock text-cyan-500"></i> {tournament.time}
          </p>
        </div>

        {showRoomInfo && isApproved ? (
          <div className="mb-6 bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-[28px] animate-in zoom-in duration-500">
             <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Room Info Released</p>
             <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-inner">
                <p className="text-xs font-black text-white italic tracking-widest">{tournament.roomDetails || 'Awaiting Admin...'}</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-950/40 p-5 rounded-[24px] border border-slate-800/40">
              <span className="text-slate-600 uppercase text-[9px] font-black tracking-widest block mb-1">Pot Prize</span>
              <span className="text-emerald-400 font-black text-2xl italic">₹{tournament.prizePool}</span>
            </div>
            <div className="bg-slate-950/40 p-5 rounded-[24px] border border-slate-800/40">
              <span className="text-slate-600 uppercase text-[9px] font-black tracking-widest block mb-1">Buy-In</span>
              <span className="text-cyan-500 font-black text-2xl italic">₹{tournament.entryFee}</span>
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between px-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Progress:</span>
            <span className="text-[10px] font-black uppercase text-cyan-400">{tournament.filledSlots} / {tournament.slots} Joined</span>
        </div>

        <button 
          onClick={() => onJoin(tournament.id)}
          disabled={isFull || userStatus !== undefined}
          className={`at-btn mt-auto w-full py-5 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl border ${
            isApproved ? 'bg-emerald-600 text-white border-emerald-500/20 shadow-none' :
            isPending ? 'bg-slate-800 text-cyan-400 border-cyan-500/20 shadow-none' :
            isFull ? 'bg-slate-800 text-slate-600 border-slate-700' : 'bg-cyan-600 text-white border-cyan-400/20 shadow-cyan-950'
          }`}
        >
          {isApproved ? 'Arena Entry Verified' : isPending ? 'Audit Pending' : isFull ? 'Lobby Full' : 'Join Match'}
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
