// Date utility functions

/**
 * Get date string in YYYY-MM-DD format
 */
export const getDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Get array of date strings for the current week (Sunday to Saturday)
 */
export const getWeekDates = (referenceDate: Date = new Date()): string[] => {
    const dates: string[] = [];
    const current = new Date(referenceDate);

    // Get to the start of the week (Sunday)
    const dayOfWeek = current.getDay();
    current.setDate(current.getDate() - dayOfWeek);

    // Generate 7 dates
    for (let i = 0; i < 7; i++) {
        dates.push(getDateString(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * Get day name abbreviation
 */
export const getDayAbbr = (date: Date, locale: string = 'en'): string => {
    const days = {
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        ar: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],
    };
    return days[locale as 'en' | 'ar']?.[date.getDay()] || days.en[date.getDay()];
};

/**
 * Check if date is today
 */
export const isToday = (dateString: string): boolean => {
    return dateString === getDateString(new Date());
};

/**
 * Parse date string to Date object
 */
export const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string, locale: string = 'en'): string => {
    const date = parseDate(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
};

/**
 * Get relative day label (Today, Yesterday, or date)
 */
export const getRelativeDay = (dateString: string, locale: string = 'en'): string => {
    const today = getDateString(new Date());
    const yesterday = getDateString(new Date(Date.now() - 86400000));

    if (dateString === today) {
        return locale === 'ar' ? 'اليوم' : 'Today';
    }
    if (dateString === yesterday) {
        return locale === 'ar' ? 'أمس' : 'Yesterday';
    }
    return formatDate(dateString, locale);
};

/**
 * Convert Western numerals to Arabic numerals
 */
export const toArabicNumerals = (num: number | string): string => {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

/**
 * Format number based on locale
 */
export const formatNumber = (num: number, locale: string = 'en'): string => {
    if (locale === 'ar') {
        return toArabicNumerals(num);
    }
    return String(num);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, locale: string = 'en'): string => {
    const formatted = `${Math.round(value)}%`;
    if (locale === 'ar') {
        return `٪${toArabicNumerals(Math.round(value))}`;
    }
    return formatted;
};
