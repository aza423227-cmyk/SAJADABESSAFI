import {
  Home,
  Clock,
  Sparkles,
  Bookmark,
  HeartHandshake,
  Plus,
  Moon,
  Sun,
  MessageCircle,
  User as UserIcon
} from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'feed' | 'prayers' | 'tasbih' | 'messages' | 'bookmarks';

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onCreateClick: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  savedCount: number;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  unreadMessagesCount?: number;
}

export default function Navigation({
  activeTab,
  onTabChange,
  onCreateClick,
  isDarkMode,
  onToggleDarkMode,
  savedCount,
  currentUser,
  onOpenAuth,
  unreadMessagesCount = 3
}: NavigationProps) {
  return (
    <>
      {/* 1. TOP BAR CONTRACT (DESKTOP & TABLET): Exactly 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 w-full bg-white/85 dark:bg-stone-950/85 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark in display face */}
          <button
            onClick={() => onTabChange('feed')}
            className="text-base sm:text-lg font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
            aria-label="SAJADA BESSAFI"
          >
            SAJADA BESSAFI
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-stone-600 dark:text-stone-300">
            <button
              onClick={() => onTabChange('feed')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'feed' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 py-1' : ''
              }`}
            >
              الرئيسية
            </button>
            <button
              onClick={() => onTabChange('prayers')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'prayers' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 py-1' : ''
              }`}
            >
              المواقيت
            </button>
            <button
              onClick={() => onTabChange('tasbih')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tasbih' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 py-1' : ''
              }`}
            >
              المسبحة
            </button>
            <button
              onClick={() => onTabChange('messages')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 relative flex items-center gap-1 ${
                activeTab === 'messages' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 py-1' : ''
              }`}
            >
              <span>الرسائل والتواصل</span>
              {unreadMessagesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('bookmarks')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 relative ${
                activeTab === 'bookmarks' ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 py-1' : ''
              }`}
            >
              <span>المفضلة</span>
              {savedCount > 0 && (
                <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* User Account / Login button */}
            {currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 p-1 pl-2.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-xs font-semibold text-stone-800 dark:text-stone-200"
                title="الملف الشخصي"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span>دخول / حساب</span>
              </button>
            )}

            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onCreateClick}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-xl transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-emerald-600/20"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">نشر تذكير</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. FIXED BOTTOM TAB BAR (MOBILE ERGONOMICS) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-950/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 pb-safe shadow-lg">
        <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
          <button
            onClick={() => onTabChange('feed')}
            className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              activeTab === 'feed'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">الرئيسية</span>
          </button>

          <button
            onClick={() => onTabChange('prayers')}
            className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              activeTab === 'prayers'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">المواقيت</span>
          </button>

          <button
            onClick={() => onTabChange('messages')}
            className={`flex flex-col items-center justify-center h-full gap-1 transition-colors relative ${
              activeTab === 'messages'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">التواصل</span>
            {unreadMessagesCount > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
            )}
          </button>

          <button
            onClick={() => onTabChange('tasbih')}
            className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              activeTab === 'tasbih'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-tight">المسبحة</span>
          </button>

          <button
            onClick={onOpenAuth}
            className={`flex flex-col items-center justify-center h-full gap-1 transition-colors ${
              currentUser
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500"
              />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
            <span className="text-[10px] font-medium tracking-tight">
              {currentUser ? 'حسابي' : 'دخول'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
