// User preferences store with Zustand + AsyncStorage persistence
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPreferences, SalatName, PrayerNotificationSettings } from '../types';
import { changeLanguage } from '../i18n';

interface UserPreferencesState extends UserPreferences {
    // Profile data
    displayName?: string;
    avatarId?: string;
    // Actions
    setLanguage: (language: 'en' | 'ar') => Promise<void>;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    setProfile: (name: string, avatar: string) => void;
    completeOnboarding: () => void;
    setNotificationsEnabled: (enabled: boolean) => void;
    setQuietHours: (start: string, end: string) => void;
    setHideCharityAmounts: (hide: boolean) => void;
    setGoals: (goals: Partial<UserPreferences['goals']>) => void;

    // Prayer Notifications
    prayerNotifications: Record<SalatName, PrayerNotificationSettings>;
    setPrayerNotificationSettings: (prayer: SalatName, settings: PrayerNotificationSettings) => void;

    reset: () => void;
}

const defaultPreferences: UserPreferences = {
    language: 'en',
    theme: 'light',
    onboardingComplete: false,
    notificationsEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '06:00',
    hideCharityAmounts: false,
    goals: {
        quranPagesPerDay: 2,
        charityPerWeek: 3,
        tahajjudNightsPerWeek: 2,
    },
    prayerNotifications: {
        fajr: { sound: 'azan', preNotification: 20 },
        dhuhr: { sound: 'azan' },
        asr: { sound: 'azan' },
        maghrib: { sound: 'azan', preNotification: 10 },
        isha: { sound: 'azan' },
    },
};

export const useUserPreferencesStore = create<UserPreferencesState>()(
    persist(
        (set, get) => ({
            ...defaultPreferences,

            setLanguage: async (language) => {
                await changeLanguage(language);
                set({ language });
            },

            setTheme: (theme) => {
                set({ theme });
            },

            setProfile: (displayName, avatarId) => {
                set({ displayName, avatarId });
            },

            completeOnboarding: () => {
                set({ onboardingComplete: true });
            },

            setNotificationsEnabled: (enabled) => {
                set({ notificationsEnabled: enabled });
            },

            setQuietHours: (start, end) => {
                set({ quietHoursStart: start, quietHoursEnd: end });
            },

            setHideCharityAmounts: (hide) => {
                set({ hideCharityAmounts: hide });
            },

            setGoals: (goals) => {
                set((state) => ({
                    goals: { ...state.goals, ...goals },
                }));
            },

            setPrayerNotificationSettings: (prayer, settings) => {
                set((state) => ({
                    prayerNotifications: {
                        ...state.prayerNotifications,
                        [prayer]: settings,
                    },
                }));
            },

            reset: () => {
                set(defaultPreferences);
            },
        }),
        {
            name: 'user-preferences',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
