import { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  Bell,
  BellOff,
  Flame,
  ChevronDown,
  Sparkles,
  Volume2,
  Music2,
  Navigation as NavIcon,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CityLocation, PrayerTimeItem, PrayerName } from '../types';
import {
  POPULAR_CITIES,
  CALCULATION_METHODS,
  calculatePrayerTimes,
  getCountdownToNextPrayer,
  getHijriDate,
  detectUserGeolocation,
  getStoredCity,
  saveStoredCity
} from '../services/prayerTimes';
import { ADHAN_VOICES, AdhanVoice } from '../services/audioService';
import AdhanInstagramPlayer from './AdhanInstagramPlayer';

interface PrayerWidgetProps {
  onOpenQibla: () => void;
}

export default function PrayerWidget({ onOpenQibla }: PrayerWidgetProps) {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(() => {
    return getStoredCity() || POPULAR_CITIES[0];
  });
  const [calculationMethod, setCalculationMethod] = useState<string>('uoif');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [showAdhanModal, setShowAdhanModal] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<AdhanVoice>(ADHAN_VOICES[0]);

  // Prayer tracker state for today
  const [completedPrayers, setCompletedPrayers] = useState<Record<PrayerName, boolean>>({
    Fajr: true,
    Sunrise: false,
    Dhuhr: true,
    Asr: false,
    Maghrib: false,
    Isha: false
  });
  const [streakDays] = useState(7);

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Try auto-detecting location if never saved
  useEffect(() => {
    const stored = getStoredCity();
    if (!stored && 'geolocation' in navigator) {
      setIsLocating(true);
      detectUserGeolocation()
        .then((city) => {
          setSelectedCity(city);
          setLocationSuccess(`Mواقيت مضبوطة حسب موقعك: ${city.name}`);
          setTimeout(() => setLocationSuccess(null), 4000);
        })
        .catch(() => {
          // silently keep default Paris
        })
        .finally(() => {
          setIsLocating(false);
        });
    }
  }, []);

  const prayerTimes = calculatePrayerTimes(selectedCity, currentTime, calculationMethod);
  const countdown = getCountdownToNextPrayer(prayerTimes, currentTime);
  const hijri = getHijriDate(currentTime);

  const handleTogglePrayer = (prayerName: PrayerName) => {
    if (prayerName === 'Sunrise') return;
    setCompletedPrayers((prev) => {
      const next = { ...prev, [prayerName]: !prev[prayerName] };
      const allDone = next.Fajr && next.Dhuhr && next.Asr && next.Maghrib && next.Isha;
      if (allDone) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return next;
    });
  };

  const handleLocateMe = async () => {
    setIsLocating(true);
    setLocationSuccess(null);
    try {
      const city = await detectUserGeolocation();
      setSelectedCity(city);
      setShowCityPicker(false);
      setLocationSuccess(`تم تحديد موقعك بدقة: ${city.name}`);
      setTimeout(() => setLocationSuccess(null), 4000);
    } catch {
      alert('تعذر الوصول إلى الموقع الجغرافي. يرجى تفعيل إذن الموقع في متصفحك أو اختيار المدينة يدوياً.');
    } finally {
      setIsLocating(false);
    }
  };

  const completedCount = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].filter(
    (p) => completedPrayers[p as PrayerName]
  ).length;

  return (
    <div className="w-full space-y-4">
      {/* Geolocation Success Toast */}
      {locationSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn">
          <NavIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{locationSuccess}</span>
        </div>
      )}

      {/* 1. Main Hero Prayer Card with Dynamic Time-of-Day Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-stone-900 to-teal-950 p-6 text-white shadow-lg border border-emerald-800/40">
        <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Top bar inside card: Location & Hijri date */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div className="relative">
            <button
              onClick={() => setShowCityPicker((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-medium text-stone-100 transition-colors"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span>{selectedCity.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-300" />
            </button>

            {/* City Picker Dropdown */}
            {showCityPicker && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-stone-900 border border-stone-700 rounded-2xl shadow-xl p-2 z-50 text-stone-200">
                <button
                  onClick={handleLocateMe}
                  disabled={isLocating}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-emerald-400 hover:bg-stone-800 rounded-xl flex items-center gap-2 mb-1 transition-colors"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <NavIcon className="w-3.5 h-3.5" />
                  )}
                  <span>تحديد موقعي التلقائي (GPS)</span>
                </button>
                <div className="h-px bg-stone-800 my-1" />
                <div className="max-h-48 overflow-y-auto no-scrollbar space-y-0.5">
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        setSelectedCity(city);
                        saveStoredCity(city);
                        setShowCityPicker(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs rounded-xl flex items-center justify-between hover:bg-stone-800 ${
                        selectedCity.name === city.name ? 'bg-emerald-950/80 text-emerald-400 font-semibold' : ''
                      }`}
                    >
                      <span>{city.name}</span>
                      <span className="text-[10px] text-stone-500">{city.country}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hijri Date Display */}
          <div className="text-right">
            <div className="text-xs font-medium text-amber-200/90 font-arabic">
              {hijri.day} {hijri.monthNameAr} {hijri.year} هـ
            </div>
            <div className="text-[11px] text-stone-300">
              {hijri.day} {hijri.monthNameFr} {hijri.year}
            </div>
          </div>
        </div>

        {/* Central Next Prayer Countdown */}
        <div className="relative z-10 text-center my-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90 mb-1">
            الصلاة القادمة · {countdown.nextPrayer.arabicName} ({countdown.nextPrayer.labelFr})
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight font-mono tabular-nums text-white my-2">
            {countdown.formattedCountdown}
          </div>
          <p className="text-xs text-stone-300">
            موعد الأذان : <span className="font-semibold text-white">{countdown.nextPrayer.time}</span>
          </p>

          {/* Active Adhan Voice indicator */}
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] text-amber-200">
            <Music2 className="w-3 h-3 text-rose-400" />
            <span>صوت الأذان : <strong className="text-white font-arabic">{selectedVoice.titleAr}</strong></span>
          </div>
        </div>

        {/* Quick action buttons on hero */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setShowAdhanModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500/30 to-purple-500/30 hover:from-rose-500/40 hover:to-purple-500/40 text-xs font-semibold transition-transform active:scale-95 backdrop-blur-md border border-white/15 shadow-sm"
          >
            <Music2 className="w-4 h-4 text-pink-400 animate-pulse" />
            <span>أصوات الأذان انستغرام</span>
          </button>

          <button
            onClick={onOpenQibla}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-transform active:scale-95 backdrop-blur-md"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>اتجاه القبلة</span>
          </button>

          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium transition-transform active:scale-95 backdrop-blur-md"
            title="تحديث الموقع الجغرافي"
          >
            <NavIcon className={`w-3.5 h-3.5 text-emerald-300 ${isLocating ? 'animate-spin' : ''}`} />
            <span>تحديث GPS</span>
          </button>
        </div>
      </div>

      {/* 2. Prayer Times Grid (All 6 times of the day) */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {prayerTimes.map((prayer) => {
          const isNext = prayer.isNext;
          const isCurrent = prayer.isCurrent;

          return (
            <div
              key={prayer.name}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isNext
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.02]'
                  : isCurrent
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
              }`}
            >
              <div className="text-xs font-bold font-arabic">{prayer.arabicName}</div>
              <div
                className={`text-[10px] my-0.5 ${
                  isNext ? 'text-emerald-100' : 'text-stone-400'
                }`}
              >
                {prayer.labelFr}
              </div>
              <div
                className={`text-sm sm:text-base font-bold font-mono tabular-nums ${
                  isNext ? 'text-white' : 'text-stone-900 dark:text-stone-100'
                }`}
              >
                {prayer.time}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Daily Prayer Checklist & Streak Card */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              صلواتي الخمس لليوم
            </h3>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              (<span className="tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">{completedCount}</span>/5)
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800/40">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="tabular-nums font-arabic">{streakDays} أيام متتالية</span>
          </div>
        </div>

        {/* 5 Obligatory prayer checklist buttons */}
        <div className="grid grid-cols-5 gap-2">
          {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as PrayerName[]).map((pName) => {
            const isDone = completedPrayers[pName];
            const pObj = prayerTimes.find((pt) => pt.name === pName);

            return (
              <button
                key={pName}
                onClick={() => handleTogglePrayer(pName)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                  isDone
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-emerald-400'
                }`}
                aria-label={`تأكيد أداء صلاة ${pObj?.arabicName}`}
              >
                <CheckCircle2
                  className={`w-5 h-5 mb-1 ${
                    isDone ? 'text-white' : 'text-stone-300 dark:text-stone-600'
                  }`}
                />
                <span className="text-xs font-bold font-arabic">{pObj?.arabicName}</span>
                <span className="text-[10px] font-mono tabular-nums opacity-80">{pObj?.time}</span>
              </button>
            );
          })}
        </div>

        {/* Method selector and notification controls */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-1.5">
            <span>طريقة الحساب :</span>
            <select
              value={calculationMethod}
              onChange={(e) => setCalculationMethod(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-lg px-2 py-1 text-xs border border-stone-200 dark:border-stone-700 focus:outline-none"
            >
              {Object.values(CALCULATION_METHODS).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setNotificationsEnabled((prev) => !prev)}
            className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 hover:text-emerald-500"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="w-3.5 h-3.5 text-emerald-500" />
                <span>تنبيهات الأذان مفعلة</span>
              </>
            ) : (
              <>
                <BellOff className="w-3.5 h-3.5 text-stone-400" />
                <span>التنبيهات صامتة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Instagram Adhan Modal */}
      {showAdhanModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-8">
            <AdhanInstagramPlayer
              selectedVoiceId={selectedVoice.id}
              onSelectVoice={(voice) => setSelectedVoice(voice)}
              onClose={() => setShowAdhanModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
