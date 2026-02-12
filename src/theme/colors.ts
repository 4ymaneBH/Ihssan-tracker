// Color palette for Ihssan Tracker
// Modern, clean aesthetic with neon green accent (based on reference image)

export const colors = {
    // Primary - Bright Lime/Neon Green (from reference)
    primary: {
        50: '#F7FEF0',
        100: '#ECFCD5',
        200: '#D9F9AE',
        300: '#BFF37C',
        400: '#A4D96C',  // Main primary (neon green from reference)
        500: '#8BC34A',
        600: '#7CB342',
        700: '#689F38',
        800: '#558B2F',
        900: '#33691E',
    },

    // Neutral - Clean grays (from reference)
    neutral: {
        0: '#FFFFFF',
        50: '#F8F9FA',   // Very light gray background
        100: '#F1F3F5',
        200: '#E9ECEF',
        300: '#DEE2E6',
        400: '#CED4DA',
        500: '#ADB5BD',
        600: '#6C757D',
        700: '#495057',
        800: '#343A40',
        900: '#212529',
        950: '#0D0F12',
    },

    // Semantic colors
    success: {
        light: '#D9F9AE',
        main: '#A4D96C',  // Same as primary
        dark: '#7CB342',
    },
    warning: {
        light: '#FEF3C7',
        main: '#F59E0B',
        dark: '#D97706',
    },
    error: {
        light: '#FEE2E2',
        main: '#EF4444',
        dark: '#DC2626',
    },
    info: {
        light: '#DBEAFE',
        main: '#3B82F6',
        dark: '#2563EB',
    },

    // Card accent colors (for icon backgrounds) — differentiated per module
    accents: {
        salat: '#34D399',      // Emerald green
        adhkar: '#FBBF24',     // Warm amber
        quran: '#2DD4BF',      // Teal
        charity: '#F472B6',    // Rose pink
        tahajjud: '#A78BFA',   // Soft purple
        custom: '#60A5FA',     // Sky blue
    },
};

// Light theme - clean modern aesthetic (from reference)
export const lightTheme = {
    background: colors.neutral[50],           // Very light gray (#F8F9FA)
    backgroundSecondary: colors.neutral[100],
    surface: colors.neutral[0],               // Pure white cards
    surfaceElevated: colors.neutral[0],
    text: colors.neutral[900],                // Dark gray text (#212529)
    textSecondary: colors.neutral[600],       // Medium gray (#6C757D)
    textTertiary: colors.neutral[500],        // Light gray (#ADB5BD)
    border: colors.neutral[200],              // Subtle borders (#E9ECEF)
    borderLight: colors.neutral[200],
    divider: colors.neutral[200],
    cardBorder: colors.neutral[200],
    primary: colors.primary[400],             // Neon green (#A4D96C)
    primaryLight: colors.primary[100],
    onPrimary: colors.neutral[0],             // White text on green
    tabBarBackground: 'rgba(255,255,255,0.85)',  // Frosted glass tab bar
    tabBarBorder: 'rgba(0,0,0,0.06)',
    tabBarActive: colors.primary[500],           // Vibrant green active
    tabBarInactive: colors.neutral[400],         // Softer inactive
    // Palettes for advanced usage
    palette: colors,
    // Semantic colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    // Accent colors for icons
    accents: colors.accents,
    // Card backgrounds - subtle tinted in light mode
    cards: {
        salat: '#F0FDF4',       // Soft mint
        adhkar: '#FFFBEB',      // Warm cream
        quran: '#F0FDFA',       // Light teal
        charity: '#FFF1F2',     // Blush pink
        tahajjud: '#F5F3FF',    // Pale lavender
        custom: '#EFF6FF',      // Ice blue
    },
    // Progress bar colors
    progressBarBackground: colors.neutral[200],
    progressBarFill: colors.primary[400],
};

// Dark theme
export const darkTheme = {
    background: colors.neutral[950],
    backgroundSecondary: colors.neutral[900],
    surface: colors.neutral[900],
    surfaceElevated: colors.neutral[800],
    text: colors.neutral[50],
    textSecondary: colors.neutral[400],
    textTertiary: colors.neutral[500],
    border: colors.neutral[800],
    borderLight: colors.neutral[700],
    divider: colors.neutral[800],
    cardBorder: colors.neutral[700],
    primary: colors.primary[400],             // Neon green
    primaryLight: colors.primary[900],
    onPrimary: colors.neutral[900],
    tabBarBackground: 'rgba(13,15,18,0.88)',   // Frosted dark glass tab bar
    tabBarBorder: 'rgba(255,255,255,0.06)',
    tabBarActive: colors.primary[400],
    tabBarInactive: colors.neutral[500],
    // Palettes for advanced usage
    palette: colors,
    // Semantic colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    // Accent colors for icons
    accents: colors.accents,
    // Dark mode card colors - rich subtle tints
    cards: {
        salat: '#0D2818',       // Deep emerald
        adhkar: '#1A1608',      // Deep amber
        quran: '#0D1F1C',       // Deep teal
        charity: '#1F0D14',     // Deep rose
        tahajjud: '#16103A',    // Deep purple
        custom: '#0D1626',      // Deep navy
    },
    // Progress bar colors
    progressBarBackground: colors.neutral[700],
    progressBarFill: colors.primary[400],
};

export type Theme = typeof lightTheme;
