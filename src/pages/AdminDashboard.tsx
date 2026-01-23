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
      ticketsRes,
      payoutsRes,
      settingsRes
    ] = await Promise.all([
      supabase.from('tournaments').select('*').order('created_at', { ascending: false }),
      supabase.from('registrations').select('*'),
      supabase.from('support_tickets').select('*').order('created_at'),
      supabase.from('payout_requests').select('*'),
      supabase.from('app_settings').select('*').single()
    ]);

    if (tournamentsRes.data) setTournaments(tournamentsRes.data);
    if (registrationsRes.data) setRegistrations(registrationsRes.data);
    if (ticketsRes.data) setChatMessages(ticketsRes.data);
    if (payoutsRes.data) setWithdrawals(payoutsRes.data);

    if (settingsRes.data) {
      setAppSettings({
        isMaintenanceMode: settingsRes.data.maintenance,
        logoUrl: settingsRes.data.logo_url,
        upiId: settingsRes.data.admin_upi,
        bgMusicUrl: settingsRes.data.bg_music,
        clickSoundUrl: settingsRes.data.touch_sound
      });
    }

    setLoading(false);
  };

  /* ================= FIRST LOAD + REALTIME ================= */

  useEffect(() => {
    fetchAll();

    const channel = supabase
      .channel('admin-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => fetchAll()
      )
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
      .update({ admin_note: details })
      .eq('id', tourneyId);
  };

  /* ✅ FIX 1: EMAIL based reply (AdminPanel compatible) */
  const onSendReply = async (userEmail: string, text: string) => {
    await supabase
      .from('support_tickets')
      .update({
        admin_reply: text,
        status: 'RESOLVED'
      })
      .eq('senderEmail', userEmail);
  };

  /* ✅ FIX 2: winner save (future safe) */
  const onDeclareWinner = async (tourneyId: string, userId: string) => {
    await supabase
      .from('tournaments')
      .update({
        status: 'COMPLETED',
        winner_user_id: userId
      })
      .eq('id', tourneyId);
  };

  const onProcessWithdrawal = async (
    withdrawId: string,
    status: 'PAID' | 'REJECTED'
  ) => {
    await supabase
      .from('payout_requests')
      .update({ status })
      .eq('id', withdrawId);
  };

  const onUpdateSettings = async (settings: AppSettings) => {
    setAppSettings(settings);

    await supabase
      .from('app_settings')
      .update({
        maintenance: settings.isMaintenanceMode,
        admin_upi: settings.upiId,
        bg_music: settings.bgMusicUrl,
        touch_sound: settings.clickSoundUrl,
        logo_url: settings.logoUrl
      })
      .eq('id', 1);
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
