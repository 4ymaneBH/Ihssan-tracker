// Color palette for Ihssan Tracker
// Premium, calm Islamic aesthetic with enhanced light-mode contrast

export const colors = {
    // Primary - Teal (spiritual, calming)
    primary: {
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        300: '#5EEAD4',
        400: '#2DD4BF',
        500: '#14B8A6',
        600: '#0D9488',  // Main primary
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
    },

    // Neutral grays
    neutral: {
        0: '#FFFFFF',
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#030712',
    },

    // Semantic colors
    success: {
        light: '#D1FAE5',
        main: '#10B981',
        dark: '#059669',
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

    // Card accent colors (for icon backgrounds only)
    accents: {
        salat: '#0D9488',      // Teal
        adhkar: '#F59E0B',     // Orange
        quran: '#EAB308',      // Yellow
        charity: '#EC4899',    // Pink
        tahajjud: '#8B5CF6',   // Purple
        custom: '#3B82F6',     // Blue
    },
};

// Light theme - enhanced contrast with card borders
export const lightTheme = {
    background: colors.neutral[100],          // Slightly gray background for contrast
    backgroundSecondary: colors.neutral[200],
    surface: colors.neutral[0],               // Pure white cards
    surfaceElevated: colors.neutral[0],
    text: colors.neutral[900],
    textSecondary: colors.neutral[500],
    textTertiary: colors.neutral[400],
    border: colors.neutral[200],
    borderLight: colors.neutral[200],
    divider: colors.neutral[200],
    cardBorder: colors.neutral[200],          // Visible card outlines
    primary: colors.primary[600],
    primaryLight: colors.primary[100],
    onPrimary: colors.neutral[0],
    tabBarBackground: colors.neutral[0],
    tabBarBorder: colors.neutral[200],
    tabBarActive: colors.primary[600],
    tabBarInactive: colors.neutral[400],
    // Palettes for advanced usage
    palette: colors,
    // Semantic colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    // Accent colors for icons
    accents: colors.accents,
    // Card backgrounds - all white in light mode for clean look
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
    progressBarFill: colors.primary[500],
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
    primary: colors.primary[400],
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
