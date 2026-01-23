import React, { useState } from 'react';
import { Tournament, Registration, RegistrationStatus, GameType, ChatMessage, AppSettings, WithdrawalRequest } from '../types';
import { GAMES, ASSETS } from '../constants';

interface AdminPanelProps {
  tournaments: Tournament[];
  registrations: Registration[];
  chatMessages: ChatMessage[];
  withdrawals: WithdrawalRequest[];
  appSettings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onSetTournaments: (tournaments: Tournament[]) => void;
  onAddTournament: (tournament: Tournament) => void;
  onUpdateRegistration: (id: string, status: RegistrationStatus) => void;
  onUpdateRoomDetails: (tourneyId: string, details: string) => void;
  onSendReply: (userEmail: string, text: string) => void;
  onDeclareWinner: (tourneyId: string, userId: string, prize: number) => void;
  onProcessWithdrawal: (withdrawId: string, status: 'PAID' | 'REJECTED') => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  tournaments, registrations, chatMessages, withdrawals, appSettings, onUpdateSettings, onSetTournaments, onAddTournament, onUpdateRegistration, onUpdateRoomDetails, onSendReply, onDeclareWinner, onProcessWithdrawal
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'tournaments' | 'matches' | 'chats' | 'settings' | 'payouts'>('approvals');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  
  const [newTourney, setNewTourney] = useState({
    title: '', game: 'BGMI' as GameType | string, customGame: '', prizePool: '', entryFee: '', startDateTime: '', mode: 'Solo', slots: 50, description: ''
  });

  const getPreviewDay = (dateTimeStr: string) => {
    if (!dateTimeStr) return '';
    try {
      return new Date(dateTimeStr).toLocaleDateString('en-US', { weekday: 'long' });
    } catch {
      return '';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substr(2, 9);
    const dateObj = new Date(newTourney.startDateTime);
    const day = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const finalGame = newTourney.game === 'Other' ? newTourney.customGame : newTourney.game;

    onAddTournament({
      ...newTourney, id, game: finalGame, date: dateStr, time: timeStr, day: day, startTime: newTourney.startDateTime, filledSlots: 0, slots: Number(newTourney.slots), status: 'UPCOMING'
    });
    setNewTourney({ title: '', game: 'BGMI', customGame: '', prizePool: '', entryFee: '', startDateTime: '', mode: 'Solo', slots: 50, description: '' });
  };

  return (
    <div className="animate-in fade-in duration-700">
      
      {appSettings.isMaintenanceMode && (
        <div className="mb-8 bg-amber-500/10 border border-amber-500/30 p-5 rounded-[32px] flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
            <p className="text-amber-500 text-[11px] font-black uppercase tracking-widest">Maintenance Mode Active</p>
          </div>
          <button 
            onClick={() => onUpdateSettings({ ...appSettings, isMaintenanceMode: false })}
            className="at-btn bg-amber-500 text-slate-950 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Disable
          </button>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 mb-12 no-scrollbar p-2 bg-slate-900/80 rounded-[32px] border border-slate-800 sticky top-28 z-40 backdrop-blur-xl">
        {[
          { id: 'approvals', label: 'Audit', icon: 'fa-file-invoice-dollar' },
          { id: 'chats', label: 'Support', icon: 'fa-envelope' },
          { id: 'matches', label: 'Roster', icon: 'fa-users' },
          { id: 'tournaments', label: 'Create', icon: 'fa-plus-circle' },
          { id: 'payouts', label: 'Payouts', icon: 'fa-wallet' },
          { id: 'settings', label: 'Settings', icon: 'fa-cog' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`at-btn flex-1 min-w-[100px] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-950' : 'text-slate-500 hover:text-white'}`}>
            <i className={`fas ${tab.icon} mb-1.5 block text-base`}></i>{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'payouts' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black italic uppercase text-white">Payout Control</h3>
            <button onClick={() => setActiveTab('approvals')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-chevron-left"></i> Back
            </button>
          </div>
          {withdrawals.map(w => (
            <div key={w.id} className="bg-slate-900/60 p-8 rounded-[40px] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-cyan-500/30 transition-all shadow-xl">
              <div className="flex-1">
                <p className="font-black text-2xl text-white mb-2">{w.userName}</p>
                <p className="text-cyan-400 text-xs font-bold bg-slate-950/50 p-2 rounded-lg inline-block">UPI: {w.upiId}</p>
                <p className="text-emerald-400 font-black text-2xl mt-3 italic">₹{w.amount}</p>
              </div>
              <div className="flex gap-4">
                {w.status === 'PENDING' ? (
                  <>
                    <button onClick={() => onProcessWithdrawal(w.id, 'REJECTED')} className="at-btn bg-slate-950 px-6 py-4 rounded-2xl text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">Reject</button>
                    <button onClick={() => onProcessWithdrawal(w.id, 'PAID')} className="at-btn bg-emerald-600 px-8 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-950">Paid</button>
                  </>
                ) : <span className="px-6 py-4 font-black uppercase text-slate-500 text-[10px] tracking-widest">{w.status}</span>}
              </div>
            </div>
          ))}
          {withdrawals.length === 0 && <p className="text-center py-20 text-slate-700 italic uppercase font-black tracking-widest text-[10px]">No payout requests pending</p>}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900/60 p-10 rounded-[48px] border border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black italic uppercase text-white">Master Controls</h3>
              <button onClick={() => setActiveTab('approvals')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <i className="fas fa-chevron-left"></i> Back
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div className="bg-slate-950 p-8 rounded-[40px] border border-slate-800 shadow-inner">
                   <div className="flex justify-between items-center mb-2">
                     <div>
                        <p className="font-black text-white text-sm uppercase tracking-tighter">Maintenance Mode</p>
                        <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">LOCK PLAYER ACCESS</p>
                     </div>
                     <button 
                        onClick={() => onUpdateSettings({ ...appSettings, isMaintenanceMode: !appSettings.isMaintenanceMode })}
                        className={`w-16 h-9 rounded-full relative transition-all duration-300 border ${appSettings.isMaintenanceMode ? 'bg-amber-600 border-amber-400' : 'bg-slate-800 border-slate-700'}`}
                     >
                       <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-xl transition-all duration-300 ${appSettings.isMaintenanceMode ? 'left-8' : 'left-1'}`}></div>
                     </button>
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-cyan-500 ml-2 tracking-widest">App Logo URL</label>
                  <input type="text" value={appSettings.logoUrl} onChange={e => onUpdateSettings({ ...appSettings, logoUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-3xl outline-none focus:border-cyan-500 font-bold text-xs" />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                   <label className="text-[10px] uppercase font-black text-cyan-500 ml-2 tracking-widest">Admin UPI ID</label>
                   <input type="text" value={appSettings.upiId} onChange={e => onUpdateSettings({ ...appSettings, upiId: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-3xl outline-none focus:border-cyan-500 font-bold" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-black text-cyan-500 ml-2 tracking-widest">Background Music URL (.mp3)</label>
                  <input type="text" value={appSettings.bgMusicUrl} onChange={e => onUpdateSettings({ ...appSettings, bgMusicUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-3xl outline-none focus:border-cyan-500 font-bold text-xs" />
                  <label className="text-[10px] uppercase font-black text-cyan-500 ml-2 tracking-widest">Touch Sound URL (.mp3)</label>
                  <input type="text" value={appSettings.clickSoundUrl} onChange={e => onUpdateSettings({ ...appSettings, clickSoundUrl: e.target.value })} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-3xl outline-none focus:border-cyan-500 font-bold text-xs" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'matches' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic uppercase text-white">Live Rosters</h3>
            <button onClick={() => setActiveTab('approvals')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-chevron-left"></i> Back
            </button>
          </div>
          {tournaments.map(t => {
            const approved = registrations.filter(r => r.tournamentId === t.id && r.status === RegistrationStatus.APPROVED);
            return (
              <div key={t.id} className="bg-slate-900/60 p-10 rounded-[48px] border border-slate-800 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-black text-3xl text-cyan-500 italic uppercase tracking-tighter">{t.title}</h3>
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">{approved.length}/{t.slots} Joined</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black text-slate-600 block tracking-widest ml-2">Match Credentials</label>
                    <input type="text" placeholder="ID: ... PASS: ..." defaultValue={t.roomDetails} onBlur={(e) => onUpdateRoomDetails(t.id, e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-6 rounded-[32px] text-white outline-none focus:border-cyan-500 font-bold shadow-inner" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black text-slate-600 block tracking-widest ml-2">Winner Selection</label>
                    <select 
                      onChange={(e) => {
                        const win = approved.find(a => a.userId === e.target.value);
                        if (win) onDeclareWinner(t.id, win.userId, Number(t.prizePool));
                      }}
                      className="w-full bg-slate-950 border border-slate-800 p-6 rounded-[32px] text-white outline-none focus:border-emerald-500 font-bold shadow-inner"
                      value={t.winnerUserId || ''}
                    >
                      <option value="">Choose Winner</option>
                      {approved.map(p => <option key={p.id} value={p.userId}>{p.gameId} ({p.userName})</option>)}
                    </select>
                  </div>
                </div>

                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 mb-6 px-2">Verified Roster</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approved.map(p => (
                    <div key={p.id} className="bg-slate-950 p-5 rounded-[24px] border border-slate-800 flex justify-between items-center shadow-lg group">
                      <span className="text-white font-black text-xs uppercase italic">{p.gameId}</span>
                      <span className="bg-cyan-500/10 text-cyan-500 px-4 py-1.5 rounded-full text-[9px] font-black border border-cyan-500/20 group-hover:bg-cyan-500 transition-all">Slot {p.slotNumber}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'chats' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black italic uppercase text-white">Support Inbox</h3>
            <button onClick={() => setActiveTab('approvals')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-chevron-left"></i> Back
            </button>
          </div>
          {Array.from(new Set(chatMessages.filter(m => !m.isAdminReply).map(m => m.senderEmail))).map((email: string) => {
            const userMsgs = chatMessages.filter(m => m.senderEmail === email || (m.isAdminReply && m.text.includes(email)));
            return (
              <div key={email} className="bg-slate-900/60 p-8 rounded-[40px] border border-slate-800 space-y-6 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-5">
                  <p className="font-black text-cyan-400 text-xs tracking-tighter uppercase">{email}</p>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-4 p-4 no-scrollbar bg-slate-950/40 rounded-[32px] shadow-inner">
                  {userMsgs.map(m => (
                    <div key={m.id} className={`flex flex-col ${m.isAdminReply ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-[20px] text-xs font-bold leading-relaxed shadow-lg ${m.isAdminReply ? 'bg-cyan-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-300 rounded-tl-none border border-slate-800'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter official resolution..."
                    value={replyText[email] || ''}
                    onChange={(e) => setReplyText(p => ({ ...p, [email as string]: e.target.value }))}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white outline-none focus:border-cyan-500 font-bold"
                  />
                  <button 
                    onClick={() => {
                      if (replyText[email]) {
                        onSendReply(email, replyText[email]);
                        setReplyText(p => ({ ...p, [email as string]: '' }));
                      }
                    }}
                    className="at-btn bg-cyan-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase text-white shadow-lg"
                  >
                    Reply
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-black italic uppercase text-white mb-8">Pending Audit</h3>
          {registrations.filter(r => r.status === RegistrationStatus.PENDING).map(reg => (
            <div key={reg.id} className="bg-slate-900/60 p-8 rounded-[40px] border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-cyan-500/40 transition-all shadow-xl">
              <div className="flex-1">
                <h4 className="font-black text-2xl text-white mb-2 italic uppercase">{reg.userName}</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-slate-950 text-cyan-400 px-3 py-1.5 rounded-lg text-[10px] font-black border border-slate-800 uppercase">UTR: {reg.transactionId}</span>
                  <span className="bg-slate-950 text-slate-400 px-3 py-1.5 rounded-lg text-[10px] font-black border border-slate-800 uppercase">IGN: {reg.gameId}</span>
                </div>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest ml-1">UID: {reg.gameUid}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => onUpdateRegistration(reg.id, RegistrationStatus.REJECTED)} className="at-btn px-6 py-4 bg-slate-950 border border-rose-500/20 text-rose-500 rounded-2xl uppercase font-black text-[10px] tracking-widest">Reject</button>
                <button onClick={() => onUpdateRegistration(reg.id, RegistrationStatus.APPROVED)} className="at-btn px-10 py-4 bg-emerald-600 text-white rounded-2xl uppercase font-black text-[10px] tracking-widest shadow-xl">Approve</button>
              </div>
            </div>
          ))}
          {registrations.filter(r => r.status === RegistrationStatus.PENDING).length === 0 && (
             <div className="text-center py-24 bg-slate-900/30 rounded-[56px] border border-dashed border-slate-800">
               <i className="fas fa-check-circle text-4xl text-emerald-500/20 mb-6"></i>
               <p className="text-slate-700 font-black uppercase tracking-[0.4em] text-[10px]">Arena is clean</p>
             </div>
          )}
        </div>
      )}

      {activeTab === 'tournaments' && (
        <div className="bg-slate-900/60 p-12 rounded-[56px] border border-slate-800 animate-in slide-in-from-bottom-4 duration-700 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">Broadcaster</h3>
            <button onClick={() => setActiveTab('approvals')} className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-chevron-left"></i> Cancel
            </button>
          </div>
          <form onSubmit={handleCreate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <input type="text" placeholder="Title" required value={newTourney.title} onChange={e => setNewTourney(p => ({...p, title: e.target.value}))} className="w-full bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none focus:border-cyan-500 shadow-inner" />
                
                <div className="space-y-4">
                   <div className="flex justify-between px-2">
                     <label className="text-[10px] uppercase font-black text-slate-600 tracking-widest">Date & Time</label>
                     <span className="text-[10px] uppercase font-black text-cyan-500 tracking-widest animate-pulse">{getPreviewDay(newTourney.startDateTime)}</span>
                   </div>
                   <input 
                      type="datetime-local" 
                      required 
                      value={newTourney.startDateTime} 
                      onChange={e => setNewTourney(p => ({...p, startDateTime: e.target.value}))} 
                      className="w-full bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none focus:border-cyan-500" 
                   />
                </div>

                <div className="flex gap-4">
                  <select value={newTourney.game} onChange={e => setNewTourney(p => ({...p, game: e.target.value}))} className="flex-1 bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none focus:border-cyan-500">
                    {GAMES.map(g => <option key={g} value={g}>{g}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <select value={newTourney.mode} onChange={e => setNewTourney(p => ({...p, mode: e.target.value}))} className="flex-1 bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none">
                    <option value="Solo">Solo</option><option value="Duo">Duo</option><option value="Squad">Squad</option><option value="Classic">Classic</option>
                  </select>
                  <input type="number" placeholder="Slots" required value={newTourney.slots} onChange={e => setNewTourney(p => ({...p, slots: Number(e.target.value)}))} className="flex-1 bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none" />
                </div>
                <div className="flex gap-4">
                  <input type="number" placeholder="Entry ₹" required value={newTourney.entryFee} onChange={e => setNewTourney(p => ({...p, entryFee: e.target.value}))} className="flex-1 bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none" />
                  <input type="number" placeholder="Prize ₹" required value={newTourney.prizePool} onChange={e => setNewTourney(p => ({...p, prizePool: e.target.value}))} className="flex-1 bg-slate-950 border border-slate-800 p-5 rounded-3xl font-bold outline-none" />
                </div>
              </div>
              <textarea placeholder="Rules & Additional Details..." required rows={10} value={newTourney.description} onChange={e => setNewTourney(p => ({...p, description: e.target.value}))} className="w-full bg-slate-950 border border-slate-800 p-6 rounded-[32px] resize-none outline-none focus:border-cyan-500 font-bold text-sm shadow-inner" />
            </div>
            <button type="submit" className="at-btn w-full bg-cyan-600 py-6 rounded-[32px] font-black text-xl italic uppercase tracking-tighter shadow-xl shadow-cyan-950">Broadcast Scrim</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
