// Typography system for Ihssan Tracker
// Uses Inter for English, Noto Sans Arabic for Arabic UI

export const fontFamilies = {
    // English fonts
    inter: {
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semiBold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
    },
    // Arabic fonts
    notoSansArabic: {
        regular: 'NotoSansArabic_400Regular',
        medium: 'NotoSansArabic_500Medium',
        semiBold: 'NotoSansArabic_600SemiBold',
        bold: 'NotoSansArabic_700Bold',
    },
};

// Font sizes following a modular scale
export const fontSizes = {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    '2xl': 30,
    '3xl': 36,
    '4xl': 48,
};

// Line heights
export const lineHeights = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
};

// Letter spacing
export const letterSpacing = {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
};

// Typography presets
export const typography = {
    // Headings
    h1: {
        fontSize: fontSizes['3xl'],
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
    },
    h2: {
        fontSize: fontSizes['2xl'],
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.tight,
    },
    h3: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.normal,
    },
    h4: {
        fontSize: fontSizes.lg,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },

    // Body text
    bodyLarge: {
        fontSize: fontSizes.md,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    body: {
        fontSize: fontSizes.base,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },
    bodySmall: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },

    // Labels & captions
    label: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.tight,
        letterSpacing: letterSpacing.wide,
    },
    caption: {
        fontSize: fontSizes.xs,
        lineHeight: lineHeights.normal,
        letterSpacing: letterSpacing.normal,
    },

    // Arabic-specific
    arabicBody: {
        fontSize: fontSizes.md,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
    arabicLarge: {
        fontSize: fontSizes.xl,
        lineHeight: lineHeights.relaxed,
        letterSpacing: letterSpacing.normal,
    },
};

export type Typography = typeof typography;
