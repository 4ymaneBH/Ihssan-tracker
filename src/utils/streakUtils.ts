// Streak calculation utilities

import { SalatLog, SalatName } from '../types';
import { getDateString } from './dateUtils';

/**
 * Calculate consecutive days streak for any habit
 */
export const calculateStreak = (
    completedDates: string[],
    referenceDate: Date = new Date()
): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = [...completedDates].sort().reverse();
    const today = getDateString(referenceDate);
    const yesterday = getDateString(new Date(referenceDate.getTime() - 86400000));

    // Check if the most recent completion is today or yesterday
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
        return 0;
    }

    let streak = 0;
    let currentDate = sortedDates[0] === today ? referenceDate : new Date(referenceDate.getTime() - 86400000);

    for (const dateStr of sortedDates) {
        const expectedDate = getDateString(currentDate);

        if (dateStr === expectedDate) {
            streak++;
            currentDate = new Date(currentDate.getTime() - 86400000);
        } else if (dateStr < expectedDate) {
            // Gap in dates, streak is broken
            break;
        }
    }

    return streak;
};

/**
 * Calculate salat streak (all 5 prayers completed)
 */
export const calculateSalatStreak = (
    logs: Record<string, SalatLog>,
    referenceDate: Date = new Date()
): number => {
    const prayers: SalatName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

    const completedDates = Object.entries(logs)
        .filter(([_, log]) => {
            return prayers.every((prayer) => log[prayer] !== null);
        })
        .map(([date]) => date);

    return calculateStreak(completedDates, referenceDate);
};

/**
 * Get longest streak from history
 */
export const getLongestStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = [...completedDates].sort();
    let currentStreak = 1;
    let longestStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.floor(
            (currDate.getTime() - prevDate.getTime()) / 86400000
        );

        if (diffDays === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else if (diffDays > 1) {
            currentStreak = 1;
        }
    }

    return longestStreak;
};

/**
 * Calculate consistency score (0-100) based on completion rate over last N days
 */
export const calculateConsistencyScore = (
    completedDates: string[],
    totalDays: number = 30
): number => {
    const today = new Date();
    let completedCount = 0;

    for (let i = 0; i < totalDays; i++) {
        const date = new Date(today.getTime() - i * 86400000);
        const dateStr = getDateString(date);
        if (completedDates.includes(dateStr)) {
            completedCount++;
        }
    }

    return Math.round((completedCount / totalDays) * 100);
};
