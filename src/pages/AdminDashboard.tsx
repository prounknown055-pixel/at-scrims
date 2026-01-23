import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import AdminPanel from '../components/AdminPanel';
import {
  Tournament,
  Registration,
  RegistrationStatus,
  ChatMessage,
  AppSettings,
  WithdrawalRequest
} from '../types';

const AdminDashboard = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    isMaintenanceMode: false,
    logoUrl: '',
    upiId: '',
    bgMusicUrl: '',
    clickSoundUrl: ''
  });

  /* ================= FETCH ALL DATA ================= */

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const [{ data: t }, { data: r }, { data: c }, { data: w }, { data: s }] =
      await Promise.all([
        supabase.from('tournaments').select('*'),
        supabase.from('registrations').select('*'),
        supabase.from('chats').select('*'),
        supabase.from('withdrawals').select('*'),
        supabase.from('settings').select('*').single()
      ]);

    if (t) setTournaments(t);
    if (r) setRegistrations(r);
    if (c) setChatMessages(c);
    if (w) setWithdrawals(w);
    if (s) setAppSettings(s);
  };

  /* ================= ACTION HANDLERS ================= */

  const onAddTournament = async (tournament: Tournament) => {
    await supabase.from('tournaments').insert(tournament);
    fetchAll();
  };

  const onUpdateRegistration = async (id: string, status: RegistrationStatus) => {
    await supabase.from('registrations').update({ status }).eq('id', id);
    fetchAll();
  };

  const onUpdateRoomDetails = async (tourneyId: string, details: string) => {
    await supabase.from('tournaments').update({ roomDetails: details }).eq('id', tourneyId);
  };

  const onSendReply = async (email: string, text: string) => {
    await supabase.from('chats').insert({
      senderEmail: email,
      text,
      isAdminReply: true
    });
    fetchAll();
  };

  const onDeclareWinner = async (tourneyId: string, userId: string, prize: number) => {
    await supabase.from('tournaments').update({
      winnerUserId: userId,
      status: 'COMPLETED'
    }).eq('id', tourneyId);

    await supabase.from('wallets').update({
      balance: supabase.rpc('add_balance', { amount: prize })
    }).eq('userId', userId);

    fetchAll();
  };

  const onProcessWithdrawal = async (withdrawId: string, status: 'PAID' | 'REJECTED') => {
    await supabase.from('withdrawals').update({ status }).eq('id', withdrawId);
    fetchAll();
  };

  const onUpdateSettings = async (settings: AppSettings) => {
    setAppSettings(settings);
    await supabase.from('settings').update(settings).eq('id', 1);
  };

  /* ================= RENDER ================= */

  return (
    <AdminPanel
      tournaments={tournaments}
      registrations={registrations}
      chatMessages={chatMessages}
      withdrawals={withdrawals}
      appSettings={appSettings}
      onSetTournaments={setTournaments}
      onAddTournament={onAddTournament}
      onUpdateRegistration={onUpdateRegistration}
      onUpdateRoomDetails={onUpdateRoomDetails}
      onSendReply={onSendReply}
      onDeclareWinner={onDeclareWinner}
      onProcessWithdrawal={onProcessWithdrawal}
      onUpdateSettings={onUpdateSettings}
    />
  );
};

export default AdminDashboard;
