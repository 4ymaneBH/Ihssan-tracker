// Habits store for Qur'an, Charity, Tahajjud, and Custom habits
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    QuranLog,
    CharityLog,
    TahajjudLog,
    CustomHabit,
    CustomHabitLog,
    CharityType,
    AdhkarLog,
} from '../types';
import { getDateString, getWeekDates } from '../utils/dateUtils';

interface HabitsState {
    // Adhkar logs
    adhkarLogs: Record<string, AdhkarLog>;

    // Qur'an logs
    quranLogs: Record<string, QuranLog>;

    // Charity logs
    charityLogs: CharityLog[];

    // Tahajjud logs
    tahajjudLogs: Record<string, TahajjudLog>;

    // Custom habits
    customHabits: CustomHabit[];
    customHabitLogs: CustomHabitLog[];

    // Adhkar actions
    logAdhkar: (date: string, category: 'morning' | 'evening', itemsCompleted: number, totalItems: number) => void;
    getAdhkarLog: (date: string, category: 'morning' | 'evening') => AdhkarLog | null;

    // Qur'an actions
    logQuranReading: (pages: number, minutes?: number, notes?: string) => void;
    getTodayQuranLog: () => QuranLog | null;
    getWeeklyQuranPages: () => number;

    // Charity actions
    logCharity: (type: CharityType, amount?: number, notes?: string) => void;
    getWeeklyCharityCount: () => number;

    // Tahajjud actions
    logTahajjud: (completed: boolean) => void;
    getTodayTahajjud: () => TahajjudLog | null;
    getWeeklyTahajjudNights: () => number;

    // Custom habit actions
    addCustomHabit: (habit: Omit<CustomHabit, 'id' | 'createdAt'>) => void;
    updateCustomHabit: (habitId: string, updates: Partial<CustomHabit>) => void;
    removeCustomHabit: (habitId: string) => void;
    logCustomHabit: (habitId: string, count: number) => void;
    getCustomHabitLog: (date: string, habitId: string) => CustomHabitLog | null;
    getActiveHabits: () => CustomHabit[];
}

export const useHabitsStore = create<HabitsState>()(
    persist(
        (set, get) => ({
            adhkarLogs: {},
            quranLogs: {},
            charityLogs: [],
            tahajjudLogs: {},
            customHabits: [],
            customHabitLogs: [],

            // Adhkar
            logAdhkar: (date, category, itemsCompleted, totalItems) => {
                const id = `adhkar-${date}-${category}`;
                set((state) => ({
                    adhkarLogs: {
                        ...state.adhkarLogs,
                        [id]: {
                            id,
                            date,
                            category,
                            itemsCompleted,
                            totalItems,
                            createdAt: Date.now(),
                        },
                    },
                }));
            },

            getAdhkarLog: (date, category) => {
                const id = `adhkar-${date}-${category}`;
                return get().adhkarLogs[id] || null;
            },

            // Qur'an
            logQuranReading: (pages, minutes, notes) => {
                const date = getDateString(new Date());
                const id = `quran-${date}`;

                set((state) => {
                    const existing = state.quranLogs[date];
                    return {
                        quranLogs: {
                            ...state.quranLogs,
                            [date]: {
                                id,
                                date,
                                pages: (existing?.pages || 0) + pages,
                                minutes: minutes ? (existing?.minutes || 0) + minutes : existing?.minutes,
                                notes: notes || existing?.notes,
                                createdAt: existing?.createdAt || Date.now(),
                                updatedAt: Date.now(),
                            },
                        },
                    };
                });
            },

            getTodayQuranLog: () => {
                const today = getDateString(new Date());
                return get().quranLogs[today] || null;
            },

            getWeeklyQuranPages: () => {
                const weekDates = getWeekDates();
                const { quranLogs } = get();
                return weekDates.reduce((total, date) => {
                    return total + (quranLogs[date]?.pages || 0);
                }, 0);
            },

            // Charity
            logCharity: (type, amount, notes) => {
                const date = getDateString(new Date());
                const id = `charity-${Date.now()}`;

                set((state) => ({
                    charityLogs: [
                        ...state.charityLogs,
                        {
                            id,
                            date,
                            type,
                            amount,
                            notes,
                            createdAt: Date.now(),
                        },
                    ],
                }));
            },

            getWeeklyCharityCount: () => {
                const weekDates = getWeekDates();
                const { charityLogs } = get();
                return charityLogs.filter((log) => weekDates.includes(log.date)).length;
            },

            // Tahajjud
            logTahajjud: (completed) => {
                const date = getDateString(new Date());
                const id = `tahajjud-${date}`;

                set((state) => ({
                    tahajjudLogs: {
                        ...state.tahajjudLogs,
                        [date]: {
                            id,
                            date,
                            completed,
                            createdAt: Date.now(),
                        },
                    },
                }));
            },

            getTodayTahajjud: () => {
                const today = getDateString(new Date());
                return get().tahajjudLogs[today] || null;
            },

            getWeeklyTahajjudNights: () => {
                const weekDates = getWeekDates();
                const { tahajjudLogs } = get();
                return weekDates.filter((date) => tahajjudLogs[date]?.completed).length;
            },

            // Custom habits
            addCustomHabit: (habit) => {
                const id = `habit-${Date.now()}`;
                set((state) => ({
                    customHabits: [
                        ...state.customHabits,
                        {
                            ...habit,
                            id,
                            createdAt: Date.now(),
                        },
                    ],
                }));
            },

            updateCustomHabit: (habitId, updates) => {
                set((state) => ({
                    customHabits: state.customHabits.map((h) =>
                        h.id === habitId ? { ...h, ...updates } : h
                    ),
                }));
            },

            removeCustomHabit: (habitId) => {
                set((state) => ({
                    customHabits: state.customHabits.map((h) =>
                        h.id === habitId ? { ...h, isActive: false } : h
                    ),
                }));
            },

            logCustomHabit: (habitId, count) => {
                const date = getDateString(new Date());
                const id = `${habitId}-${date}`;
                const habit = get().customHabits.find((h) => h.id === habitId);
                const completed = habit ? count >= habit.targetCount : count > 0;

                set((state) => ({
                    customHabitLogs: [
                        ...state.customHabitLogs.filter((l) => l.id !== id),
                        {
                            id,
                            habitId,
                            date,
                            completed,
                            count,
                            createdAt: Date.now(),
                        },
                    ],
                }));
            },

            getCustomHabitLog: (date, habitId) => {
                const id = `${habitId}-${date}`;
                return get().customHabitLogs.find((l) => l.id === id) || null;
            },

            getActiveHabits: () => {
                return get().customHabits.filter((h) => h.isActive);
            },
        }),
        {
            name: 'habits-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
