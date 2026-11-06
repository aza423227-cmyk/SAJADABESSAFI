export interface StoryItem {
  id: string;
  type: 'image' | 'text' | 'quote';
  image?: string;
  arabicText?: string;
  transliteration?: string;
  translation: string;
  source: string;
  context?: string;
  themeColor?: string;
}

export interface Story {
  id: string;
  title: string;
  category: string;
  author: string;
  authorAvatar: string;
  coverImage: string;
  isViewed: boolean;
  items: StoryItem[];
}

export interface FeedComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  type: 'verse' | 'hadith' | 'dua' | 'reflection' | 'poll';
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isVerified?: boolean;
  timestamp: string;
  category: string;
  arabicText?: string;
  transliteration?: string;
  translation: string;
  source: string;
  context?: string;
  imageUrl?: string;
  likes: number;
  isLiked?: boolean;
  saves: number;
  isSaved?: boolean;
  commentsCount: number;
  comments: FeedComment[];
  // For dhikr interactive posts
  dhikrGoal?: number;
  dhikrCurrent?: number;
  // For poll posts
  pollQuestion?: string;
  pollOptions?: { id: string; text: string; votes: number }[];
  userVotedId?: string;
  // Audio recital snippet
  audioTitle?: string;
  reciter?: string;
}

export type PrayerName = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerMinuteOffsets {
  Fajr: number;
  Sunrise: number;
  Dhuhr: number;
  Asr: number;
  Maghrib: number;
  Isha: number;
}

export interface PrayerTimeItem {
  name: PrayerName;
  labelFr: string;
  arabicName: string;
  time: string; // HH:MM
  isNext?: boolean;
  isPassed?: boolean;
  isCurrent?: boolean;
}

export interface CityLocation {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface DhikrPreset {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  virtue: string;
  recommendedTarget: number;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  city: string;
  joinedDate: string;
  streakDays: number;
  totalDhikrs: number;
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  isAudio?: boolean;
  audioDuration?: string;
  sharedVerse?: {
    arabic: string;
    translation: string;
    source: string;
  };
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantRole: string; // e.g. "مستشار روحي", "أخت في الله", "حلقة ذكر"
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isOnline: boolean;
  messages: ChatMessage[];
}

