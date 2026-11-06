import { useState, useEffect } from 'react';
import { X, Compass, CheckCircle2, RotateCw } from 'lucide-react';
import { calculateQiblaDirection } from '../services/prayerTimes';

interface QiblaModalProps {
  latitude?: number;
  longitude?: number;
  cityName?: string;
  onClose: () => void;
}

export default function QiblaModal({
  latitude = 48.8566,
  longitude = 2.3522,
  cityName = 'Paris',
  onClose
}: QiblaModalProps) {
  const { bearing, compassDirection } = calculateQiblaDirection(latitude, longitude);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [hasCompassSensor, setHasCompassSensor] = useState(false);

  // Device orientation listener for mobile devices
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // webkitCompassHeading for iOS, alpha for Android
      let heading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (heading === undefined && e.alpha !== null) {
        heading = (360 - e.alpha) % 360;
      }
      if (heading !== undefined) {
        setDeviceHeading(Math.round(heading));
        setHasCompassSensor(true);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  // Relative needle angle to Kaaba
  const qiblaRelativeAngle = (bearing - deviceHeading + 360) % 360;
  const isAligned = Math.abs(qiblaRelativeAngle) < 6 || Math.abs(qiblaRelativeAngle - 360) < 6;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-2xl text-stone-900 dark:text-stone-100 flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Fermer la boussole"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1 text-emerald-600 dark:text-emerald-400">
          <Compass className="w-5 h-5" />
          <h3 className="text-base font-bold">Direction de la Qibla</h3>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 text-center">
          Depuis <span className="font-semibold text-stone-800 dark:text-stone-200">{cityName}</span> vers la Kaaba (La Mecque)
        </p>

        {/* Alignment Indicator Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-6 transition-colors ${
            isAligned
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-400 animate-pulse'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
          }`}
        >
          {isAligned ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Vous faites face à la Qibla !</span>
            </>
          ) : (
            <span>Tournez votre appareil vers {bearing}° ({compassDirection})</span>
          )}
        </div>

        {/* COMPASS DIAL */}
        <div className="relative w-64 h-64 rounded-full border-4 border-stone-200 dark:border-stone-800 flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950 shadow-inner">
          {/* Degree ticks & Cardinal directions */}
          <span className="absolute top-2 text-xs font-bold text-rose-500">N</span>
          <span className="absolute bottom-2 text-xs font-bold text-stone-400">S</span>
          <span className="absolute right-2.5 text-xs font-bold text-stone-400">E</span>
          <span className="absolute left-2.5 text-xs font-bold text-stone-400">O</span>

          {/* Kaaba Direction Marker on the rim */}
          <div
            className="absolute inset-0 flex items-start justify-center pointer-events-none transition-transform duration-300"
            style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }}
          >
            <div className="flex flex-col items-center -mt-3.5">
              <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-950 border-2 border-amber-400 shadow-md flex items-center justify-center text-[11px] font-bold text-amber-300">
                🕋
              </div>
              <div className="w-0.5 h-6 bg-amber-500/80" />
            </div>
          </div>

          {/* Needle / Compass center */}
          <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-800 border-2 border-emerald-500 shadow-lg flex items-center justify-center z-10">
            <div className="w-3 h-3 rounded-full bg-emerald-600" />
          </div>
        </div>

        {/* Bearing stats */}
        <div className="mt-6 text-center space-y-1">
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
            {bearing}° <span className="text-sm font-normal text-stone-500">({compassDirection})</span>
          </div>
          <p className="text-xs text-stone-400">
            Distance vers La Mecque : ~4 400 km
          </p>
        </div>

        {/* Manual rotation test slider for desktop or devices without compass */}
        {!hasCompassSensor && (
          <div className="w-full mt-6 pt-4 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
              <span className="flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Simulation d'orientation
              </span>
              <span className="tabular-nums font-mono">{deviceHeading}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={deviceHeading}
              onChange={(e) => setDeviceHeading(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
