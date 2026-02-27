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
    background:          '#070E0A',               // Deep green-black
    backgroundSecondary: '#0C1410',
    surface:             '#111C15',               // Rich dark green surface
    surfaceElevated:     '#162218',
    text:                '#F0F5F1',
    textSecondary:       '#8FA898',               // Muted sage
    textTertiary:        '#5A7363',
    border:              '#1A2B1F',
    borderLight:         '#1E3125',
    divider:             '#1A2B1F',
    cardBorder:          '#1E3125',

    primary:      '#0EA571',                      // Deep teal-emerald
    primaryLight: '#0D2A16',
    onPrimary:    '#F0F5F1',                      // Light text on teal

    tabBarBackground: 'rgba(7,14,10,0.96)',
    tabBarBorder:     'rgba(14,165,113,0.1)',
    tabBarActive:     '#0EA571',
    tabBarInactive:   '#5A7363',

    palette: colors,
    success: colors.success,
    warning: colors.warning,
    error:   colors.error,
    info:    colors.info,
    accents: {
        ...colors.accents,
        salat:    '#0EA571',
        quran:    '#38BDF8',
    },

    cards: {
        salat:    '#0D1F13',
        adhkar:   '#181408',
        quran:    '#0A1820',
        charity:  '#1A0A12',
        tahajjud: '#120D28',
        custom:   '#1A1108',
    },

    progressBarBackground: '#1A2B1F',
    progressBarFill:       '#0EA571',
};

export type Theme = typeof lightTheme;

