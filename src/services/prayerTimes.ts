import { CityLocation, PrayerTimeItem, PrayerName } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Marseille', country: 'France', latitude: 43.2965, longitude: 5.3698, timezone: 'Europe/Paris' },
  { name: 'Lyon', country: 'France', latitude: 45.7640, longitude: 4.8357, timezone: 'Europe/Paris' },
  { name: 'Lille', country: 'France', latitude: 50.6292, longitude: 3.0573, timezone: 'Europe/Paris' },
  { name: 'Bruxelles', country: 'Belgique', latitude: 50.8503, longitude: 4.3517, timezone: 'Europe/Brussels' },
  { name: 'Genève', country: 'Suisse', latitude: 46.2044, longitude: 6.1432, timezone: 'Europe/Zurich' },
  { name: 'Casablanca', country: 'Maroc', latitude: 33.5731, longitude: -7.5898, timezone: 'Africa/Casablanca' },
  { name: 'Rabat', country: 'Maroc', latitude: 34.0209, longitude: -6.8416, timezone: 'Africa/Casablanca' },
  { name: 'Alger', country: 'Algérie', latitude: 36.7538, longitude: 3.0588, timezone: 'Africa/Algiers' },
  { name: 'Tunis', country: 'Tunisie', latitude: 36.8065, longitude: 10.1815, timezone: 'Africa/Tunis' },
  { name: 'Dakar', country: 'Sénégal', latitude: 14.7167, longitude: -17.4677, timezone: 'Africa/Dakar' },
  { name: 'Londres', country: 'Royaume-Uni', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Montréal', country: 'Canada', latitude: 45.5017, longitude: -73.5673, timezone: 'America/Toronto' },
  { name: 'Dubaï', country: 'Émirats Arabes Unis', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  { name: 'La Mecque', country: 'Arabie Saoudite', latitude: 21.4225, longitude: 39.8262, timezone: 'Asia/Riyadh' },
  { name: 'Médine', country: 'Arabie Saoudite', latitude: 24.5247, longitude: 39.5692, timezone: 'Asia/Riyadh' },
  { name: 'Istanbul', country: 'Turquie', latitude: 41.0082, longitude: 28.9784, timezone: 'Europe/Istanbul' }
];

export interface CalculationMethod {
  id: string;
  name: string;
  fajrAngle: number;
  ishaAngle: number;
  isIshaInterval?: boolean;
  ishaIntervalMinutes?: number;
}

export const CALCULATION_METHODS: Record<string, CalculationMethod> = {
  uoif: { id: 'uoif', name: 'France (UOIF - 12°)', fajrAngle: 12, ishaAngle: 12 },
  mwl: { id: 'mwl', name: 'Ligue Islamique Mondiale (18° / 17°)', fajrAngle: 18, ishaAngle: 17 },
  makkah: { id: 'makkah', name: 'Oumm al-Qoura (La Mecque 18.5°)', fajrAngle: 18.5, ishaAngle: 19, isIshaInterval: true, ishaIntervalMinutes: 90 },
  isna: { id: 'isna', name: 'ISNA Amérique du Nord (15°)', fajrAngle: 15, ishaAngle: 15 },
  egypt: { id: 'egypt', name: 'Autorité Égyptienne (19.5° / 17.5°)', fajrAngle: 19.5, ishaAngle: 17.5 }
};

const d2r = (d: number) => (d * Math.PI) / 180;
const r2d = (r: number) => (r * 180) / Math.PI;

function getJulianDate(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;
  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  return jd;
}

function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = 357.529 + 0.98560028 * D;
  const q = 280.459 + 0.98564736 * D;
  const L = q + 1.915 * Math.sin(d2r(g)) + 0.020 * Math.sin(d2r(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = r2d(Math.atan2(Math.cos(d2r(e)) * Math.sin(d2r(L)), Math.cos(d2r(L)))) / 15;
  const d = r2d(Math.asin(Math.sin(d2r(e)) * Math.sin(d2r(L))));
  const EqT = (q / 15 - (RA < 0 ? RA + 24 : RA)) * 60;
  return { declination: d, equationOfTime: EqT };
}

function computeTime(angle: number, lat: number, dec: number, direction: 'ccw' | 'cw'): number {
  const cosH = (Math.sin(d2r(-angle)) - Math.sin(d2r(lat)) * Math.sin(d2r(dec))) /
               (Math.cos(d2r(lat)) * Math.cos(d2r(dec)));
  if (cosH > 1) return 0; // sun never rises to this angle
  if (cosH < -1) return 12; // sun never sets below this angle
  const H = r2d(Math.acos(cosH)) / 15;
  return direction === 'ccw' ? -H : H;
}

function computeAsrTime(shadowFactor: number, lat: number, dec: number): number {
  const angle = -r2d(Math.atan(1 / (shadowFactor + Math.tan(d2r(Math.abs(lat - dec))))));
  return computeTime(angle, lat, dec, 'cw');
}

export function formatTimeMinutes(hoursDecimal: number): string {
  let normalized = (hoursDecimal + 24) % 24;
  const hours = Math.floor(normalized);
  const minutes = Math.floor((normalized - hours) * 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function calculatePrayerTimes(
  city: CityLocation,
  date: Date = new Date(),
  methodKey: string = 'uoif'
): PrayerTimeItem[] {
  const method = CALCULATION_METHODS[methodKey] || CALCULATION_METHODS.uoif;
  const jd = getJulianDate(date);
  const { declination, equationOfTime } = sunPosition(jd);

  // Timezone offset in hours
  // Estimate local standard timezone offset from longitude if exact timezone calculation
  // Or use Date timezone offset
  const timezoneOffset = -date.getTimezoneOffset() / 60;

  // Midday (Dhuhr)
  const dhuhr = 12 + timezoneOffset - city.longitude / 15 - equationOfTime / 60;
  
  // Sunrise & Sunset (angle ~ 0.8333 degrees for atmospheric refraction)
  const sunriseOffset = computeTime(0.8333, city.latitude, declination, 'ccw');
  const sunsetOffset = computeTime(0.8333, city.latitude, declination, 'cw');
  const sunrise = dhuhr + sunriseOffset;
  const maghrib = dhuhr + sunsetOffset;

  // Fajr
  const fajrOffset = computeTime(method.fajrAngle, city.latitude, declination, 'ccw');
  const fajr = dhuhr + fajrOffset;

  // Asr (Standard: 1x shadow)
  const asrOffset = computeAsrTime(1, city.latitude, declination);
  const asr = dhuhr + asrOffset;

  // Isha
  let isha = 0;
  if (method.isIshaInterval && method.ishaIntervalMinutes) {
    isha = maghrib + method.ishaIntervalMinutes / 60;
  } else {
    const ishaOffset = computeTime(method.ishaAngle, city.latitude, declination, 'cw');
    isha = dhuhr + ishaOffset;
  }

  const times: PrayerTimeItem[] = [
    { name: 'Fajr', labelFr: 'Fajr', arabicName: 'الفجر', time: formatTimeMinutes(fajr) },
    { name: 'Sunrise', labelFr: 'Chourouq', arabicName: 'الشروق', time: formatTimeMinutes(sunrise) },
    { name: 'Dhuhr', labelFr: 'Dhuhr', arabicName: 'الظهر', time: formatTimeMinutes(dhuhr) },
    { name: 'Asr', labelFr: 'Asr', arabicName: 'العصر', time: formatTimeMinutes(asr) },
    { name: 'Maghrib', labelFr: 'Maghrib', arabicName: 'المغرب', time: formatTimeMinutes(maghrib) },
    { name: 'Isha', labelFr: 'Icha', arabicName: 'العشاء', time: formatTimeMinutes(isha) },
  ];

  // Determine current and next prayer
  const now = date.getHours() * 60 + date.getMinutes();
  let foundNext = false;

  for (let i = 0; i < times.length; i++) {
    const [h, m] = times[i].time.split(':').map(Number);
    const prayerMinutes = h * 60 + m;

    if (prayerMinutes > now && !foundNext) {
      times[i].isNext = true;
      foundNext = true;
      if (i > 0) times[i - 1].isCurrent = true;
    } else if (prayerMinutes <= now) {
      times[i].isPassed = true;
    }
  }

  if (!foundNext) {
    // Next prayer is Fajr tomorrow
    times[0].isNext = true;
    times[times.length - 1].isCurrent = true;
  }

  return times;
}

export function getCountdownToNextPrayer(prayerTimes: PrayerTimeItem[], now: Date = new Date()): {
  nextPrayer: PrayerTimeItem;
  remainingSeconds: number;
  formattedCountdown: string;
  progressPercent: number;
} {
  const next = prayerTimes.find(p => p.isNext) || prayerTimes[0];
  const [nh, nm] = next.time.split(':').map(Number);
  
  const target = new Date(now);
  target.setHours(nh, nm, 0, 0);

  // If next is earlier in the day than now (Fajr next day)
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));

  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  const formattedCountdown = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Approximate progress of current prayer window (total window ~ 3.5h)
  const windowSec = 3.5 * 3600;
  const progressPercent = Math.min(100, Math.max(0, Math.round(((windowSec - diffSec) / windowSec) * 100)));

  return {
    nextPrayer: next,
    remainingSeconds: diffSec,
    formattedCountdown,
    progressPercent
  };
}

export function calculateQiblaDirection(latitude: number, longitude: number): { bearing: number; compassDirection: string } {
  // Kaaba coordinates
  const kaabaLat = d2r(21.422487);
  const kaabaLng = d2r(39.826206);
  const userLat = d2r(latitude);
  const userLng = d2r(longitude);

  const deltaLng = kaabaLng - userLng;
  const y = Math.sin(deltaLng);
  const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(deltaLng);

  let bearing = (r2d(Math.atan2(y, x)) + 360) % 360;
  bearing = Math.round(bearing * 10) / 10;

  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  const compassDirection = directions[index];

  return { bearing, compassDirection };
}

export function getHijriDate(date: Date = new Date()): { day: number; monthNameFr: string; monthNameAr: string; year: number } {
  // Simple accurate Islamic Umm al Qura calendar approximation
  // Gregorian to Julian
  const jd = getJulianDate(date);
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) + (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const m = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * m) / 24);
  const year = 30 * n + j - 30;

  const hijriMonthsFr = [
    'Mouharram', 'Safar', 'Rabi al-Awwal', 'Rabi ath-Thani', 'Joumada al-Oula',
    'Joumada ath-Thania', 'Rajab', 'Chaabane', 'Ramadan', 'Chawwal',
    'Dhou al-Qi\'da', 'Dhou al-Hijja'
  ];

  const hijriMonthsAr = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى',
    'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
    'ذو القعدة', 'ذو الحجة'
  ];

  const monthIndex = Math.min(11, Math.max(0, m - 1));

  return {
    day,
    monthNameFr: hijriMonthsFr[monthIndex],
    monthNameAr: hijriMonthsAr[monthIndex],
    year
  };
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = d2r(lat2 - lat1);
  const dLon = d2r(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(d2r(lat1)) * Math.cos(d2r(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findClosestKnownCity(lat: number, lng: number): CityLocation {
  let closest = POPULAR_CITIES[0];
  let minDistance = Infinity;
  for (const city of POPULAR_CITIES) {
    const dist = distanceKm(lat, lng, city.latitude, city.longitude);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }
  return closest;
}

const STORAGE_KEY = 'sajada_user_city_location';

export function saveStoredCity(city: CityLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(city));
  } catch {
    // ignore
  }
}

export function getStoredCity(): CityLocation | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function detectUserGeolocation(): Promise<CityLocation> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12`,
            { headers: { 'Accept-Language': 'fr,ar,en' } }
          );
          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            const cityName =
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              address.suburb ||
              address.county ||
              'Ma Position';
            const country = address.country || '';
            const detectedCity: CityLocation = {
              name: cityName,
              country,
              latitude,
              longitude,
              timezone
            };
            saveStoredCity(detectedCity);
            resolve(detectedCity);
            return;
          }
        } catch {
          // Fallback to closest city calculation
        }

        const closest = findClosestKnownCity(latitude, longitude);
        const fallbackCity: CityLocation = {
          name: closest ? `${closest.name} (GPS)` : 'Position Actuelle',
          country: closest?.country || 'GPS',
          latitude,
          longitude,
          timezone
        };
        saveStoredCity(fallbackCity);
        resolve(fallbackCity);
      },
      (error) => {
        reject(error);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

