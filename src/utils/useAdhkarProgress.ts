// Hook to persist adhkar progress across sessions within the same day
import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdhkarCategory } from '../data/adhkarContent';
import { getDateString } from './dateUtils';
import { logger } from './logger';

const STORAGE_KEY_PREFIX = 'adhkar-progress';
// Auto-save debounce in ms
const DEBOUNCE_MS = 600;

type CountMap = Record<string, number>;

interface UseAdhkarProgressResult {
    counts: CountMap;
    setCount: (dhikrId: string, count: number) => void;
    clearProgress: () => void;
    isLoaded: boolean;
}

export const useAdhkarProgress = (category: AdhkarCategory): UseAdhkarProgressResult => {
    const today = getDateString(new Date());
    const storageKey = `${STORAGE_KEY_PREFIX}-${today}-${category}`;

    const [counts, setCounts] = useState<CountMap>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingCounts = useRef<CountMap>({});

    // Load on mount or category change
    useEffect(() => {
        setIsLoaded(false);
        setCounts({});

        AsyncStorage.getItem(storageKey)
            .then((raw) => {
                if (raw) {
                    const parsed: CountMap = JSON.parse(raw);
                    setCounts(parsed);
                    pendingCounts.current = parsed;
                }
            })
            .catch((err) => logger.error('Failed to load adhkar progress:', err))
            .finally(() => setIsLoaded(true));

        return () => {
            // Flush any pending save on unmount
            if (saveTimer.current) {
                clearTimeout(saveTimer.current);
            }
        };
    }, [storageKey]);

    const persistCounts = useCallback((updated: CountMap) => {
        if (saveTimer.current) {
            clearTimeout(saveTimer.current);
        }
        saveTimer.current = setTimeout(async () => {
            try {
                await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
            } catch (err) {
                logger.error('Failed to save adhkar progress:', err);
            }
        }, DEBOUNCE_MS);
    }, [storageKey]);

    const setCount = useCallback((dhikrId: string, count: number) => {
        setCounts((prev) => {
            const updated = { ...prev, [dhikrId]: count };
            pendingCounts.current = updated;
            persistCounts(updated);
            return updated;
        });
    }, [persistCounts]);

    const clearProgress = useCallback(async () => {
        try {
            setCounts({});
            pendingCounts.current = {};
            await AsyncStorage.removeItem(storageKey);
        } catch (err) {
            logger.error('Failed to clear adhkar progress:', err);
        }
    }, [storageKey]);

    return { counts, setCount, clearProgress, isLoaded };
};
