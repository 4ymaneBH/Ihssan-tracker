// Color palette for Ihssan Tracker
// Inspired by calm, spiritual Islamic aesthetics with teal primary

export const colors = {
    // Primary - Teal (from reference design)
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

    // Card background colors (pastel palette from reference)
    cards: {
        salat: '#E8F5F3',      // Soft teal
        adhkar: '#FFF7ED',     // Soft orange/peach
        quran: '#FEF3C7',      // Soft yellow
        charity: '#FCE7F3',    // Soft pink
        tahajjud: '#EDE9FE',   // Soft purple
        custom: '#E0F2FE',     // Soft blue
    },
};

// Light theme - improved contrast
export const lightTheme = {
    background: colors.neutral[50],           // Slightly darker background for contrast
    backgroundSecondary: colors.neutral[100],
    surface: colors.neutral[0],
    surfaceElevated: colors.neutral[0],
    text: colors.neutral[900],
    textSecondary: colors.neutral[500],       // Slightly darker for readability
    textTertiary: colors.neutral[400],
    border: colors.neutral[300],              // Stronger border for visibility
    borderLight: colors.neutral[200],
    divider: colors.neutral[200],             // New: section dividers
    cardBorder: colors.neutral[200],          // New: subtle card outlines
    primary: colors.primary[600],
    primaryLight: colors.primary[100],        // Slightly more visible
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
    // Card colors
    cards: colors.cards,
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
    divider: colors.neutral[800],             // Match light theme structure
    cardBorder: colors.neutral[700],          // Subtle card outlines
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
    // Dark mode card colors
    cards: {
        salat: '#134E4A',
        adhkar: '#451A03',
        quran: '#422006',
        charity: '#500724',
        tahajjud: '#2E1065',
        custom: '#0C4A6E',
    },
};

export type Theme = typeof lightTheme;
