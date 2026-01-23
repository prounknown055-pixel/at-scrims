/* ================= GAME ================= */

export type GameType =
  | 'BGMI'
  | 'Free Fire'
  | 'Ludo King'
  | 'COD Mobile'
  | 'Minecraft'
  | 'PUBG'
  | 'Clash of Clans'
  | 'Other';

/* ================= REGISTRATION ================= */

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/* ================= USER (profiles table) ================= */

export interface User {
  id: string;            // auth.users.id
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

/* ================= WALLET ================= */

export interface Wallet {
  user_id: string;
  balance: number;
  updated_at: string;
}

/* ================= PAYOUT REQUEST ================= */

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  upi: string;
  status: 'PENDING' | 'PAID' | 'REJECTED';
  requested_at: string;
}

/* ================= APP SETTINGS ================= */

export interface AppSettings {
  logoUrl: string;
  bgMusicUrl: string;
  clickSoundUrl: string;
  upiId: string;
  isMaintenanceMode: boolean;
}

/* ================= TOURNAMENT ================= */

export interface Tournament {
  id: string;
  title: string;
  game: GameType;
  entry_fee: string;
  prize_pool: string;
  slots: number;
  filled_slots: number;
  start_time: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

/* ================= REGISTRATIONS ================= */

export interface Registration {
  id: string;
  tournament_id: string;
  player_name: string;
  player_email: string;
  game_id: string;
  transaction_id: string;
  status: RegistrationStatus;
  created_at: string;
}

/* ================= SUPPORT TICKETS ================= */

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  admin_reply?: string;
  status: 'OPEN' | 'RESOLVED';
  created_at: string;
}
