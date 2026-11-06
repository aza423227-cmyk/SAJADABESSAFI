import { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  Sparkles,
  Bookmark,
  HeartHandshake,
  Filter,
  Share2,
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';
import Navigation, { NavTab } from './components/Navigation';
import StoryBar from './components/StoryBar';
import StoryModal from './components/StoryModal';
import FeedCard from './components/FeedCard';
import PrayerWidget from './components/PrayerWidget';
import TasbihView from './components/TasbihView';
import QiblaModal from './components/QiblaModal';
import CreatePostModal from './components/CreatePostModal';
import SajdaAIModal from './components/SajdaAIModal';
import AdhanInstagramPlayer from './components/AdhanInstagramPlayer';
import AuthModal from './components/AuthModal';
import DirectMessagesView from './components/DirectMessagesView';
import { INITIAL_STORIES, INITIAL_POSTS } from './data/mockFeedData';
import { Story, FeedPost, CityLocation, UserProfile } from './types';
import {
  calculatePrayerTimes,
  getCountdownToNextPrayer,
  POPULAR_CITIES,
  getHijriDate,
  getStoredCity
} from './services/prayerTimes';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('feed');
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQiblaModal, setShowQiblaModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAdhanModal, setShowAdhanModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // User authentication state (saved in localStorage)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('sajada_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sajada_current_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sajada_current_user');
    } catch {
      // ignore
    }
  };

  // Sync dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Prayer data for quick sidebar glance (using detected or stored user city)
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentCity = getStoredCity() || POPULAR_CITIES[0];
  const sidebarPrayerTimes = calculatePrayerTimes(currentCity, now);
  const sidebarCountdown = getCountdownToNextPrayer(sidebarPrayerTimes, now);
  const hijri = getHijriDate(now);

  // Story handlers
  const handleSelectStory = (index: number) => {
    setActiveStoryIndex(index);
  };

  const handleMarkStoryViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, isViewed: true } : s))
    );
  };

  // Post action handlers
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
  };

  const handleToggleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isSaved = !p.isSaved;
          return {
            ...p,
            isSaved,
            saves: isSaved ? p.saves + 1 : Math.max(0, p.saves - 1)
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: 'Vous',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
            text,
            timestamp: 'À l\'instant'
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newComment, ...p.comments]
          };
        }
        return p;
      })
    );
  };

  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.pollOptions) {
          const hadPriorVote = p.userVotedId;
          const updatedOptions = p.pollOptions.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + (hadPriorVote === optionId ? 0 : 1) };
            }
            if (hadPriorVote === opt.id) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });
          return {
            ...p,
            userVotedId: optionId,
            pollOptions: updatedOptions
          };
        }
        return p;
      })
    );
  };

  const handlePublishPost = (newPost: FeedPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('feed');
  };

  // Filter posts
  const savedPosts = posts.filter((p) => p.isSaved);
  const categories = ['Tous', 'Paix & Sérénité', 'Dhikr Interactif', 'Sondage & Réflexion', 'Gratitude & Bienveillance', 'Contemplation'];
  const filteredPosts =
    selectedCategory === 'Tous'
      ? posts
      : posts.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* 1. Header & Desktop / Mobile Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCreateClick={() => setShowCreateModal(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        savedCount={savedPosts.length}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        unreadMessagesCount={3}
      />

      {/* 2. Main Content Container (Full 1440px wide desktop presence) */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-24 md:pb-12">
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center Column: Stories Tray & Spiritual Feed */}
            <div className="lg:col-span-8 space-y-4">
              {/* Instagram-style Stories Bar */}
              <StoryBar
                stories={stories}
                onSelectStory={handleSelectStory}
                onCreateStory={() => setShowCreateModal(true)}
              />

              {/* Category Filter Bar (Interactive Buttons) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                        : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Feed Posts List */}
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6">
                    <p className="text-sm text-stone-500">Aucun rappel trouvé dans cette catégorie.</p>
                    <button
                      onClick={() => setSelectedCategory('Tous')}
                      className="mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 underline"
                    >
                      Afficher tous les rappels
                    </button>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <FeedCard
                      key={post.id}
                      post={post}
                      onToggleLike={handleToggleLike}
                      onToggleSave={handleToggleSave}
                      onAddComment={handleAddComment}
                      onVotePoll={handleVotePoll}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right Column (Desktop Companion Sidebar): Prayer status, Qibla trigger, Quick Tasbih, Daily Inspiration */}
            <aside className="hidden lg:block lg:col-span-4 space-y-5 sticky top-20">
              {/* Live Prayer Snapshot Card */}
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {currentCity.name}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {hijri.day} {hijri.monthNameFr} {hijri.year}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('prayers')}
                    className="text-xs text-stone-500 hover:text-emerald-500 flex items-center gap-1"
                  >
                    <span>Détails</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-stone-900 to-teal-950 text-white text-center">
                  <div className="text-[11px] uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                    Prochaine prière · {sidebarCountdown.nextPrayer.labelFr}
                  </div>
                  <div className="text-3xl font-extrabold font-mono tabular-nums text-white">
                    {sidebarCountdown.formattedCountdown}
                  </div>
                  <div className="text-[11px] text-stone-300 mt-1">
                    À {sidebarCountdown.nextPrayer.time} ({sidebarCountdown.nextPrayer.arabicName})
                  </div>
                </div>

                {/* 5 Prayers mini timetable */}
                <div className="space-y-1.5 pt-1">
                  {sidebarPrayerTimes.map((p) => (
                    <div
                      key={p.name}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs ${
                        p.isNext
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <span>{p.labelFr}</span>
                      <span className="font-mono tabular-nums">{p.time}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setShowQiblaModal(true)}
                    className="py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-emerald-500" />
                    <span>القبلة</span>
                  </button>

                  <button
                    onClick={() => setShowAdhanModal(true)}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 text-stone-800 dark:text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-rose-500/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                    <span>الأذان 🎵</span>
                  </button>
                </div>
              </div>

              {/* Quick AI Spiritual Companion trigger */}
              <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-sm">
                  <HeartHandshake className="w-5 h-5 text-emerald-500" />
                  <span>Un souci ou un doute sur le cœur ?</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  Consultez notre Compagnon SAJADA BESSAFI AI pour trouver le verset et la prière qui apaisent votre situation.
                </p>
                <button
                  onClick={() => setShowAIModal(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Demander un réconfort spirituel</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* TAB 2: Horaires & Prières Widget */}
        {activeTab === 'prayers' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 flex items-center justify-center gap-2">
                <span>Horaires de Prière</span>
                <span className="text-stone-400 font-normal">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold tracking-wider">SAJADA BESSAFI</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Calcul astronomique précis, suivi quotidien de vos 5 prières et boussole de la Mecque.
              </p>
            </div>
            <PrayerWidget onOpenQibla={() => setShowQiblaModal(true)} />
          </div>
        )}

        {/* TAB 3: Tasbih Digital */}
        {activeTab === 'tasbih' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Tasbih & Évocations
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Compteur tactile immersif avec retour haptique, cycles de 33/100 et mérites spirituels.
              </p>
            </div>
            <TasbihView />
          </div>
        )}

        {/* TAB 4: Messages & Communication (Instagram DMs) */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <DirectMessagesView
              currentUser={currentUser}
              onOpenAuth={() => setShowAuthModal(true)}
            />
          </div>
        )}

        {/* TAB 5: Favoris & Sauvegardes */}
        {activeTab === 'bookmarks' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Mes Rappels Enregistrés
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Retrouvez vos versets, hadiths et invocations favoris pour les relire à tout moment.
              </p>
            </div>

            {savedPosts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
                <Bookmark className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Aucun rappel enregistré pour l'instant
                </h3>
                <p className="text-xs text-stone-400 max-w-xs mx-auto mb-4">
                  Cliquez sur l'icône de signet sous les versets ou hadiths du flux pour les sauvegarder ici.
                </p>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
                >
                  Explorer le flux
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {savedPosts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onToggleLike={handleToggleLike}
                    onToggleSave={handleToggleSave}
                    onAddComment={handleAddComment}
                    onVotePoll={handleVotePoll}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Compagnon Sajda AI */}
        {activeTab === 'ai' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                Guide Spirituel & Apaisement
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Trouvez des versets, invocations et conseils adaptés à l'état de votre cœur.
              </p>
            </div>
            <SajdaAIModal onClose={() => setActiveTab('feed')} />
          </div>
        )}
      </main>

      {/* 3. MODALS */}
      {/* Full-Screen Instagram Story Player */}
      {activeStoryIndex !== null && (
        <StoryModal
          stories={stories}
          initialStoryIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
          onMarkAsViewed={handleMarkStoryViewed}
        />
      )}

      {/* Qibla Compass Modal */}
      {showQiblaModal && (
        <QiblaModal
          cityName={currentCity.name}
          latitude={currentCity.latitude}
          longitude={currentCity.longitude}
          onClose={() => setShowQiblaModal(false)}
        />
      )}

      {/* Create Rappel / Story Modal */}
      {showCreateModal && (
        <CreatePostModal
          currentUser={currentUser}
          onClose={() => setShowCreateModal(false)}
          onPublish={handlePublishPost}
        />
      )}

      {/* AI Guidance Floating Modal (if opened from sidebar) */}
      {showAIModal && (
        <SajdaAIModal onClose={() => setShowAIModal(false)} />
      )}

      {/* Instagram Adhan Sound Modal */}
      {showAdhanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8">
            <AdhanInstagramPlayer
              onClose={() => setShowAdhanModal(false)}
            />
          </div>
        </div>
      )}

      {/* Auth Modal (Login / Sign Up / Profile) */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onLogout={handleLogout}
          currentCityName={currentCity.name}
        />
      )}
    </div>
  );
}
