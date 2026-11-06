import { useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Sparkles, Check, Heart, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DHIKR_PRESETS } from '../data/mockFeedData';
import { DhikrPreset } from '../types';
import { playTasbihClickSound, playMilestoneChime } from '../services/audioService';

export default function TasbihView() {
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrPreset>(DHIKR_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState<number>(33);
  const [totalToday, setTotalToday] = useState(142);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(4);
  const [isPressing, setIsPressing] = useState(false);

  const handleTap = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 120);

    if (soundEnabled) {
      playTasbihClickSound();
    }

    const nextCount = count + 1;
    const nextTotal = totalToday + 1;
    setCount(nextCount);
    setTotalToday(nextTotal);

    // Reached target
    if (target > 0 && nextCount % target === 0) {
      setCompletedCycles((prev) => prev + 1);
      if (soundEnabled) {
        playMilestoneChime();
      }
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  const handleSelectPreset = (preset: DhikrPreset) => {
    setSelectedDhikr(preset);
    setTarget(preset.recommendedTarget);
    setCount(0);
  };

  const progressPercent = target > 0 ? Math.min(100, Math.round((count / target) * 100)) : 100;
  const radius = 96;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = target > 0 ? circumference - (progressPercent / 100) * circumference : 0;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Top Banner: Total stats */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Total récitations aujourd'hui</div>
            <div className="text-lg font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
              {totalToday} <span className="text-xs font-normal text-stone-400">({completedCycles} cycles)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={soundEnabled ? 'Couper le son' : 'Activer le son'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Réinitialiser le compteur"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dhikr Selector Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {DHIKR_PRESETS.map((preset) => {
          const isSelected = selectedDhikr.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-emerald-400'
              }`}
            >
              {preset.transliteration} ({preset.recommendedTarget})
            </button>
          );
        })}
      </div>

      {/* Main Dhikr Card with Arabic & Virtue */}
      <div className="text-center p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-sm">
        <p className="font-arabic text-3xl sm:text-4xl text-emerald-700 dark:text-amber-200/90 leading-[2.1] mb-2">
          {selectedDhikr.arabic}
        </p>
        <p className="text-sm font-semibold text-stone-800 dark:text-stone-200 mb-1">
          {selectedDhikr.transliteration}
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 max-w-sm mx-auto">
          « {selectedDhikr.translation} »
        </p>

        {/* Virtue notice */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-xs text-left max-w-md mx-auto">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
          <span className="leading-snug">{selectedDhikr.virtue}</span>
        </div>

        {/* Central Tactile Counting Ring Button */}
        <div className="relative my-8 flex items-center justify-center">
          {/* Circular SVG Progress Ring */}
          <svg className="w-64 h-64 -rotate-90 transform">
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-stone-100 dark:text-stone-800"
            />
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-150 ease-out"
            />
          </svg>

          {/* Central Button */}
          <button
            onClick={handleTap}
            className={`absolute w-44 h-44 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl flex flex-col items-center justify-center select-none active:scale-95 transition-all cursor-pointer ${
              isPressing ? 'scale-90 shadow-sm' : 'hover:scale-[1.02]'
            }`}
            aria-label="Incrémenter le tasbih"
          >
            <span className="text-5xl font-black font-mono tabular-nums tracking-tight">
              {count}
            </span>
            <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold mt-1">
              {target > 0 ? `/ ${target}` : 'Libre'}
            </span>
            <span className="text-[10px] text-white/70 mt-1">Touchez pour compter</span>
          </button>
        </div>

        {/* Target Buttons */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <span className="text-xs text-stone-400 mr-1">Objectif :</span>
          {[33, 99, 100, 0].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                setCount(0);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                target === t
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {t === 0 ? 'Illimité' : t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
