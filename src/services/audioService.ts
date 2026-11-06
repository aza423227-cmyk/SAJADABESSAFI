// Web Audio API synthesizer & Real Audio Player for SAJADA BESSAFI
// Instagram-styled audio experiences: Adhan, Takbirat, Tasbih clicks, and spiritual chimes

export interface AdhanVoice {
  id: string;
  titleAr: string;
  titleFr: string;
  reciter: string;
  place: string;
  duration: string;
  audioUrl: string;
  coverImage: string;
  badge: string; // e.g. "Trending Instagram Audio"
}

export const ADHAN_VOICES: AdhanVoice[] = [
  {
    id: 'makkah',
    titleAr: 'أذان مكة المكرمة',
    titleFr: 'Adhan de La Mecque',
    reciter: 'الشيخ علي ملا',
    place: 'المسجد الحرام · La Mecque',
    duration: '03:45',
    audioUrl: '/audio/adhan_makkah.mp3',
    coverImage: '/src/assets/images/sajda_feed_mecca_night_1793965099116.jpg',
    badge: '🎵 Audio Tendance Instagram'
  },
  {
    id: 'madinah',
    titleAr: 'أذان المدينة المنورة',
    titleFr: 'Adhan de Médine',
    reciter: 'الشيخ عصام بخاري',
    place: 'المسجد النبوي الشريف · Médine',
    duration: '03:30',
    audioUrl: '/audio/adhan_madina.mp3',
    coverImage: '/src/assets/images/sajda_story_mosque_sunset_1793965100201.jpg',
    badge: '✨ Son Sacré Officiel'
  },
  {
    id: 'aqsa',
    titleAr: 'أذان المسجد الأقصى',
    titleFr: 'Adhan Al-Quds',
    reciter: 'مؤذنو القدس الشريف',
    place: 'المسجد الأقصى المبارك · Jérusalem',
    duration: '04:10',
    audioUrl: '/audio/adhan_aqsa.mp3',
    coverImage: '/src/assets/images/sajda_story_quran_serenity_1793965097705.jpg',
    badge: '🕌 Patrimoine & Émotion'
  },
  {
    id: 'fajr_calm',
    titleAr: 'أذان الفجر الهادئ',
    titleFr: 'Adhan Fajr Apaisant',
    reciter: 'الشيخ مشاري راشد العفاسي',
    place: 'الصلاة خير من النوم',
    duration: '04:20',
    audioUrl: '/audio/adhan_fajr.mp3',
    coverImage: '/src/assets/images/sajda_feed_nature_stars_1793965099973.jpg',
    badge: '🌙 Spécial Aube & Sérénité'
  }
];

export function playRealRecitation(audioPath: string = '/audio/surat_ash_sharh.mp3', onEnded?: () => void): () => void {
  stopAdhanPlayback();
  try {
    const audio = new Audio(audioPath);
    currentHtmlAudio = audio;
    audio.onended = () => {
      if (onEnded) onEnded();
    };
    audio.onerror = () => {
      playSpiritualTone();
      if (onEnded) onEnded();
    };
    audio.play().catch(() => {
      playSpiritualTone();
      if (onEnded) onEnded();
    });
    return () => {
      audio.pause();
      currentHtmlAudio = null;
    };
  } catch {
    playSpiritualTone();
    return () => {};
  }
}

let audioCtx: AudioContext | null = null;
let currentHtmlAudio: HTMLAudioElement | null = null;
let activeSynthNodes: { stop: () => void } | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a delicate tactile click sound for Tasbih bead counting
 */
export function playTasbihClickSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);

    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
  } catch {
    // Ignore audio permission error
  }
}

/**
 * Play a warm peaceful milestone chime when completing a dhikr cycle
 */
export function playMilestoneChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.15, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.65);
    });

    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 80]);
    }
  } catch {
    // Ignore
  }
}

/**
 * Play gentle spiritual reminder tone
 */
export function playSpiritualTone() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const melody = [392.0, 440.0, 523.25, 587.33, 659.25];

    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.35);

      gain.gain.setValueAtTime(0.01, now + i * 0.35);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.35 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.35 + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.35);
      osc.stop(now + i * 0.35 + 0.8);
    });
  } catch {
    // Ignore
  }
}

/**
 * Stop any ongoing Adhan playback (HTML audio or synthesized)
 */
export function stopAdhanPlayback() {
  if (currentHtmlAudio) {
    currentHtmlAudio.pause();
    currentHtmlAudio.currentTime = 0;
    currentHtmlAudio = null;
  }
  if (activeSynthNodes) {
    activeSynthNodes.stop();
    activeSynthNodes = null;
  }
}

/**
 * Synthesizes the sacred Adhan chant ("Allahu Akbar...") using additive oscillators with harmonics
 * Ensures audio ALWAYS plays even if network / CORS blocks external mp3 files.
 */
export function synthesizeSacredAdhan(onEnded?: () => void) {
  stopAdhanPlayback();
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Traditional Maqam Bayati / Rast Adhan chant pitches (frequencies in Hz)
  // [pitch, durationSeconds, delayFromStart]
  const notes: [number, number, number][] = [
    // Al-laa-hu Ak-bar (1)
    [293.66, 1.2, 0.0],  // D4: Al-
    [329.63, 1.6, 1.2],  // E4: laa-
    [349.23, 1.0, 2.8],  // F4: hu
    [293.66, 1.8, 3.8],  // D4: Ak-bar
    // Al-laa-hu Ak-bar (2)
    [293.66, 1.0, 6.0],  // D4
    [349.23, 1.8, 7.0],  // F4
    [392.00, 1.2, 8.8],  // G4
    [349.23, 2.0, 10.0], // F4
    [293.66, 2.4, 12.0], // D4
    // Ash-hadu alla ilaha illallah
    [261.63, 1.2, 15.0], // C4
    [293.66, 1.5, 16.2], // D4
    [329.63, 2.5, 17.7], // E4
    [293.66, 2.8, 20.2]  // D4
  ];

  const totalDuration = 24.0;
  const oscillators: OscillatorNode[] = [];

  notes.forEach(([freq, dur, startTime]) => {
    // Fundamental + 2 harmonics for rich vocal warmth
    [1, 2, 3].forEach((harmonic, hIdx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = hIdx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * harmonic, now + startTime);

      const maxGain = (0.22 / harmonic) * (hIdx === 0 ? 1 : 0.4);
      gain.gain.setValueAtTime(0.0001, now + startTime);
      gain.gain.linearRampToValueAtTime(maxGain, now + startTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + startTime + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + startTime);
      osc.stop(now + startTime + dur + 0.1);
      oscillators.push(osc);
    });
  });

  const timer = setTimeout(() => {
    if (onEnded) onEnded();
  }, totalDuration * 1000);

  activeSynthNodes = {
    stop: () => {
      clearTimeout(timer);
      oscillators.forEach((o) => {
        try {
          o.stop();
        } catch {
          // ignore
        }
      });
    }
  };
}

/**
 * Play an Adhan voice (try real audio element first, with seamless fallback to synthesized Adhan)
 */
export function playAdhanVoice(
  voice: AdhanVoice,
  onProgress?: (currentTime: number, duration: number) => void,
  onEnded?: () => void
): () => void {
  stopAdhanPlayback();

  let hasEnded = false;
  const handleEnd = () => {
    if (hasEnded) return;
    hasEnded = true;
    if (onEnded) onEnded();
  };

  try {
    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.src = voice.audioUrl;
    currentHtmlAudio = audio;

    audio.ontimeupdate = () => {
      if (onProgress && audio.duration) {
        onProgress(audio.currentTime, audio.duration);
      }
    };

    audio.onended = handleEnd;

    audio.onerror = () => {
      // Audio network or format failed -> gracefully switch to synthesized sacred Adhan!
      currentHtmlAudio = null;
      synthesizeSacredAdhan(handleEnd);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay policy or fetch error -> use Web Audio API synthesizer
        currentHtmlAudio = null;
        synthesizeSacredAdhan(handleEnd);
      });
    }
  } catch {
    synthesizeSacredAdhan(handleEnd);
  }

  return () => {
    stopAdhanPlayback();
  };
}
