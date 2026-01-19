import React from 'react';
import { Tournament } from './types';
import { Users, Trophy, Coins, Gamepad2 } from 'lucide-react';
import { ASSETS } from './constants';

interface Props {
  tournament: Tournament;
  onJoin: () => void;
  logoUrl: string;
}

const TournamentCard: React.FC<Props> = ({ tournament, onJoin, logoUrl }) => {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      {/* Top Banner Section */}
      <div className="h-44 bg-gradient-to-br from-cyan-900/40 to-[#020617] flex items-center justify-center relative">
        <img 
          src={logoUrl} 
          alt="Game" 
          className="w-24 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" 
        />
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <Gamepad2 size={14} className="text-cyan-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {tournament.game}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <h3 className="text-2xl font-black mb-6 text-white group-hover:text-cyan-400 transition-colors uppercase italic">
          {tournament.title}
        </h3>

        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Trophy size={18} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Prize Pool</p>
              <p className="text-sm font-black text-white">{tournament.prize_pool}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <Coins size={18} className="text-cyan-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Entry Fee</p>
              <p className="text-sm font-black text-white">{tournament.entry_fee}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users size={18} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold">Slots Filled</p>
                <p className="text-[10px] text-white font-bold">{tournament.filled_slots}/{tournament.slots}</p>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full transition-all duration-1000" 
                  style={{ width: `${(tournament.filled_slots / tournament.slots) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onJoin}
          className="w-full bg-white/5 border border-white/10 text-white font-black py-4 rounded-2xl group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:border-transparent group-hover:shadow-[0_10px_20px_rgba(6,182,212,0.2)] transition-all active:scale-95 uppercase italic tracking-tighter"
        >
          Join Tournament
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
