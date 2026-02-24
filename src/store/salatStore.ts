// Salat tracking store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SalatLog, SalatStatus, SalatName } from '../types';
import { getDateString, getWeekDates } from '../utils/dateUtils';

interface UndoEntry {
    date: string;
    prayer: SalatName;
    previousStatus: SalatStatus | null;
}

interface SalatState {
    logs: Record<string, SalatLog>; // keyed by date string
    undoStack: UndoEntry[];          // last N prayer changes

    // Actions
    logPrayer: (date: string, prayer: SalatName, status: SalatStatus) => void;
    undoPrayer: () => void;
    canUndo: () => boolean;
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
            undoStack: [],

            logPrayer: (date, prayer, status) => {
                set((state) => {
                    const existingLog = state.logs[date] || createEmptyLog(date);
                    // Save previous status to undo stack (keep last 10 entries)
                    const undoEntry: UndoEntry = {
                        date,
                        prayer,
                        previousStatus: (existingLog[prayer] as SalatStatus | null) ?? null,
                    };
                    const newUndoStack = [undoEntry, ...state.undoStack].slice(0, 10);
                    return {
                        undoStack: newUndoStack,
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

            undoPrayer: () => {
                set((state) => {
                    if (state.undoStack.length === 0) return state;
                    const [last, ...rest] = state.undoStack;
                    const existingLog = state.logs[last.date] || createEmptyLog(last.date);
                    return {
                        undoStack: rest,
                        logs: {
                            ...state.logs,
                            [last.date]: {
                                ...existingLog,
                                [last.prayer]: last.previousStatus,
                                updatedAt: Date.now(),
                            },
                        },
                    };
                });
            },

            canUndo: () => get().undoStack.length > 0,

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
                    // Only count days where ALL 5 prayers are on time (green)
                    const allOnTime =
                        log.fajr === 'onTime' &&
                        log.dhuhr === 'onTime' &&
                        log.asr === 'onTime' &&
                        log.maghrib === 'onTime' &&
                        log.isha === 'onTime';

                    if (allOnTime) {
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
