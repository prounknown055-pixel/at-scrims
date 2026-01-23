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
  const [loading, setLoading] = useState(true);

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

  /* ================= FETCH ALL ================= */

  const fetchAll = async () => {
    setLoading(true);

    const [
      tournamentsRes,
      registrationsRes,
      chatsRes,
      withdrawalsRes,
      settingsRes
    ] = await Promise.all([
      supabase.from('tournaments').select('*').order('created_at', { ascending: false }),
      supabase.from('registrations').select('*'),
      supabase.from('chats').select('*').order('created_at'),
      supabase.from('withdrawals').select('*'),
      supabase.from('settings').select('*').single()
    ]);

    if (tournamentsRes.data) setTournaments(tournamentsRes.data);
    if (registrationsRes.data) setRegistrations(registrationsRes.data);
    if (chatsRes.data) setChatMessages(chatsRes.data);
    if (withdrawalsRes.data) setWithdrawals(withdrawalsRes.data);
    if (settingsRes.data) setAppSettings(settingsRes.data);

    setLoading(false);
  };

  /* ================= FIRST LOAD ================= */

  useEffect(() => {
    fetchAll();

    // 🔥 REALTIME LISTENERS
    const channel = supabase
      .channel('admin-live')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        fetchAll();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ================= ACTIONS ================= */

  const onAddTournament = async (t: Tournament) => {
    await supabase.from('tournaments').insert(t);
  };

  const onUpdateRegistration = async (id: string, status: RegistrationStatus) => {
    await supabase.from('registrations').update({ status }).eq('id', id);
  };

  const onUpdateRoomDetails = async (tourneyId: string, details: string) => {
    await supabase
      .from('tournaments')
      .update({ roomDetails: details })
      .eq('id', tourneyId);
  };

  const onSendReply = async (email: string, text: string) => {
    await supabase.from('chats').insert({
      senderEmail: email,
      text,
      isAdminReply: true
    });
  };

  const onDeclareWinner = async (tourneyId: string, userId: string, prize: number) => {
    await supabase
      .from('tournaments')
      .update({
        winnerUserId: userId,
        status: 'COMPLETED'
      })
      .eq('id', tourneyId);
  };

  const onProcessWithdrawal = async (
    withdrawId: string,
    status: 'PAID' | 'REJECTED'
  ) => {
    await supabase
      .from('withdrawals')
      .update({ status })
      .eq('id', withdrawId);
  };

  const onUpdateSettings = async (settings: AppSettings) => {
    setAppSettings(settings);
    await supabase.from('settings').update(settings).eq('id', 1);
  };

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white font-black">
        Loading Admin Panel...
      </div>
    );
  }

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
