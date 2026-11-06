import { useState } from 'react';
import { X, Sparkles, HeartHandshake, Compass, BookOpen, Send, Loader2 } from 'lucide-react';
import { getSpiritualCounsel, SpiritualGuidanceResult } from '../services/geminiService';

interface SajdaAIModalProps {
  onClose: () => void;
}

const MOODS = [
  { id: 'anxiety', label: 'Anxiété & Stress', icon: '🍃' },
  { id: 'grief', label: 'Tristesse & Épreuve', icon: '🌧️' },
  { id: 'gratitude', label: 'Gratitude & Sérénité', icon: '✨' },
  { id: 'decision', label: 'Doute & Choix de vie', icon: '🧭' }
];

export default function SajdaAIModal({ onClose }: SajdaAIModalProps) {
  const [selectedMood, setSelectedMood] = useState<string>('anxiety');
  const [customQuery, setCustomQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState<SpiritualGuidanceResult | null>(null);

  const handleFetchGuidance = async (moodKey: string, queryText?: string) => {
    setLoading(true);
    try {
      const res = await getSpiritualCounsel(queryText || moodKey, moodKey);
      setGuidance(res);
    } finally {
      setLoading(false);
    }
  };

  const handleMoodClick = (moodId: string) => {
    setSelectedMood(moodId);
    handleFetchGuidance(moodId);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;
    handleFetchGuidance('custom', customQuery.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-900 dark:text-stone-100 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-base font-bold">Compagnon SAJADA BESSAFI AI</h3>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-5">
          Partagez ce qui traverse votre cœur pour recevoir un verset, une du'a et un conseil bienveillant.
        </p>

        {/* Emotion Selector */}
        <div className="mb-4">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 block mb-2">
            Comment vous sentez-vous aujourd'hui ?
          </span>
          <div className="grid grid-cols-2 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMoodClick(m.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border text-left transition-all ${
                  selectedMood === m.id
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                    : 'border-stone-200 dark:border-stone-700 hover:border-emerald-400 bg-stone-50/50 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom query input */}
        <form onSubmit={handleSubmitCustom} className="mb-6">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ou écrivez : 'Je ressens une peur pour l'avenir'..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!customQuery.trim() || loading}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition-all"
              aria-label="Consulter"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Guidance Result Box */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-stone-400 text-xs">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
            <span>Consultation des paroles de sagesse...</span>
          </div>
        ) : guidance ? (
          <div className="space-y-4 bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-800 animate-fadeIn">
            {/* Arabic verse */}
            <div className="text-center py-2">
              <p className="font-arabic text-xl sm:text-2xl text-stone-900 dark:text-amber-100 leading-[2.1]">
                {guidance.verseArabic}
              </p>
            </div>

            {/* Translation & Source */}
            <div className="border-t border-stone-200 dark:border-stone-700/60 pt-3">
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-medium leading-relaxed italic">
                {guidance.verseTranslation}
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                — {guidance.verseSource}
              </div>
            </div>

            {/* Hadith / Dua */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40 text-xs text-stone-700 dark:text-stone-300">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                Invocation & Sagesse :
              </span>
              <p className="leading-relaxed">{guidance.hadithOrDua}</p>
            </div>

            {/* Spiritual counsel */}
            <div className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-700">
              <span className="font-bold text-stone-900 dark:text-stone-100 block mb-1">
                Conseil pour votre cœur :
              </span>
              <p>{guidance.counsel}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
