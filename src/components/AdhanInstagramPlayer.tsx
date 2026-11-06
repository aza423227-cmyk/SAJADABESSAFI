import { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music2,
  Sparkles,
  Share2,
  Check,
  Disc,
  X
} from 'lucide-react';
import { ADHAN_VOICES, AdhanVoice, playAdhanVoice, stopAdhanPlayback } from '../services/audioService';

interface AdhanInstagramPlayerProps {
  onClose?: () => void;
  selectedVoiceId?: string;
  onSelectVoice?: (voice: AdhanVoice) => void;
}

export default function AdhanInstagramPlayer({
  onClose,
  selectedVoiceId = 'makkah',
  onSelectVoice
}: AdhanInstagramPlayerProps) {
  const [activeVoice, setActiveVoice] = useState<AdhanVoice>(
    ADHAN_VOICES.find((v) => v.id === selectedVoiceId) || ADHAN_VOICES[0]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copiedSticker, setCopiedSticker] = useState(false);

  useEffect(() => {
    return () => {
      stopAdhanPlayback();
    };
  }, []);

  const handleTogglePlay = (voice: AdhanVoice) => {
    if (isPlaying && activeVoice.id === voice.id) {
      stopAdhanPlayback();
      setIsPlaying(false);
      return;
    }

    setActiveVoice(voice);
    setIsPlaying(true);
    setCurrentTime(0);

    playAdhanVoice(
      voice,
      (curr, dur) => {
        setCurrentTime(curr);
        setDuration(dur);
      },
      () => {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    );

    if (onSelectVoice) {
      onSelectVoice(voice);
    }
  };

  const handleSetDefault = (voice: AdhanVoice) => {
    setActiveVoice(voice);
    if (onSelectVoice) {
      onSelectVoice(voice);
    }
  };

  const handleCopyInstagramAudioSticker = () => {
    const text = `🎵 ${activeVoice.titleAr} (${activeVoice.reciter})\n📍 ${activeVoice.place}\n✨ SAJADA BESSAFI • Audio Tendance Instagram`;
    navigator.clipboard.writeText(text);
    setCopiedSticker(true);
    setTimeout(() => setCopiedSticker(false), 2500);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 shadow-lg space-y-5">
      {/* Header: Instagram Sound Bar Title */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Music2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 dark:text-stone-100">
              <span className="font-arabic text-sm">{activeVoice.titleAr}</span>
              <span className="text-[10px] text-rose-500 font-semibold">• Instagram Sound</span>
            </div>
            <div className="text-[11px] text-stone-400">
              {activeVoice.reciter} · {activeVoice.place}
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Playing Highlight Card (Instagram Reel / Story Sound Style) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-950 via-stone-900 to-emerald-950 p-4 text-white border border-emerald-900/40 shadow-inner">
        <div className="flex items-center gap-4">
          {/* Spinning Vinyl cover */}
          <div className="relative w-16 h-16 shrink-0">
            <img
              src={activeVoice.coverImage}
              alt={activeVoice.titleAr}
              className={`w-full h-full object-cover rounded-full border-2 border-emerald-400 shadow-md ${
                isPlaying ? 'animate-spin [animation-duration:6s]' : ''
              }`}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-stone-900 border border-white/60" />
            </div>
          </div>

          {/* Details & Waveform */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                {activeVoice.badge}
              </span>
              <span className="text-[11px] font-mono text-stone-300">
                {currentTime > 0 ? formatSeconds(currentTime) : '0:00'} / {duration > 0 ? formatSeconds(duration) : activeVoice.duration}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white font-arabic truncate mt-0.5">
              {activeVoice.titleAr}
            </h4>
            <p className="text-xs text-stone-300 truncate">{activeVoice.reciter}</p>

            {/* Instagram Equalizer Waveform Animation */}
            <div className="flex items-end gap-1 h-4 mt-2">
              {[40, 75, 55, 90, 60, 100, 45, 80, 65, 95, 50, 70].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (h * (0.6 + ((i * 7) % 5) / 10)))}%` : '20%',
                    animationDelay: `${i * 90}ms`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Play/Pause round button */}
          <button
            onClick={() => handleTogglePlay(activeVoice)}
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-stone-950 flex items-center justify-center shadow-lg transition-transform shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Écouter'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-stone-950" />
            ) : (
              <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* List of 4 Famous Adhan Reciters */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 block">
          Sélectionnez la voix de l'Adhan pour vos alertes de prière :
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ADHAN_VOICES.map((voice) => {
            const isSelected = activeVoice.id === voice.id;
            const isThisPlaying = isPlaying && isSelected;

            return (
              <div
                key={voice.id}
                onClick={() => handleSetDefault(voice)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 hover:border-emerald-300 bg-stone-50/50 dark:bg-stone-800/30'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={voice.coverImage}
                    alt={voice.titleFr}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 font-arabic truncate">
                      {voice.titleAr}
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                      {voice.reciter}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {voice.duration}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePlay(voice);
                    }}
                    className={`p-2 rounded-xl transition-transform active:scale-90 ${
                      isThisPlaying
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-500 hover:text-white'
                    }`}
                    aria-label={`Écouter ${voice.titleAr}`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Voix active" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instagram Sound Sticker Card Action */}
      <div className="p-3 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Disc className="w-4 h-4 text-pink-500 shrink-0" />
          <div className="truncate">
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              Sticker Audio Instagram
            </span>
            <span className="block text-[11px] text-stone-500 dark:text-stone-400 truncate">
              Utilisez ce son dans vos stories et partages
            </span>
          </div>
        </div>

        <button
          onClick={handleCopyInstagramAudioSticker}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:opacity-90 active:scale-95 text-white font-semibold text-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
        >
          {copiedSticker ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedSticker ? 'Copié !' : 'Partager Sticker'}</span>
        </button>
      </div>
    </div>
  );
}
