import React, { useState } from "react";
import { Tournament } from "../types";
import { ASSETS, PAYMENT_DETAILS } from "../constants";
import { supabase } from "../supabaseClient";

interface JoinModalProps {
  tournament: Tournament;
  onClose: () => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ tournament, onClose }) => {
  const [step, setStep] = useState(1);
  const [gameId, setGameId] = useState("");
  const [gameUid, setGameUid] = useState("");
  const [txnId, setTxnId] = useState("");
  const [loading, setLoading] = useState(false);

  const activeUpiId = PAYMENT_DETAILS.upiId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (txnId.length < 6) {
      alert("Enter valid Transaction UTR");
      return;
    }

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
      ign: gameId,
      game_uid: gameUid,
      utr: txnId,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Registration submitted. Waiting for approval.");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-xl">
      <div className="bg-slate-900 w-full max-w-md rounded-[56px] overflow-hidden border border-slate-800 flex flex-col max-h-[90vh]">
        <div className="p-10 border-b border-slate-800/50 flex justify-between items-center">
          <h3 className="text-3xl font-black italic uppercase text-white">
            Registration
          </h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-10 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 ? (
              <>
                <input
                  required
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  placeholder="In Game Name"
                  className="w-full p-4 rounded-xl bg-slate-950 text-white"
                />

                <input
                  required
                  value={gameUid}
                  onChange={(e) => setGameUid(e.target.value)}
                  placeholder="Game UID"
                  className="w-full p-4 rounded-xl bg-slate-950 text-white"
                />

                <button className="w-full bg-cyan-600 py-4 rounded-xl font-black">
                  Next
                </button>
              </>
            ) : (
              <>
                <img
                  src={ASSETS.qrPlaceholder}
                  className="w-48 mx-auto"
                />

                <input
                  required
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="Transaction UTR"
                  className="w-full p-4 rounded-xl bg-slate-950 text-white"
                />

                <button
                  disabled={loading}
                  className="w-full bg-cyan-600 py-4 rounded-xl font-black"
                >
                  {loading ? "Submitting..." : "Submit Payment"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinModal;
