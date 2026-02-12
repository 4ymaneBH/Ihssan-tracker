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
    prayerNotifications: Record<SalatName, PrayerNotificationSettings>;
}

export interface PrayerNotificationSettings {
    sound: 'azan' | 'beep' | 'off';
    preNotification?: number; // minutes
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
    category: 'morning' | 'evening' | 'general' | 'sleep' | 'custom';
}

// Adhkar log
export interface AdhkarLog {
    id: string;
    date: string;
    category: 'morning' | 'evening' | 'general' | 'sleep';
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

// Khatam Tracking
export interface KhatamSession {
    id: string;
    startDate: string;
    targetDate: string;
    startPage: number;
    endPage: number; // Usually 604
    currentPage: number;
    dailyLogs: Record<string, number>; // date -> pages read count
    status: 'active' | 'completed' | 'abandoned';
    createdAt: number;
}

// Navigation types
export type RootStackParamList = {
    Onboarding: undefined;
    SignUp: undefined;
    Login: undefined;
    Main: undefined;
    Adhkar: { category?: 'morning' | 'evening' | 'general' | 'sleep' };
    Dua: undefined;
    Tahajjud: undefined;
    Quran: undefined;
    Profile: undefined;
    Qibla: undefined;
    Khatam: undefined;
    Social: undefined;
    CreateGroup: undefined;
    GroupDetails: { groupId: string };
    JoinGroup: undefined;
    CustomHabits: undefined;
};

// ==========================================
// Social Groups Types
// ==========================================
export type GoalType = 'quran_pages' | 'adhkar_count' | 'custom_habit';

export interface GroupMember {
    id: string; // userId
    nickname: string;
    avatarId?: string;
    progress: number; // e.g., pages read, loops count
    lastUpdated: number;
    joinedAt: number;
    isAdmin?: boolean;
}

export interface SocialGroup {
    id: string;
    name: string;
    description?: string;
    code: string; // 6-char unique invite code
    goalType: GoalType;
    goalTarget: number; // e.g., 20 pages/day
    frequency: 'daily' | 'weekly';
    members: GroupMember[];
    createdAt: number;
    leaderboard: GroupMember[]; // Sorted by progress
}

export type MainTabParamList = {
    Today: undefined;
    Track: undefined;
    Insights: undefined;
    Settings: undefined;
};

export type AuthStackParamList = {
    Login: undefined;
    SignUp: undefined;
};
