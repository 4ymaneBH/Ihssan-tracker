// Analytics Service - Data calculations for charts and insights
import { useSalatStore } from '../store/salatStore';
import { useHabitsStore } from '../store/habitsStore';
import { getDateString } from '../utils/dateUtils';
import { SalatName } from '../types';

// Types for chart data
export interface DailyCompletionData {
    date: string;
    dayNum: number;
    salat: number; // 0-100%
    adhkar: number;
    quran: number;
    charity: number;
    tahajjud: number;
    custom: number;
}

export interface CategoryBreakdown {
    name: string;
    nameAr: string;
    value: number;
    color: string;
}

export interface StreakData {
    date: string;
    dayNum: number;
    streak: number;
}

export interface MonthlyStats {
    totalDays: number;
    activeDays: number;
    overallCompletion: number;
    salatCompletion: number;
    adhkarCompletion: number;
    quranPages: number;
    charityCount: number;
    tahajjudNights: number;
    customHabitsCompletion: number;
    currentStreak: number;
    longestStreak: number;
}

// Get dates for a specific month (internal use)
const getMonthDatesInternal = (year: number, month: number): string[] => {
    const dates: string[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        dates.push(getDateString(date));
    }
    return dates;
};

// Calculate monthly statistics
export const calculateMonthlyStats = (
    year: number,
    month: number,
    salatLogs: Record<string, any>,
    adhkarLogs: Record<string, any>,
    quranLogs: Record<string, any>,
    charityLogs: any[],
    tahajjudLogs: Record<string, any>,
    customHabits: any[],
    customHabitLogs: any[]
): MonthlyStats => {
    const dates = getMonthDatesInternal(year, month);
    const totalDays = dates.length;
    let activeDays = 0;
    let salatDaysComplete = 0;
    let adhkarDaysComplete = 0;
    let quranPages = 0;
    let charityCount = 0;
    let tahajjudNights = 0;
    let customComplete = 0;
    let customTotal = 0;

    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    dates.forEach(date => {
        let hasActivity = false;

        // Salat
        const salatLog = salatLogs[date];
        if (salatLog) {
            const completed = prayers.filter(p => salatLog[p]).length;
            if (completed === 5) salatDaysComplete++;
            if (completed > 0) hasActivity = true;
        }

        // Adhkar
        const morningLog = adhkarLogs[`adhkar-${date}-morning`];
        const eveningLog = adhkarLogs[`adhkar-${date}-evening`];
        if (morningLog?.itemsCompleted === morningLog?.totalItems &&
            eveningLog?.itemsCompleted === eveningLog?.totalItems) {
            adhkarDaysComplete++;
        }
        if (morningLog || eveningLog) hasActivity = true;

        // Quran
        const quranLog = quranLogs[date];
        if (quranLog?.pages) {
            quranPages += quranLog.pages;
            hasActivity = true;
        }

        // Tahajjud
        const tahajjudLog = tahajjudLogs[date];
        if (tahajjudLog?.completed) {
            tahajjudNights++;
            hasActivity = true;
        }

        // Custom habits
        customHabits.forEach(habit => {
            if (habit.isActive) {
                customTotal++;
                const log = customHabitLogs.find(l =>
                    l.habitId === habit.id && l.date === date
                );
                if (log?.completed) {
                    customComplete++;
                    hasActivity = true;
                }
            }
        });

        if (hasActivity) activeDays++;
    });

    // Charity (not per-day)
    charityCount = charityLogs.filter(l => dates.includes(l.date)).length;

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    dates.forEach(date => {
        const salatLog = salatLogs[date];
        const completed = salatLog ? prayers.filter(p => salatLog[p]).length : 0;
        if (completed === 5) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });
    currentStreak = tempStreak;

    return {
        totalDays,
        activeDays,
        overallCompletion: totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
        salatCompletion: totalDays > 0 ? Math.round((salatDaysComplete / totalDays) * 100) : 0,
        adhkarCompletion: totalDays > 0 ? Math.round((adhkarDaysComplete / totalDays) * 100) : 0,
        quranPages,
        charityCount,
        tahajjudNights,
        customHabitsCompletion: customTotal > 0 ? Math.round((customComplete / customTotal) * 100) : 0,
        currentStreak,
        longestStreak,
    };
};

// Get daily completion data for bar chart
export const getDailyCompletionData = (
    year: number,
    month: number,
    salatLogs: Record<string, any>,
    adhkarLogs: Record<string, any>,
    quranLogs: Record<string, any>,
    charityLogs: any[],
    tahajjudLogs: Record<string, any>,
    customHabits: any[],
    customHabitLogs: any[]
): DailyCompletionData[] => {
    const dates = getMonthDatesInternal(year, month);
    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    return dates.map((date, index) => {
        // Salat %
        const salatLog = salatLogs[date];
        const salatComplete = salatLog ? prayers.filter(p => salatLog[p]).length : 0;
        const salatPct = (salatComplete / 5) * 100;

        // Adhkar %
        const morningLog = adhkarLogs[`adhkar-${date}-morning`];
        const eveningLog = adhkarLogs[`adhkar-${date}-evening`];
        const adhkarPct = ((morningLog?.itemsCompleted || 0) + (eveningLog?.itemsCompleted || 0)) /
            ((morningLog?.totalItems || 10) + (eveningLog?.totalItems || 10)) * 100;

        // Quran
        const quranPct = quranLogs[date]?.pages ? 100 : 0;

        // Charity
        const charityPct = charityLogs.find(l => l.date === date) ? 100 : 0;

        // Tahajjud
        const tahajjudPct = tahajjudLogs[date]?.completed ? 100 : 0;

        // Custom
        const activeHabits = customHabits.filter(h => h.isActive);
        let customComplete = 0;
        activeHabits.forEach(habit => {
            const log = customHabitLogs.find(l => l.habitId === habit.id && l.date === date);
            if (log?.completed) customComplete++;
        });
        const customPct = activeHabits.length > 0 ? (customComplete / activeHabits.length) * 100 : 0;

        return {
            date,
            dayNum: index + 1,
            salat: Math.round(salatPct),
            adhkar: Math.round(adhkarPct),
            quran: Math.round(quranPct),
            charity: Math.round(charityPct),
            tahajjud: Math.round(tahajjudPct),
            custom: Math.round(customPct),
        };
    });
};

// Get category breakdown for pie chart
export const getCategoryBreakdown = (
    year: number,
    month: number,
    salatLogs: Record<string, any>,
    adhkarLogs: Record<string, any>,
    quranLogs: Record<string, any>,
    charityLogs: any[],
    tahajjudLogs: Record<string, any>,
    customHabits: any[],
    customHabitLogs: any[]
): CategoryBreakdown[] => {
    const dates = getMonthDatesInternal(year, month);
    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    let salatCount = 0;
    let adhkarCount = 0;
    let quranCount = 0;
    let charityCount = 0;
    let tahajjudCount = 0;
    let customCount = 0;

    dates.forEach(date => {
        // Salat
        const salatLog = salatLogs[date];
        if (salatLog) {
            salatCount += prayers.filter(p => salatLog[p]).length;
        }

        // Adhkar
        const morningLog = adhkarLogs[`adhkar-${date}-morning`];
        const eveningLog = adhkarLogs[`adhkar-${date}-evening`];
        adhkarCount += (morningLog?.itemsCompleted || 0) + (eveningLog?.itemsCompleted || 0);

        // Quran
        quranCount += quranLogs[date]?.pages || 0;

        // Tahajjud
        if (tahajjudLogs[date]?.completed) tahajjudCount++;

        // Custom
        customHabits.forEach(habit => {
            if (habit.isActive) {
                const log = customHabitLogs.find(l =>
                    l.habitId === habit.id && l.date === date && l.completed
                );
                if (log) customCount++;
            }
        });
    });

    // Charity
    charityCount = charityLogs.filter(l => dates.includes(l.date)).length;

    return [
        { name: 'Salat', nameAr: 'الصلاة', value: salatCount, color: '#0D9488' },
        { name: 'Adhkar', nameAr: 'الأذكار', value: adhkarCount, color: '#8B5CF6' },
        { name: 'Quran', nameAr: 'القرآن', value: quranCount, color: '#10B981' },
        { name: 'Charity', nameAr: 'الصدقة', value: charityCount, color: '#EF4444' },
        { name: 'Tahajjud', nameAr: 'التهجد', value: tahajjudCount, color: '#3B82F6' },
        { name: 'Custom', nameAr: 'مخصص', value: customCount, color: '#F59E0B' },
    ].filter(c => c.value > 0);
};

// Get streak trend for line chart
export const getStreakTrend = (
    year: number,
    month: number,
    salatLogs: Record<string, any>
): StreakData[] => {
    const dates = getMonthDatesInternal(year, month);
    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    let runningStreak = 0;

    return dates.map((date, index) => {
        const salatLog = salatLogs[date];
        const completed = salatLog ? prayers.filter(p => salatLog[p]).length : 0;

        if (completed === 5) {
            runningStreak++;
        } else {
            runningStreak = 0;
        }

        return {
            date,
            dayNum: index + 1,
            streak: runningStreak,
        };
    });
};
