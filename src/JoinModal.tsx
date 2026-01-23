
import React, { useState } from 'react';
import { Tournament } from '../types';
import { ASSETS, PAYMENT_DETAILS } from '../constants';

interface JoinModalProps {
  tournament: Tournament;
  onClose: () => void;
  onSubmit: (gameId: string, gameUid: string, txnId: string) => void;
  upiId?: string;
}

const JoinModal: React.FC<JoinModalProps> = ({ tournament, onClose, onSubmit, upiId }) => {
  const [step, setStep] = useState(1);
  const [gameId, setGameId] = useState('');
  const [gameUid, setGameUid] = useState('');
  const [txnId, setTxnId] = useState('');

  const activeUpiId = upiId || PAYMENT_DETAILS.upiId;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      if (txnId.length < 6) {
        alert("Enter valid Transaction UTR.");
        return;
      }
      onSubmit(gameId, gameUid, txnId);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-slate-900 w-full max-w-md rounded-[56px] overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.8)] border border-slate-800 flex flex-col max-h-[90vh]">
        
        <div className="p-10 border-b border-slate-800/50 flex justify-between items-center bg-slate-950/30">
          <div>
            <h3 className="text-3xl font-black italic uppercase leading-none tracking-tighter text-white">Registration</h3>
            <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.4em] mt-2">Arena Entry</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-slate-900 rounded-[20px] flex items-center justify-center text-slate-500 hover:text-white transition-colors border border-slate-800">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="overflow-y-auto p-10 no-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="bg-slate-950/60 p-6 rounded-[32px] border border-slate-800 shadow-inner">
                  <p className="text-xl font-black text-white italic tracking-tighter uppercase mb-2">{tournament.title}</p>
                  <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">{tournament.game} Scrim</p>
                </div>

                {/* Field 1: IGN */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">In-Game Name (IGN)</label>
                  <input 
                    type="text" required
                    value={gameId}
                    onChange={e => setGameId(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-800 transition-all"
                    placeholder="e.g. Mortal_YT"
                  />
                </div>

                {/* Field 2: UID */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Character UID (Numeric)</label>
                  <input 
                    type="text" required
                    value={gameUid}
                    onChange={e => setGameUid(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none font-bold placeholder:text-slate-800 transition-all"
                    placeholder="e.g. 5129304812"
                  />
                  <p className="text-[9px] text-slate-700 font-black uppercase tracking-widest ml-2">Verify numeric ID from profile.</p>
                </div>

                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 py-5 rounded-[28px] font-black text-lg shadow-2xl shadow-cyan-950/50 active:scale-95 transition-all uppercase italic tracking-tighter">
                  Next Step
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="bg-cyan-500/5 border border-cyan-500/20 p-5 rounded-[28px] text-center">
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed px-2 italic">
                    Manual audit active. Verification window: <span className="text-white font-black">24 HOURS</span>.
                  </p>
                </div>

                <div className="text-center space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">Pay <span className="text-white font-black">₹{tournament.entryFee}</span> to join</p>
                    <div className="bg-white p-4 inline-block rounded-[40px] shadow-2xl mb-6 border-[8px] border-slate-950 group">
                      <img src={ASSETS.qrPlaceholder} alt="QR" className="w-48 h-48 group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="bg-slate-950/80 p-5 rounded-[24px] border border-slate-800 flex items-center justify-between gap-4 shadow-inner">
                      <span className="text-xs font-mono text-cyan-500 truncate font-black tracking-tight">{activeUpiId}</span>
                      <button 
                        type="button" 
                        onClick={() => { navigator.clipboard.writeText(activeUpiId); alert('UPI Copied!'); }} 
                        className="text-[10px] font-black uppercase text-white bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 active:bg-slate-700 transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="text-left space-y-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Transaction UTR (12 Digits)</label>
                    <input 
                      type="text" required
                      value={txnId}
                      onChange={e => setTxnId(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none font-mono font-black placeholder:text-slate-900 tracking-[0.2em]"
                      placeholder="UTR NUMBER"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-950 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest text-slate-600 border border-slate-800">Back</button>
                  <button type="submit" className="flex-[2] bg-cyan-600 hover:bg-cyan-500 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.1em] shadow-2xl active:scale-95 transition-all">Submit Payment</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;
