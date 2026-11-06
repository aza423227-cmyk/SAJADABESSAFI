import { useState } from 'react';
import {
  Send,
  Mic,
  Smile,
  Sparkles,
  ChevronLeft,
  Check,
  CheckCheck,
  Search,
  Phone,
  Video,
  Info,
  Play,
  Pause,
  Share2
} from 'lucide-react';
import { ChatThread, ChatMessage, UserProfile } from '../types';
import { playSpiritualTone } from '../services/audioService';

interface DirectMessagesViewProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-group',
    participantName: 'حلقة الذكر والتواصي بالحق',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    participantRole: 'مجلس ذكر جماعي · 18 عضواً',
    lastMessage: 'سبحان الله وبحمده.. من بدأ أذكار المساء اليوم؟ 🌿',
    lastTimestamp: '14:20',
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 'm1',
        senderId: 'yassine',
        senderName: 'ياسين',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
        text: 'السلام عليكم ورحمة الله وبركاته إخوتي الكرام',
        timestamp: '14:15',
        isMe: false
      },
      {
        id: 'm2',
        senderId: 'nour',
        senderName: 'نور الهدى',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
        text: 'وعليكم السلام ورحمة الله. لا تنسوا قراءة سورة الإخلاص والمعوذتين ثلاث مرات قبل الغروب 🤍',
        timestamp: '14:18',
        isMe: false
      },
      {
        id: 'm3',
        senderId: 'yassine',
        senderName: 'ياسين',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
        text: 'سبحان الله وبحمده.. من بدأ أذكار المساء اليوم؟ 🌿',
        timestamp: '14:20',
        isMe: false
      }
    ]
  },
  {
    id: 'thread-sheikh',
    participantName: 'الشيخ بلال (إمام ومستشار روحي)',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    participantRole: 'مستشار فقهي وروحي',
    lastMessage: 'وعليكم السلام، نعم صلاة الضحى تبدأ بعد الشروق بربع ساعة...',
    lastTimestamp: '11:45',
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'ms1',
        senderId: 'me',
        senderName: 'أنا',
        senderAvatar: '',
        text: 'السلام عليكم يا شيخنا، متى ينتهي وقت صلاة الضحى تحديداً؟',
        timestamp: '11:30',
        isMe: true
      },
      {
        id: 'ms2',
        senderId: 'sheikh',
        senderName: 'الشيخ بلال',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
        text: 'وعليكم السلام ورحمة الله وبركاته بني. يبدأ وقتها بعد شروق الشمس بحوالي 15 دقيقة، ويمتد إلى ما قبل أذان الظهر بعشر دقائق تقريباً. وأفضل وقتها حين ترمض الفصال.',
        timestamp: '11:45',
        isMe: false
      }
    ]
  },
  {
    id: 'thread-nour',
    participantName: 'نور الهدى',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    participantRole: 'أخت في الله · باريس',
    lastMessage: 'آية كريمة تريح القلب شاركتها معك 🤍',
    lastTimestamp: 'أمس',
    unreadCount: 1,
    isOnline: false,
    messages: [
      {
        id: 'mn1',
        senderId: 'nour',
        senderName: 'نور الهدى',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
        text: 'آية كريمة تريح القلب شاركتها معك 🤍',
        timestamp: 'أمس',
        isMe: false,
        sharedVerse: {
          arabic: 'وَاصْبِرْ لِحُكْمِ رَبِّكَ فَإِنَّكَ بِأَعْيُنِنَا',
          translation: '« Et supporte patiemment la décision de ton Seigneur. Car en vérité, tu es sous Nos yeux. »',
          source: 'Sourate At-Tur · Verset 48'
        }
      }
    ]
  },
  {
    id: 'thread-fajr',
    participantName: 'ياسين (رفيق صلاة الفجر)',
    participantAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    participantRole: 'تحدي الاستيقاظ لصلاة الفجر',
    lastMessage: 'الحمد لله صليت الفجر جماعة اليوم! أراك غداً بإذن الله.',
    lastTimestamp: '06:10',
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 'mf1',
        senderId: 'yassine',
        senderName: 'ياسين',
        senderAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&auto=format&fit=crop&q=80',
        text: 'الحمد لله صليت الفجر جماعة اليوم! أراك غداً بإذن الله.',
        timestamp: '06:10',
        isMe: false
      }
    ]
  }
];

const QUICK_DUAS = [
  'جزاك الله خيراً 🤲',
  'ما شاء الله لا قوة إلا بالله ✨',
  'تقبل الله طاعتكم 🤍',
  'اللهم آمين يارب العالمين 🌸',
  'الحمد لله على كل حال'
];

export default function DirectMessagesView({ currentUser, onOpenAuth }: DirectMessagesViewProps) {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_THREADS[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileThreadOpen, setIsMobileThreadOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || messageInput.trim();
    if (!text) return;

    const myMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser ? currentUser.id : 'me',
      senderName: currentUser ? currentUser.name : 'أنا',
      senderAvatar: currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
      text,
      timestamp: 'الآن',
      isMe: true
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: text,
            lastTimestamp: 'الآن',
            messages: [...t.messages, myMsg]
          };
        }
        return t;
      })
    );

    setMessageInput('');

    // Trigger kind simulated response after 1.3 seconds
    setTimeout(() => {
      const replies: Record<string, string> = {
        'thread-group': 'اللهم صلّ وسلم على نبينا محمد وعلى آله وصحبه أجمعين 🤍',
        'thread-sheikh': 'بارك الله فيك ونفع بك الأمة، وجعل خطاك مباركة يا بني.',
        'thread-nour': 'تسلمي يا غالية، جمعنا الله في الفردوس الأعلى 🌸',
        'thread-fajr': 'بإذن الله نلتقي عند صلاة الفجر، ثبتنا الله وإياك!'
      };

      const replyText = replies[activeThreadId] || 'تقبل الله منا ومنكم صالح الأعمال 🤲';

      const botMsg: ChatMessage = {
        id: `reply-${Date.now()}`,
        senderId: activeThread.id,
        senderName: activeThread.participantName.split(' ')[0],
        senderAvatar: activeThread.participantAvatar,
        text: replyText,
        timestamp: 'الآن',
        isMe: false
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              lastMessage: replyText,
              lastTimestamp: 'الآن',
              messages: [...t.messages, botMsg]
            };
          }
          return t;
        })
      );
    }, 1300);
  };

  const handleSendVoiceNote = () => {
    playSpiritualTone();
    const voiceMsg: ChatMessage = {
      id: `audio-${Date.now()}`,
      senderId: currentUser ? currentUser.id : 'me',
      senderName: currentUser ? currentUser.name : 'أنا',
      senderAvatar: currentUser ? currentUser.avatar : '',
      text: 'تسجيل صوتي روحي 🎙️',
      timestamp: 'الآن',
      isMe: true,
      isAudio: true,
      audioDuration: '0:14'
    };

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            lastMessage: 'رسالة صوتية (0:14)',
            lastTimestamp: 'الآن',
            messages: [...t.messages, voiceMsg]
          };
        }
        return t;
      })
    );
  };

  const filteredThreads = threads.filter((t) =>
    t.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm overflow-hidden min-h-[620px] flex flex-col md:flex-row">
      {/* 1. LEFT COLUMN: Conversations Threads List */}
      <div
        className={`w-full md:w-80 md:border-r border-stone-200 dark:border-stone-800 flex flex-col shrink-0 ${
          isMobileThreadOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Top Header of Threads */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold font-arabic text-stone-900 dark:text-stone-100">
              الرسائل والتواصل
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold">
              انستغرام DMs
            </span>
          </div>

          {!currentUser && (
            <button
              onClick={onOpenAuth}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              تسجيل الدخول
            </button>
          )}
        </div>

        {/* Search threads */}
        <div className="p-3 border-b border-stone-100 dark:border-stone-800">
          <div className="relative">
            <input
              type="text"
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl px-3 py-1.5 pl-8 text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Thread items */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-stone-100 dark:divide-stone-800/60">
          {filteredThreads.map((thread) => {
            const isSelected = activeThread.id === thread.id;
            return (
              <button
                key={thread.id}
                onClick={() => {
                  setActiveThreadId(thread.id);
                  setIsMobileThreadOpen(true);
                }}
                className={`w-full p-3.5 text-left flex items-center gap-3 transition-colors ${
                  isSelected
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.participantAvatar}
                    alt={thread.participantName}
                    className="w-12 h-12 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                  />
                  {thread.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-stone-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold font-arabic text-stone-900 dark:text-stone-100 truncate">
                      {thread.participantName}
                    </span>
                    <span className="text-[10px] text-stone-400 shrink-0">{thread.lastTimestamp}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                    {thread.lastMessage}
                  </p>
                </div>

                {thread.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {thread.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. RIGHT COLUMN: Active Chat Conversation */}
      <div
        className={`flex-1 flex flex-col bg-stone-50/50 dark:bg-stone-950/40 ${
          !isMobileThreadOpen ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Active Chat Header */}
        <div className="p-3.5 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileThreadOpen(false)}
              className="md:hidden p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              aria-label="الرجوع للقائمة"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={activeThread.participantAvatar}
                alt={activeThread.participantName}
                className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
              />
              {activeThread.isOnline && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-stone-900" />
              )}
            </div>

            <div>
              <h4 className="text-sm font-bold font-arabic text-stone-900 dark:text-stone-100">
                {activeThread.participantName}
              </h4>
              <p className="text-[10px] text-stone-400">
                {activeThread.isOnline ? '🟢 متصل الآن' : activeThread.participantRole}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-stone-400">
            <button className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3.5">
          {activeThread.messages.map((msg) => {
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!msg.isMe && (
                  <img
                    src={msg.senderAvatar || activeThread.participantAvatar}
                    alt={msg.senderName}
                    className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                  />
                )}

                <div
                  className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.isMe
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none border border-stone-200/60 dark:border-stone-700/60'
                  }`}
                >
                  {/* Shared Verse Card if present */}
                  {msg.sharedVerse && (
                    <div className="mb-2 p-2.5 rounded-xl bg-black/20 text-white">
                      <p className="font-arabic text-sm text-amber-200 mb-1">
                        {msg.sharedVerse.arabic}
                      </p>
                      <p className="text-[11px] font-light leading-snug">
                        {msg.sharedVerse.translation}
                      </p>
                      <span className="text-[9px] text-stone-300 mt-1 block">
                        — {msg.sharedVerse.source}
                      </span>
                    </div>
                  )}

                  {/* Audio voice note if present */}
                  {msg.isAudio ? (
                    <div className="flex items-center gap-2.5 py-1 min-w-[160px]">
                      <button
                        onClick={() => {
                          playSpiritualTone();
                          setPlayingAudioId(playingAudioId === msg.id ? null : msg.id);
                        }}
                        className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white"
                      >
                        {playingAudioId === msg.id ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 flex items-center gap-0.5 h-3">
                        {[40, 70, 90, 60, 100, 40, 80, 50, 70, 30].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-white/60 rounded-full"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono">{msg.audioDuration}</span>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}

                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                      msg.isMe ? 'text-emerald-100' : 'text-stone-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Du'as pills bar */}
        <div className="px-3 py-1.5 bg-stone-100 dark:bg-stone-900/60 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-stone-400 shrink-0">أدعية سريعة :</span>
          {QUICK_DUAS.map((dua, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(dua)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px] font-arabic whitespace-nowrap shrink-0 hover:border-emerald-500 transition-colors"
            >
              {dua}
            </button>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleSendVoiceNote}
            className="p-2 rounded-xl text-stone-500 hover:text-emerald-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="تسجيل رسالة صوتية"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="اكتب رسالة أو دعاء طيباً..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-all active:scale-95 cursor-pointer"
            aria-label="إرسال"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}
