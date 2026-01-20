// Custom hook for prayer times with location
import { useState, useEffect useCallback } from 'react';
import * as Location from 'expo-location';
import { calculatePrayerTimes, PrayerTimesResult, formatPrayerTime, getTimeRemaining } from '../services/prayerTimes';
import { useUserPreferencesStore } from '../store';

interface UsePrayerTimesResult {
    prayerTimes: PrayerTimesResult | null;
    loading: boolean;
    error: string | null;
    hasLocationPermission: boolean;
    requestLocationPermission: () => Promise<void>;
    refreshPrayerTimes: () => Promise<void>;
    formatTime: (date: Date) => string;
    getRemaining: (date: Date) => string;
}

export const usePrayerTimes = (): UsePrayerTimesResult => {
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const { language } = useUserPreferencesStore();
    const isArabic = language === 'ar';

    // Check location permission on mount
    useEffect(() => {
        checkPermission();
    }, []);

    const checkPermission = async () => {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            setHasLocationPermission(status === 'granted');

            if (status === 'granted') {
                await loadPrayerTimes();
            } else {
                setLoading(false);
            }
        } catch (err) {
            setError('Failed to check location permission');
            setLoading(false);
        }
    };

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(status === 'granted');

            if (status === 'granted') {
                await loadPrayerTimes();
            }
        } catch (err) {
            setError('Failed to request location permission');
        }
    };

    const loadPrayerTimes = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get current location
            const location await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const { latitude, longitude } = location.coords;

            // Calculate prayer times
            const times = calculatePrayerTimes(latitude, longitude);
            setPrayerTimes(times);
        } catch (err) {
            setError('Failed to load prayer times');
            console.error('Prayer times error:', err);
        } finally {
            setLoading(false);
        }
    };

    const refreshPrayerTimes = useCallback(async () => {
        if (hasLocationPermission) {
            await loadPrayerTimes();
        }
    }, [hasLocationPermission]);

    // Auto-refresh prayer times at midnight
    useEffect(() => {
        if (!prayerTimes) return;

        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const msUntilMidnight = tomorrow.getTime() - now.getTime();

        const timeout = setTimeout(() => {
            refreshPrayerTimes();
        }, msUntilMidnight);

        return () => clearTimeout(timeout);
    }, [prayerTimes, refreshPrayerTimes]);

    const formatTime = useCallback((date: Date) => {
        return formatPrayerTime(date, false, isArabic ? 'ar' : 'en');
    }, [isArabic]);

    const getRemaining = useCallback((date: Date) => {
        return getTimeRemaining(date);
    }, []);

    return {
        prayerTimes,
        loading,
        error,
        hasLocationPermission,
        requestLocationPermission,
        refreshPrayerTimes,
        formatTime,
        getRemaining,
    };
};
