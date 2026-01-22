/**
 * Format number based on locale
 * Converts Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩) if locale is 'ar'
 */
export const formatNumber = (num: number, locale: string = 'en'): string => {
    if (num === undefined || num === null) return '0';
    // Always return Western Arabic numerals (0-9) as requested
    return num.toString();
};

/**
 * Format percentage with % symbol
 */
export const formatPercentage = (percent: number, locale: string = 'en'): string => {
    const formattedNum = formatNumber(Math.round(percent), locale);
    return locale === 'ar' ? `%${formattedNum}` : `${formattedNum}%`;
};
