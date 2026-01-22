/**
 * Get YYYY-MM-DD string from date
 */
export const getDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

/**
 * Format a date into Hijri calendar string
 * @param date Date object
 * @param locale 'en' or 'ar'
 * @returns Formatted Hijri date string
 */
export const getHijriDate = (date: Date, locale: 'en' | 'ar' = 'en'): string => {
    try {
        return new Intl.DateTimeFormat(locale + '-u-ca-islamic-umalqura', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    } catch (e) {
        // Fallback if islamic-umalqura is not supported
        return new Intl.DateTimeFormat(locale + '-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    }
};

/**
 * Get array of dates for the current week (Sunday to Saturday)
 */
export const getWeekDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) to 6 (Sat)

    // Start from Sunday
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - day);

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        dates.push(getDateString(date));
    }

    return dates;
};
