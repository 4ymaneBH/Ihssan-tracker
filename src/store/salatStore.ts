// Salat tracking store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SalatLog, SalatStatus, SalatName } from '../types';
import { getDateString, getWeekDates } from '../utils/dateUtils';

interface SalatState {
    logs: Record<string, SalatLog>; // keyed by date string

    // Actions
    logPrayer: (date: string, prayer: SalatName, status: SalatStatus) => void;
    getTodayLog: () => SalatLog | null;
    getWeekLogs: () => SalatLog[];
    getPrayerStreak: () => number;
    getOnTimePercentage: (days?: number) => number;

    // Reset actions
    resetSalatToday: () => void;
    resetSalatHistory: () => void;
}

const createEmptyLog = (date: string): SalatLog => ({
    id: `salat-${date}`,
    date,
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
});

export const useSalatStore = create<SalatState>()(
    persist(
        (set, get) => ({
            logs: {},

            logPrayer: (date, prayer, status) => {
                set((state) => {
                    const existingLog = state.logs[date] || createEmptyLog(date);
                    return {
                        logs: {
                            ...state.logs,
                            [date]: {
                                ...existingLog,
                                [prayer]: status,
                                updatedAt: Date.now(),
                            },
                        },
                    };
                });
            },

            getTodayLog: () => {
                const today = getDateString(new Date());
                return get().logs[today] || null;
            },

            getWeekLogs: () => {
                const weekDates = getWeekDates();
                const { logs } = get();
                return weekDates.map((date) => logs[date] || createEmptyLog(date));
            },

            getPrayerStreak: () => {
                const { logs } = get();
                const dates = Object.keys(logs).sort().reverse();
                let streak = 0;

                for (const date of dates) {
                    const log = logs[date];
                    const allCompleted =
                        log.fajr && log.dhuhr && log.asr && log.maghrib && log.isha;

                    if (allCompleted) {
                        streak++;
                    } else {
                        break;
                    }
                }

                return streak;
            },

            getOnTimePercentage: (days = 7) => {
                const { logs } = get();
                const sortedDates = Object.keys(logs).sort().reverse().slice(0, days);

                if (sortedDates.length === 0) return 0;

                let onTime = 0;
                let total = 0;

                for (const date of sortedDates) {
                    const log = logs[date];
                    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

                    for (const prayer of prayers) {
                        if (log[prayer]) {
                            total++;
                            if (log[prayer] === 'onTime') {
                                onTime++;
                            }
                        }
                    }
                }

                return total > 0 ? Math.round((onTime / total) * 100) : 0;
            },

            // Reset actions
            resetSalatToday: () => {
                const today = getDateString(new Date());
                set((state) => {
                    const { [today]: _, ...rest } = state.logs;
                    return { logs: rest };
                });
            },

            resetSalatHistory: () => {
                set({ logs: {} });
            },
        }),
        {
            name: 'salat-logs',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
