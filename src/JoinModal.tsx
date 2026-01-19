import React, { useState } from 'react';
import { Tournament } from './types';

interface Props {
  tournament: Tournament;
  onClose: () => void;
  onSubmit: (gameId: string, gameUid: string, txnId: string) => void;
}

const JoinModal: React.FC<Props> = ({ tournament, onClose, onSubmit }) => {
  const [gameId, setGameId] = useState('');
  const [gameUid, setGameUid] = useState('');
  const [txnId, setTxnId] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = () => {
    playClick();

    if (submitting) return;

    if (!gameId || !gameUid || !txnId) {
      alert('Please fill all fields');
      return;
    }

    setSubmitting(true);

    onSubmit(
      gameId.trim(),
      gameUid.trim(),
      txnId.trim()
    );

    setSubmitting(false);
  };

  const handleClose = () => {
    playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      {/* CLICK SOUND SOURCE */}
      <audio id="global-click-audio" src="/click.mp3" preload="auto" />

      <div className="relative bg-slate-900 rounded-2xl w-full max-w-md p-6 border border-slate-700">
        {/* CLOSE */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 text-xl active:scale-90 transition-transform"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Join {tournament.name}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full px-4 py-2 rounded bg-slate-800 outline-none"
            placeholder="Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 rounded bg-slate-800 outline-none"
            placeholder="Game UID"
            value={gameUid}
            onChange={(e) => setGameUid(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 rounded bg-slate-800 outline-none"
            placeholder="Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="at-btn w-full mt-6 py-3 rounded-xl bg-cyan-600 font-bold active:scale-95 transition-transform disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Confirm Join'}
        </button>
      </div>
    </div>
  );
};

export default JoinModal;
