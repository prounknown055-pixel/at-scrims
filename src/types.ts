export type GameType = 'BGMI' | 'Free Fire' | 'Ludo King' | 'COD Mobile' | 'Minecraft' | 'PUBG' | 'Clash of Clans' | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  walletBalance: number;
}

export interface Tournament {
  id: string;
  title: string;
  game: string;
  prize_pool: string;
  entry_fee: string;
  slots: number;
  filled_slots: number;
  start_time: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
}

export interface Registration {
  id: string;
  tournamentId: string;
  userEmail: string;
  gameId: string;
  gameUid: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
