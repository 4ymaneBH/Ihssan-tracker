// Prayer Times Service - Islamic prayer time calculations
import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes, Prayer, Qibla } from 'adhan';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimesResult {
    fajr: Date;
    sunrise: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
    nextPrayer: {
        name: PrayerName;
        time: Date;
    } | null;
    currentPrayer: PrayerName | null;
    qiblaDirection: number;
}

export interface LocationCoordinates {
    latitude: number;
    longitude: number;
}

/**
 * Get the next upcoming prayer
 * @param prayerTimes - Today's prayer times
 * @param now - Current time
 * @param coordinates - Location coordinates (used for tomorrow's Fajr fallback)
 */
const getNextPrayer = (
    prayerTimes: AdhanPrayerTimes,
    now: Date,
    coordinates: Coordinates
): { name: PrayerName; time: Date } | null => {
    const prayers: { name: PrayerName; time: Date }[] = [
        { name: 'fajr', time: prayerTimes.fajr },
        { name: 'dhuhr', time: prayerTimes.dhuhr },
        { name: 'asr', time: prayerTimes.asr },
        { name: 'maghrib', time: prayerTimes.maghrib },
        { name: 'isha', time: prayerTimes.isha },
    ];

    // Find next prayer after current time
    for (const prayer of prayers) {
        if (prayer.time > now) {
            return prayer;
        }
    }

    // If no prayer found today, return tomorrow's Fajr using actual coordinates
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowParams = CalculationMethod.MuslimWorldLeague();
    const tomorrowPrayers = new AdhanPrayerTimes(coordinates, tomorrow, tomorrowParams);

    return { name: 'fajr', time: tomorrowPrayers.fajr };
};

/**
 * Get the current prayer time period
 */
const getCurrentPrayer = (prayerTimes: AdhanPrayerTimes, now: Date): PrayerName | null => {
    if (now < prayerTimes.fajr) return null;
    if (now < prayerTimes.dhuhr) return 'fajr';
    if (now < prayerTimes.asr) return 'dhuhr';
    if (now < prayerTimes.maghrib) return 'asr';
    if (now < prayerTimes.isha) return 'maghrib';
    return 'isha';
};

/**
 * Calculate prayer times for a given location and date
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param date - Date to calculate for (defaults to today)
 * @returns Prayer times for the day
 */
export const calculatePrayerTimes = (
    latitude: number,
    longitude: number,
    date: Date = new Date()
): PrayerTimesResult => {
    const coordinates = new Coordinates(latitude, longitude);

    // Using Muslim World League calculation method
    // You can make this configurable later
    const params = CalculationMethod.MuslimWorldLeague();

    const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);
    const now = new Date();

    // Calculate Qibla direction
    const qibla = new Qibla(coordinates);

    return {
        fajr: prayerTimes.fajr,
        sunrise: prayerTimes.sunrise,
        dhuhr: prayerTimes.dhuhr,
        asr: prayerTimes.asr,
        maghrib: prayerTimes.maghrib,
        isha: prayerTimes.isha,
        nextPrayer: getNextPrayer(prayerTimes, now, coordinates),
        currentPrayer: getCurrentPrayer(prayerTimes, now),
        qiblaDirection: qibla.direction,
    };
};

/**
 * Format time for display
 * @param date - Date to format
 * @param use24Hour - Whether to use 24-hour format
 * @param language - Language for formatting ('en' or 'ar')
 */
export const formatPrayerTime = (date: Date, use24Hour: boolean = false, language: string = 'en'): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (use24Hour) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    const hour12 = hours % 12 || 12;
    const period = hours >= 12 ? (language === 'ar' ? 'م' : 'PM') : (language === 'ar' ? 'ص' : 'AM');

    return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Get time remaining until a specific prayer
 * @param prayerTime - The prayer time
 * @returns Formatted string like "2h 30m"
 */
export const getTimeRemaining = (prayerTime: Date): string => {
    const now = new Date();
    const diff = prayerTime.getTime() - now.getTime();

    if (diff <= 0) return '0m';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
};

/**
 * Check if current time is past a prayer time (prayer is late)
 * @param prayerTime - The prayer time to check
 * @param nextPrayerTime - The next prayer time (to determine if missed)
 * @returns 'onTime' | 'late' | 'missed'
 */
export const getPrayerStatus = (
    prayerTime: Date,
    nextPrayerTime: Date | null
): 'onTime' | 'late' | 'missed' => {
    const now = new Date();

    // If before prayer time, it's on time
    if (now < prayerTime) {
        return 'onTime';
    }

    // If next prayer time exists and we're past it, this prayer is missed
    if (nextPrayerTime && now >= nextPrayerTime) {
        return 'missed';
    }

    // Otherwise it's late but not missed yet
    return 'late';
};
