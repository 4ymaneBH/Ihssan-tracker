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

    // Card accent colors (for icon backgrounds)
    accents: {
        salat: '#A4D96C',      // Green
        adhkar: '#A4D96C',     // Green
        quran: '#A4D96C',      // Green
        charity: '#A4D96C',    // Green
        tahajjud: '#A4D96C',   // Green
        custom: '#A4D96C',     // Green
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
    tabBarBackground: colors.neutral[900],    // Dark tab bar (#212529)
    tabBarBorder: colors.neutral[800],
    tabBarActive: colors.primary[400],        // Green active state
    tabBarInactive: colors.neutral[600],      // Gray inactive
    // Palettes for advanced usage
    palette: colors,
    // Semantic colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    // Accent colors for icons
    accents: colors.accents,
    // Card backgrounds - all white in light mode
    cards: {
        salat: colors.neutral[0],
        adhkar: colors.neutral[0],
        quran: colors.neutral[0],
        charity: colors.neutral[0],
        tahajjud: colors.neutral[0],
        custom: colors.neutral[0],
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
    tabBarBackground: colors.neutral[900],
    tabBarBorder: colors.neutral[800],
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
    // Dark mode card colors - subtle color tints
    cards: {
        salat: '#0F2927',
        adhkar: '#1C1708',
        quran: '#1A1606',
        charity: '#1F0A14',
        tahajjud: '#1A1033',
        custom: '#0E1A2E',
    },
    // Progress bar colors
    progressBarBackground: colors.neutral[700],
    progressBarFill: colors.primary[400],
};

export type Theme = typeof lightTheme;
