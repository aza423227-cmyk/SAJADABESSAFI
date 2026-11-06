import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Heart, Share2, Bookmark, Volume2, VolumeX, Pause, Play, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Story } from '../types';
import { playSpiritualTone } from '../services/audioService';

interface StoryModalProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
  onMarkAsViewed: (storyId: string) => void;
}

export default function StoryModal({
  stories,
  initialStoryIndex,
  onClose,
  onMarkAsViewed
}: StoryModalProps) {
  const [storyIndex, setStoryIndex] = useState(initialStoryIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);

  const currentStory = stories[storyIndex];
  const currentItem = currentStory?.items[itemIndex] || currentStory?.items[0];
  const ITEM_DURATION_MS = 6000;
  const progressIntervalRef = useRef<number | null>(null);

  // Mark viewed
  useEffect(() => {
    if (currentStory) {
      onMarkAsViewed(currentStory.id);
    }
  }, [currentStory, onMarkAsViewed]);

  const goToNextItem = useCallback(() => {
    if (!currentStory) return;
    if (itemIndex < currentStory.items.length - 1) {
      setItemIndex((prev) => prev + 1);
      setProgress(0);
    } else if (storyIndex < stories.length - 1) {
      setStoryIndex((prev) => prev + 1);
      setItemIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentStory, itemIndex, storyIndex, stories.length, onClose]);

  const goToPrevItem = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex((prev) => prev - 1);
      setProgress(0);
    } else if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1];
      setStoryIndex((prev) => prev - 1);
      setItemIndex(prevStory.items.length - 1);
      setProgress(0);
    }
  }, [itemIndex, storyIndex, stories]);

  // Progress ticker
  useEffect(() => {
    if (isPaused) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / ITEM_DURATION_MS) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNextItem();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, goToNextItem]);

  // Audio tone trigger
  const handleToggleAudio = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playSpiritualTone();
    }
  };

  const handleDoubleTap = () => {
    setIsLiked(true);
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 900);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share && currentItem) {
      try {
        await navigator.share({
          title: `SAJADA BESSAFI - ${currentItem.source}`,
          text: `${currentItem.translation} — ${currentItem.source}`,
          url: window.location.href
        });
      } catch {
        // Ignored or dismissed
      }
    } else if (currentItem) {
      navigator.clipboard.writeText(`${currentItem.arabicText || ''}\n${currentItem.translation}\n${currentItem.source}`);
      alert('Rappel copié dans le presse-papier !');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') goToNextItem();
      if (e.key === 'ArrowLeft') goToPrevItem();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToNextItem, goToPrevItem]);

  if (!currentStory || !currentItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md select-none">
      {/* Outer wrapper with Instagram story aspect ratio container */}
      <div className="relative w-full h-full sm:h-[94vh] sm:max-w-md sm:rounded-3xl overflow-hidden bg-stone-900 shadow-2xl flex flex-col justify-between">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          {currentItem.image ? (
            <img
              src={currentItem.image}
              alt={currentItem.source}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-stone-900 to-amber-950" />
          )}
          {/* Measured scrim overlay for high contrast text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/75" />
        </div>

        {/* Floating Heart Animation on Double-Tap */}
        {showHeartOverlay && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-ping">
            <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-lg" />
          </div>
        )}

        {/* TOP CONTROLS BAR */}
        <div className="relative z-20 pt-3 px-3.5 pb-2">
          {/* Segmented Progress Bars */}
          <div className="flex items-center gap-1.5 mb-3">
            {currentStory.items.map((_, idx) => {
              let width = '0%';
              if (idx < itemIndex) width = '100%';
              else if (idx === itemIndex) width = `${Math.min(100, Math.max(0, progress))}%`;
              return (
                <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all ease-linear"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* Author info & Header actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/60 p-0.5">
                <img
                  src={currentStory.authorAvatar}
                  alt={currentStory.author}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <span>{currentStory.author}</span>
                  <span className="text-white/60 font-normal">·</span>
                  <span className="text-white/75 font-normal text-[11px]">{currentStory.category}</span>
                </div>
                <span className="text-[10px] text-white/70">Aujourd'hui</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-white">
              <button
                onClick={handleToggleAudio}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label={isPaused ? 'Reprendre' : 'Mettre en pause'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Fermer la story"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* TAP NAVIGATION ZONES (Left / Right) & Double Tap Detection */}
        <div
          className="absolute inset-0 z-10 flex cursor-pointer"
          onDoubleClick={handleDoubleTap}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left zone: 35% */}
          <div
            className="w-[35%] h-full"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevItem();
            }}
          />
          {/* Right zone: 65% */}
          <div
            className="w-[65%] h-full"
            onClick={(e) => {
              e.stopPropagation();
              goToNextItem();
            }}
          />
        </div>

        {/* STORY CONTENT (Central reading area) */}
        <div className="relative z-20 px-6 my-auto text-center max-w-sm mx-auto pointer-events-none">
          {currentItem.arabicText && (
            <div className="mb-5">
              <p className="font-arabic text-2xl sm:text-3xl text-amber-200 leading-[1.9] tracking-normal drop-shadow-md">
                {currentItem.arabicText}
              </p>
            </div>
          )}

          {showTransliteration && currentItem.transliteration && (
            <p className="text-xs italic text-stone-300 font-light mb-3 tracking-wide">
              « {currentItem.transliteration} »
            </p>
          )}

          <p className="text-base sm:text-lg font-medium text-white leading-relaxed mb-4 drop-shadow-md">
            {currentItem.translation}
          </p>

          <div className="inline-block py-1 px-3 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs text-stone-200 font-medium">
            {currentItem.source}
          </div>

          {currentItem.context && (
            <p className="mt-4 text-xs text-stone-300/90 leading-normal line-clamp-3 bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
              💡 {currentItem.context}
            </p>
          )}
        </div>

        {/* BOTTOM ENGAGEMENT BAR */}
        <div className="relative z-20 p-3.5 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setShowTransliteration((prev) => !prev)}
              className="text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-white/10"
            >
              {showTransliteration ? 'Masquer phonétique' : 'Afficher phonétique'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSendReply} className="flex-1">
              <input
                type="text"
                placeholder={replySent ? 'Réflexion envoyée !' : 'Répondre à la story...'}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 backdrop-blur-md"
              />
            </form>

            <button
              onClick={() => setIsLiked((prev) => !prev)}
              className="p-2 text-white hover:scale-110 active:scale-95 transition-transform"
              aria-label="Aimer"
            >
              <Heart
                className={`w-6 h-6 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`}
              />
            </button>

            <button
              onClick={() => setIsSaved((prev) => !prev)}
              className="p-2 text-white hover:scale-110 active:scale-95 transition-transform"
              aria-label="Enregistrer"
            >
              <Bookmark
                className={`w-6 h-6 ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-2 text-white hover:scale-110 active:scale-95 transition-transform"
              aria-label="Partager"
            >
              <Share2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Desktop Side Chevrons */}
        <button
          onClick={goToPrevItem}
          className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
          aria-label="Story précédente"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={goToNextItem}
          className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
          aria-label="Story suivante"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
