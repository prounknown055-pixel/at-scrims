import React from 'react';
import {
  Tournament,
  Registration,
  ChatMessage,
  AppSettings,
  WithdrawalRequest,
} from './types';

interface Props {
  tournaments: Tournament[];
  registrations: Registration[];
  chatMessages: ChatMessage[];
  appSettings: AppSettings;
  withdrawals: WithdrawalRequest[];

  onUpdateSettings: (s: AppSettings) => void;
  onSetTournaments: (t: Tournament[]) => void;
  onAddTournament: (t: Tournament) => void;

  onUpdateRegistration: (
    regId: string,
    status: 'APPROVED' | 'REJECTED'
  ) => void;

  onUpdateRoomDetails: (
    tournamentId: string,
    roomId: string,
    roomPass: string
  ) => void;

  onSendReply: (msgId: string, reply: string) => void;

  onDeclareWinner: (tournamentId: string, userId: string) => void;

  onProcessWithdrawal: (
    id: string,
    status: 'APPROVED' | 'REJECTED'
  ) => void;
}

const AdminPanel: React.FC<Props> = ({
  tournaments,
  registrations,
  chatMessages,
  appSettings,
  withdrawals,
  onUpdateSettings,
  onSetTournaments,
  onAddTournament,
  onUpdateRegistration,
  onUpdateRoomDetails,
  onSendReply,
  onDeclareWinner,
  onProcessWithdrawal,
}) => {
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* CLICK SOUND */}
      <audio id="global-click-audio" src="/click.mp3" preload="auto" />

      {/* TOURNAMENT LIST */}
      <section>
        <h2 className="text-xl font-bold mb-4">Tournaments</h2>

        <div className="space-y-3">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-slate-400">
                    {t.filledSlots}/{t.slots} slots
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REGISTRATIONS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Registrations</h2>

        <div className="space-y-3">
          {registrations.map((r) => (
            <div
              key={r.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-700"
            >
              <div className="flex justify-between items-center gap-2">
                <div className="text-sm">
                  {r.gameId} / {r.gameUid}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      playClick();
                      onUpdateRegistration(r.id, 'APPROVED');
                    }}
                    className="px-3 py-1 rounded bg-emerald-600 active:scale-95 transition-transform"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      onUpdateRegistration(r.id, 'REJECTED');
                    }}
                    className="px-3 py-1 rounded bg-red-600 active:scale-95 transition-transform"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WITHDRAWALS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Withdrawals</h2>

        <div className="space-y-3">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              className="p-4 rounded-xl bg-slate-900 border border-slate-700 flex justify-between items-center"
            >
              <div className="text-sm">
                {w.userName} • ₹{w.amount}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playClick();
                    onProcessWithdrawal(w.id, 'APPROVED');
                  }}
                  className="px-3 py-1 rounded bg-emerald-600 active:scale-95 transition-transform"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    playClick();
                    onProcessWithdrawal(w.id, 'REJECTED');
                  }}
                  className="px-3 py-1 rounded bg-red-600 active:scale-95 transition-transform"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
