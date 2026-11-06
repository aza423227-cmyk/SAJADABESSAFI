import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Heart,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Check,
  Download,
  Loader2,
  Sparkles
} from 'lucide-react';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
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

  const handleDownloadStoryImage = async () => {
    if (!currentItem) return;
    setIsDownloading(true);

    try {
      const width = 1080;
      const height = 1920;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas not supported');
      }

      // 1. Draw Background Image or Spiritual Islamic Gradient
      let imageLoaded = false;
      if (currentItem.image) {
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = currentItem.image;
          await new Promise((res) => {
            img.onload = () => {
              imageLoaded = true;
              res(true);
            };
            img.onerror = () => res(false);
            setTimeout(() => res(false), 2000);
          });

          if (imageLoaded) {
            const scale = Math.max(width / img.width, height / img.height);
            const x = (width / 2) - (img.width / 2) * scale;
            const y = (height / 2) - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          }
        } catch {
          imageLoaded = false;
        }
      }

      if (!imageLoaded) {
        // Spiritual rich gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#064e3b'); // emerald-900
        grad.addColorStop(0.5, '#0c0a09'); // stone-950
        grad.addColorStop(1, '#134e4a'); // teal-900
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Dark Overlay Scrim for high-contrast typography
      const scrim = ctx.createLinearGradient(0, 0, 0, height);
      scrim.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      scrim.addColorStop(0.3, 'rgba(0, 0, 0, 0.4)');
      scrim.addColorStop(0.7, 'rgba(0, 0, 0, 0.6)');
      scrim.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = scrim;
      ctx.fillRect(0, 0, width, height);

      // Gold Decorative Frame Border
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
      ctx.lineWidth = 10;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(55, 55, width - 110, height - 110);

      // App Wordmark & Title at Top
      ctx.textAlign = 'center';
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('SAJADA BESSAFI', width / 2, 170);

      ctx.fillStyle = '#fef3c7';
      ctx.font = '500 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(currentStory.title + ' · ' + currentStory.category, width / 2, 230);

      // Arabic Calligraphy in Center
      let currentY = 700;
      if (currentItem.arabicText) {
        ctx.fillStyle = '#fde68a'; // amber-200
        ctx.font = 'bold 64px "Amiri", serif';
        const words = currentItem.arabicText.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > width - 200 && n > 0) {
            ctx.fillText(line, width / 2, currentY);
            line = words[n] + ' ';
            currentY += 105;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, width / 2, currentY);
        currentY += 120;
      }

      // French Translation
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 42px "Plus Jakarta Sans", sans-serif';
      const transWords = currentItem.translation.split(' ');
      let transLine = '';
      for (let n = 0; n < transWords.length; n++) {
        const testLine = transLine + transWords[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > width - 240 && n > 0) {
          ctx.fillText(transLine, width / 2, currentY);
          transLine = transWords[n] + ' ';
          currentY += 65;
        } else {
          transLine = testLine;
        }
      }
      ctx.fillText(transLine, width / 2, currentY);
      currentY += 95;

      // Source Badge
      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'italic 32px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`— ${currentItem.source} —`, width / 2, currentY);

      // Footer
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('تطبيق SAJADA BESSAFI · مواقيت صلاة وقصص دينية', width / 2, height - 120);

      // Convert to image download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `sajada-bessafi-story-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setDownloadToast('تم تنزيل الصورة الدينية بنجاح في معرض هاتفك 📥');
      setTimeout(() => setDownloadToast(null), 3500);
    } catch {
      // Fallback
      if (currentItem.image) {
        const a = document.createElement('a');
        a.href = currentItem.image;
        a.download = `sajada-bessafi-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      setDownloadToast('تم بدء تنزيل الصورة 📥');
      setTimeout(() => setDownloadToast(null), 3500);
    } finally {
      setIsDownloading(false);
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

            <div className="flex items-center gap-1.5 sm:gap-2 text-white">
              <button
                onClick={handleDownloadStoryImage}
                disabled={isDownloading}
                className="p-1.5 rounded-full bg-emerald-600/80 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1 px-2.5"
                title="تنزيل الصورة الدينية إلى معرض الهاتف"
                aria-label="تنزيل الصورة الدينية"
              >
                {isDownloading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px] font-semibold hidden sm:inline">تنزيل</span>
              </button>
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

        {/* Floating Download Toast */}
        {downloadToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-600 text-white text-xs px-4 py-2 rounded-full shadow-xl backdrop-blur-md flex items-center gap-2 border border-emerald-400/50 animate-bounce">
            <Check className="w-4 h-4 text-white stroke-[3]" />
            <span>{downloadToast}</span>
          </div>
        )}

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
              onClick={handleDownloadStoryImage}
              disabled={isDownloading}
              className="p-2 text-emerald-400 hover:text-emerald-300 hover:scale-110 active:scale-95 transition-transform"
              aria-label="تنزيل الصورة الدينية إلى معرض هاتفي"
              title="تنزيل الصورة الدينية إلى معرض الهاتف"
            >
              {isDownloading ? (
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
              ) : (
                <Download className="w-6 h-6" />
              )}
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
