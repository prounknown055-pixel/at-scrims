import React, { useState } from 'react';
import { X, QrCode, ShieldCheck } from 'lucide-react';
import { Tournament } from './types';
import { ASSETS } from './constants';

interface JoinModalProps {
  tournament: Tournament;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ tournament, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ gameId: '', gameUid: '', transactionId: '' });

  const playTap = () => {
    new Audio(ASSETS.clickSound).play().catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTap();
    if (!formData.gameId || !formData.transactionId) return alert('Puri details bhariye!');
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f172a] w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden relative">
        {/* Close Button */}
        <button 
          onClick={() => { playTap(); onClose(); }}
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 transition-all"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black mb-2 text-white uppercase tracking-tighter">Join: {tournament.title}</h2>
          <p className="text-gray-400 text-sm mb-6">Details bhariye aur payment confirm kijiye.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="In-Game Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                value={formData.gameId}
                onChange={(e) => setFormData({...formData, gameId: e.target.value})}
              />
              <input
                type="text"
                placeholder="Game UID"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 outline-none transition-all"
                value={formData.gameUid}
                onChange={(e) => setFormData({...formData, gameUid: e.target.value})}
              />
            </div>

            {/* Payment Section */}
            <div className="bg-white/5 border border-dashed border-white/20 rounded-2xl p-4 flex flex-col items-center gap-4">
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Scan to Pay: {tournament.entry_fee}</span>
              </div>
              <img 
                src={ASSETS.qrPlaceholder} 
                alt="Payment QR" 
                className="w-40 h-40 rounded-xl border-4 border-white shadow-xl"
              />
              <input
                type="text"
                placeholder="Transaction ID / UTR Number"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:border-green-500 outline-none transition-all"
                value={formData.transactionId}
                onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 uppercase"
            >
              Confirm Registration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;
