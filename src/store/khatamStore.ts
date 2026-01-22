import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KhatamSession } from '../types';
import { getDateString } from '../utils/dateUtils';

interface KhatamState {
    currentSession: KhatamSession | null;
    history: KhatamSession[];

    // Actions
    startKhatam: (days: number, startPage?: number) => void;
    updateProgress: (page: number) => void;
    logDailyReading: (pagesCount: number) => void;
    completeKhatam: () => void;
    deleteKhatam: () => void;

    // Computed
    getDailyPageGoal: () => number;
}

export const useKhatamStore = create<KhatamState>()(
    persist(
        (set, get) => ({
            currentSession: null,
            history: [],

            startKhatam: (days, startPage = 1) => {
                const now = new Date();
                const targetDate = new Date();
                targetDate.setDate(now.getDate() + days);

                const newSession: KhatamSession = {
                    id: `khatam-${Date.now()}`,
                    startDate: getDateString(now),
                    targetDate: getDateString(targetDate),
                    startPage,
                    endPage: 604,
                    currentPage: startPage - 1,
                    dailyLogs: {},
                    status: 'active',
                    createdAt: Date.now(),
                };

                set({ currentSession: newSession });
            },

            updateProgress: (page) => {
                set((state) => {
                    if (!state.currentSession) return state;

                    // Simple progress update (absolute page number)
                    const updatedSession = {
                        ...state.currentSession,
                        currentPage: page,
                    };

                    // Check completion
                    if (updatedSession.currentPage >= updatedSession.endPage) {
                        updatedSession.status = 'completed';
                    }

                    return { currentSession: updatedSession };
                });
            },

            logDailyReading: (pagesCount) => {
                set((state) => {
                    if (!state.currentSession) return state;

                    const today = getDateString(new Date());
                    const currentLog = state.currentSession.dailyLogs[today] || 0;

                    const updatedSession = {
                        ...state.currentSession,
                        currentPage: Math.min(604, state.currentSession.currentPage + pagesCount),
                        dailyLogs: {
                            ...state.currentSession.dailyLogs,
                            [today]: currentLog + pagesCount,
                        }
                    };

                    if (updatedSession.currentPage >= updatedSession.endPage) {
                        updatedSession.status = 'completed';
                    }

                    return { currentSession: updatedSession };
                });
            },

            completeKhatam: () => {
                set((state) => {
                    if (!state.currentSession) return state;
                    const completedSession = { ...state.currentSession, status: 'completed' as const };
                    return {
                        currentSession: null,
                        history: [completedSession, ...state.history],
                    };
                });
            },

            deleteKhatam: () => {
                set({ currentSession: null });
            },

            getDailyPageGoal: () => {
                const { currentSession } = get();
                if (!currentSession || currentSession.status !== 'active') return 0;

                const pagesRemaining = currentSession.endPage - currentSession.currentPage;
                const today = new Date();
                const target = new Date(currentSession.targetDate);

                // Calculate days remaining (inclusive of today)
                const diffTime = target.getTime() - today.getTime();
                const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

                return Math.ceil(pagesRemaining / daysRemaining);
            },
        }),
        {
            name: 'khatam-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
