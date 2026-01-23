
export type GameType = 'BGMI' | 'Free Fire' | 'Ludo King' | 'COD Mobile' | 'Minecraft' | 'PUBG' | 'Clash of Clans' | 'Other';

export enum RegistrationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  walletBalance: number;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  upiId: string;
  qrData?: string; 
  status: 'PENDING' | 'PAID' | 'REJECTED';
  timestamp: number;
}

export interface AppSettings {
  logoUrl: string;
  bgMusicUrl: string;
  clickSoundUrl: string;
  googleSheetId: string;
  paymentMode: 'MANUAL' | 'RAZORPAY_FUTURE';
  razorpayKeyId?: string;
  upiId: string;
  isMaintenanceMode: boolean;
}

export interface Tournament {
  id: string;
  game: string; 
  title: string;
  prizePool: string;
  entryFee: string;
  startTime: string; 
  date: string;    
  time: string;    
  day: string;     
  mode: string;    
  slots: number;
  filledSlots: number;
  description: string; 
  roomDetails?: string; 
  winnerUserId?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
}

export interface Registration {
  id: string;
  tournamentId: string;
  userId: string;
  userName: string;
  userEmail: string;
  gameId: string; 
  gameUid: string; 
  transactionId: string;
  status: RegistrationStatus;
  slotNumber?: number;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderEmail: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAdminReply: boolean;
}
