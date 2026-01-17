// Type definitions for the app

// Prayer status
export type SalatStatus = 'onTime' | 'late' | 'missed' | null;

// Prayer names
export type SalatName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// Habit types
export type HabitType = 'salat' | 'adhkar' | 'quran' | 'charity' | 'tahajjud' | 'custom';

// Schedule types
export type ScheduleType = 'daily' | 'weekly' | 'specificDays';

// Charity types
export type CharityType = 'money' | 'food' | 'time' | 'help';

// User preferences
export interface UserPreferences {
    language: 'en' | 'ar';
    theme: 'light' | 'dark' | 'system';
    onboardingComplete: boolean;

    // Notification settings
    notificationsEnabled: boolean;
    quietHoursStart: string; // HH:mm format
    quietHoursEnd: string;

    // Privacy settings
    hideCharityAmounts: boolean;

    // Goals
    goals: {
        quranPagesPerDay: number;
        charityPerWeek: number;
        tahajjudNightsPerWeek: number;
    };
}

// Salat log for a single day
export interface SalatLog {
    id: string;
    date: string; // YYYY-MM-DD
    fajr: SalatStatus;
    dhuhr: SalatStatus;
    asr: SalatStatus;
    maghrib: SalatStatus;
    isha: SalatStatus;
    createdAt: number;
    updatedAt: number;
}

// Adhkar item
export interface AdhkarItem {
    id: string;
    textArabic: string;
    textTransliteration?: string;
    textTranslation?: string;
    count: number;
    targetCount: number;
    category: 'morning' | 'evening' | 'custom';
}

// Adhkar log
export interface AdhkarLog {
    id: string;
    date: string;
    category: 'morning' | 'evening';
    itemsCompleted: number;
    totalItems: number;
    createdAt: number;
}

// Qur'an reading log
export interface QuranLog {
    id: string;
    date: string;
    pages: number;
    minutes?: number;
    notes?: string;
    createdAt: number;
    updatedAt: number;
}

// Charity log
export interface CharityLog {
    id: string;
    date: string;
    type: CharityType;
    amount?: number;
    notes?: string;
    createdAt: number;
}

// Tahajjud log
export interface TahajjudLog {
    id: string;
    date: string;
    completed: boolean;
    createdAt: number;
}

// Custom habit definition
export interface CustomHabit {
    id: string;
    name: string;
    nameAr?: string;
    icon: string;
    color: string;
    frequency: 'daily' | 'weekly';
    targetCount: number;
    schedule?: ScheduleType;
    specificDays?: number[]; // 0-6, Sunday = 0
    createdAt: number;
    isActive: boolean;
}

// Custom habit log
export interface CustomHabitLog {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
    count: number;
    createdAt: number;
}

// Weekly insights
export interface WeeklyInsights {
    weekStart: string;
    weekEnd: string;
    salatOnTimePercent: number;
    adhkarCompletionPercent: number;
    quranPagesTotal: number;
    charityCount: number;
    tahajjudNights: number;
    streakDays: number;
}

// Navigation types
export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    Adhkar: { category?: 'morning' | 'evening' | 'general' };
    Tahajjud: undefined;
    Quran: undefined;
};

export type MainTabParamList = {
    Today: undefined;
    Track: undefined;
    Insights: undefined;
    Settings: undefined;
};
