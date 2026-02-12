// Color palette for Ihssan Tracker
// Premium glassmorphism design with spiritual aesthetic

export const colors = {
    // Primary - Calm spiritual tones
    primary: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#C4B5FD',
        400: '#A78BFA',  // Soft purple
        500: '#8B5CF6',
        600: '#7C3AED',
        700: '#6D28D9',
        800: '#5B21B6',
        900: '#4C1D95',
    },

    // Neutral - Refined grays
    neutral: {
        0: '#FFFFFF',
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A3A3A3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0A0A0A',
    },

    // Semantic colors - refined
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

    // Spiritual accent colors (soft, sacred)
    accents: {
        salat: '#A78BFA',      // Soft purple
        adhkar: '#818CF8',     // Indigo
        quran: '#34D399',      // Emerald
        charity: '#F472B6',    // Pink
        tahajjud: '#60A5FA',   // Blue
        custom: '#A78BFA',     // Purple
    },
};

// Light theme - Glassmorphism with soft gradients
export const lightTheme = {
    // Gradient backgrounds
    gradientStart: '#FAF5FF',      // Soft lavender white
    gradientEnd: '#FDF2F8',        // Warm pearl pink
    
    // Glass surface colors
    glass: {
        background: 'rgba(255, 255, 255, 0.15)',
        backgroundHover: 'rgba(255, 255, 255, 0.25)',
        border: 'rgba(255, 255, 255, 0.18)',
        shadow: 'rgba(0, 0, 0, 0.08)',
    },
    
    background: '#FAF5FF',
    backgroundSecondary: '#F5F3FF',
    surface: 'rgba(255, 255, 255, 0.7)',
    surfaceElevated: 'rgba(255, 255, 255, 0.85)',
    text: colors.neutral[900],
    textSecondary: colors.neutral[600],
    textTertiary: colors.neutral[500],
    border: 'rgba(255, 255, 255, 0.18)',
    borderLight: 'rgba(255, 255, 255, 0.12)',
    divider: 'rgba(0, 0, 0, 0.06)',
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    primary: colors.primary[400],
    primaryLight: colors.primary[100],
    onPrimary: colors.neutral[0],
    tabBarBackground: 'rgba(255, 255, 255, 0.7)',
    tabBarBorder: 'rgba(255, 255, 255, 0.3)',
    tabBarActive: colors.primary[500],
    tabBarInactive: colors.neutral[500],
    // Palettes
    palette: colors,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    accents: colors.accents,
    // Card backgrounds - glass effect
    cards: {
        salat: 'rgba(255, 255, 255, 0.2)',
        adhkar: 'rgba(255, 255, 255, 0.2)',
        quran: 'rgba(255, 255, 255, 0.2)',
        charity: 'rgba(255, 255, 255, 0.2)',
        tahajjud: 'rgba(255, 255, 255, 0.2)',
        custom: 'rgba(255, 255, 255, 0.2)',
    },
    progressBarBackground: 'rgba(0, 0, 0, 0.08)',
    progressBarFill: colors.primary[400],
};

// Dark theme - Deep plum to black with glass
export const darkTheme = {
    // Gradient backgrounds
    gradientStart: '#1E1B4B',      // Deep indigo
    gradientEnd: '#0A0A0A',        // Near black
    
    // Glass surface colors
    glass: {
        background: 'rgba(255, 255, 255, 0.08)',
        backgroundHover: 'rgba(255, 255, 255, 0.12)',
        border: 'rgba(255, 255, 255, 0.12)',
        shadow: 'rgba(0, 0, 0, 0.4)',
    },
    
    background: '#0A0A0A',
    backgroundSecondary: '#171717',
    surface: 'rgba(255, 255, 255, 0.06)',
    surfaceElevated: 'rgba(255, 255, 255, 0.1)',
    text: colors.neutral[50],
    textSecondary: colors.neutral[400],
    textTertiary: colors.neutral[500],
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.06)',
    divider: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    primary: colors.primary[400],
    primaryLight: colors.primary[900],
    onPrimary: colors.neutral[0],
    tabBarBackground: 'rgba(0, 0, 0, 0.5)',
    tabBarBorder: 'rgba(255, 255, 255, 0.1)',
    tabBarActive: colors.primary[400],
    tabBarInactive: colors.neutral[500],
    // Palettes
    palette: colors,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    accents: colors.accents,
    // Dark mode glass cards
    cards: {
        salat: 'rgba(255, 255, 255, 0.08)',
        adhkar: 'rgba(255, 255, 255, 0.08)',
        quran: 'rgba(255, 255, 255, 0.08)',
        charity: 'rgba(255, 255, 255, 0.08)',
        tahajjud: 'rgba(255, 255, 255, 0.08)',
        custom: 'rgba(255, 255, 255, 0.08)',
    },
    progressBarBackground: 'rgba(255, 255, 255, 0.1)',
    progressBarFill: colors.primary[400],
};

export type Theme = typeof lightTheme;
