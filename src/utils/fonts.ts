// Font utilities for consistent typography across the app
import { I18nManager } from 'react-native';

// Font family names
export const fonts = {
    // Arabic UI font (premium SF Arabic - using Black weight for all since it's the only available file)
    arabic: {
        regular: 'SFArabic-Black',
        medium: 'SFArabic-Black',
        semiBold: 'SFArabic-Black',
        bold: 'SFArabic-Black',
    },
    // Arabic Quranic/Du'a font (traditional, beautiful)
    arabicQuran: {
        regular: 'Amiri',
        bold: 'Amiri-Bold',
    },
    // English/Latin font (system default)
    latin: {
        regular: 'System',
        medium: 'System',
        semiBold: 'System',
        bold: 'System',
    },
};

// Get the appropriate font family based on language
export const getFontFamily = (
    isArabic: boolean,
    weight: 'regular' | 'medium' | 'semiBold' | 'bold' = 'regular'
): string => {
    if (isArabic) {
        return fonts.arabic[weight];
    }
    return fonts.latin[weight];
};

// Get Quranic/Du'a font (always Amiri for Arabic text)
export const getQuranFontFamily = (
    weight: 'regular' | 'bold' = 'regular'
): string => {
    return fonts.arabicQuran[weight];
};

// Generate text style with appropriate font
export const getTextStyle = (
    isArabic: boolean,
    weight: 'regular' | 'medium' | 'semiBold' | 'bold' = 'regular'
) => ({
    fontFamily: getFontFamily(isArabic, weight),
});
