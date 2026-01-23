
import { GameType } from './types';

export const ADMIN_EMAIL = 'tournamentsakamao@gmail.com';
export const ADMIN_PASSWORD = 'musicstudio250@gmail.com';

export const GAMES: GameType[] = [
  'BGMI',
  'Free Fire',
  'Ludo King',
  'COD Mobile',
  'Minecraft',
  'PUBG',
  'Clash of Clans'
];

export const ASSETS = {
  // Master Logo URL provided by user
  officialLogo: 'https://i.postimg.co/85pL6j7V/at-logo-official.png', 
  bgMusic: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_f5e67041e0.mp3?filename=lofi-gaming-hip-hop-loop-124853.mp3',
  clickSound: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-click-box-check-1120.mp3',
  qrPlaceholder: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=tournamentsakamao@upi&pn=AT_Scrims&am=0&cu=INR'
};

export const PAYMENT_DETAILS = {
  upiId: 'tournamentsakamao@upi',
};
