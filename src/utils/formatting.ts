/**
 * Format number based on locale
 * Converts Western Arabic numerals (0-9) to Eastern Arabic numerals (٠-٩) if locale is 'ar'
 */
export const formatNumber = (num: number, locale: string = 'en'): string => {
    if (num === undefined || num === null) return '0';

    if (locale === 'ar') {
        return num.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    }
    return num.toString();
};
