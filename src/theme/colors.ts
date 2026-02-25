// Color palette for Ihssan Tracker
// Premium emerald-green identity — warm neutrals, rich accents, high contrast surfaces

export const colors = {
    // Primary — deep saturated emerald (replaces cheap neon lime)
    primary: {
        50:  '#F0FDF4',
        100: '#DCFCE7',
        200: '#BBF7D0',
        300: '#86EFAC',
        400: '#4ADE80',
        500: '#22C55E',
        600: '#16A34A',   // ← Main light-mode primary: rich, confident emerald
        700: '#15803D',
        800: '#166534',
        900: '#14532D',
    },

    // Neutral — warm-tinted grays for light mode (not cold blue-gray)
    neutral: {
        0:   '#FFFFFF',
        50:  '#F9FAF7',   // Warm off-white background
        100: '#F2F4F0',   // Slightly warmer secondary bg
        200: '#E5E8E2',   // Warm border / divider
        300: '#CFD3CC',
        400: '#9EA49A',   // Balanced mid-gray
        500: '#737870',
        600: '#565C54',
        700: '#3D4239',
        800: '#272B24',
        900: '#161A14',   // Warm near-black text
        950: '#0C0E0A',
    },

    // Semantic — all distinct, none overlapping with primary
    success: {
        light: '#D1FAE5',
        main:  '#10B981',   // Emerald-500 — clearly "done/good"
        dark:  '#059669',
    },
    warning: {
        light: '#FEF3C7',
        main:  '#F59E0B',
        dark:  '#D97706',
    },
    error: {
        light: '#FEE2E2',
        main:  '#EF4444',
        dark:  '#DC2626',
    },
    info: {
        light: '#E0F2FE',
        main:  '#0EA5E9',   // Sky blue — distinct from emerald
        dark:  '#0284C7',
    },

    // Accent colors — rich, differentiated, curated palette
    accents: {
        salat:    '#16A34A',   // Emerald — mirrors primary (prayer = core)
        adhkar:   '#D97706',   // Amber-600 — warm & earthy
        quran:    '#0284C7',   // Sky-700 — clear sky, knowledge
        charity:  '#DB2777',   // Pink-600 — warmth, giving
        tahajjud: '#7C3AED',   // Violet-600 — night, depth
        custom:   '#EA580C',   // Orange-600 — energy, personal
    },
};

// ─── Light Theme ────────────────────────────────────────────────────────────
export const lightTheme = {
    background:          colors.neutral[50],     // Warm off-white (#F9FAF7)
    backgroundSecondary: colors.neutral[100],
    surface:             colors.neutral[0],      // Pure white cards
    surfaceElevated:     colors.neutral[0],
    text:                colors.neutral[900],     // Warm near-black (#161A14)
    textSecondary:       colors.neutral[600],     // Medium warm gray (#565C54)
    textTertiary:        colors.neutral[400],
    border:              colors.neutral[200],     // Warm hairline (#E5E8E2)
    borderLight:         colors.neutral[200],
    divider:             colors.neutral[200],
    cardBorder:          '#E4E7E0',              // Slightly greenish-warm card stroke

    primary:      colors.primary[600],            // Rich emerald (#16A34A)
    primaryLight: colors.primary[100],            // Soft green tint (#DCFCE7)
    onPrimary:    colors.neutral[0],              // White on green

    tabBarBackground: 'rgba(255,255,255,0.97)',
    tabBarBorder:     'rgba(0,0,0,0.09)',
    tabBarActive:     colors.primary[600],        // Emerald pill
    tabBarInactive:   colors.neutral[400],        // #9EA49A — clearly readable

    palette: colors,
    success: colors.success,
    warning: colors.warning,
    error:   colors.error,
    info:    colors.info,
    accents: colors.accents,

    // Card backgrounds — each subtly tinted, distinct but harmonious
    cards: {
        salat:    '#F0FDF5',   // Barely-there mint
        adhkar:   '#FFFBF0',   // Warm honey cream
        quran:    '#F0F9FF',   // Pale sky
        charity:  '#FFF0F7',   // Light rose
        tahajjud: '#F5F0FF',   // Pale violet
        custom:   '#FFF5F0',   // Pale peach
    },

    progressBarBackground: colors.neutral[200],
    progressBarFill:       colors.primary[600],
};

// ─── Dark Theme ──────────────────────────────────────────────────────────────
export const darkTheme = {
    background:          colors.neutral[950],
    backgroundSecondary: colors.neutral[900],
    surface:             colors.neutral[900],
    surfaceElevated:     colors.neutral[800],
    text:                '#F2F4F0',
    textSecondary:       colors.neutral[400],
    textTertiary:        colors.neutral[500],
    border:              colors.neutral[800],
    borderLight:         colors.neutral[700],
    divider:             colors.neutral[800],
    cardBorder:          colors.neutral[700],

    primary:      colors.primary[400],            // Bright emerald on dark (#4ADE80)
    primaryLight: colors.primary[900],
    onPrimary:    colors.neutral[900],            // Dark text on bright green

    tabBarBackground: 'rgba(12,14,10,0.94)',
    tabBarBorder:     'rgba(255,255,255,0.08)',
    tabBarActive:     colors.primary[400],
    tabBarInactive:   colors.neutral[500],

    palette: colors,
    success: colors.success,
    warning: colors.warning,
    error:   colors.error,
    info:    colors.info,
    accents: colors.accents,

    cards: {
        salat:    '#0A1F12',
        adhkar:   '#1A1506',
        quran:    '#071B25',
        charity:  '#1F070F',
        tahajjud: '#120A2E',
        custom:   '#1F1007',
    },

    progressBarBackground: colors.neutral[700],
    progressBarFill:       colors.primary[400],
};

export type Theme = typeof lightTheme;

