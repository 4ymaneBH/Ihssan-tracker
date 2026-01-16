// Spacing and layout system for Ihssan Tracker

// Base spacing unit (4px)
const BASE = 4;

export const spacing = {
    none: 0,
    xs: BASE,        // 4
    sm: BASE * 2,    // 8
    md: BASE * 3,    // 12
    lg: BASE * 4,    // 16
    xl: BASE * 5,    // 20
    '2xl': BASE * 6, // 24
    '3xl': BASE * 8, // 32
    '4xl': BASE * 10, // 40
    '5xl': BASE * 12, // 48
    '6xl': BASE * 16, // 64
};

// Border radius
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
};

// Shadows for elevation
export const shadows = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Layout constants
export const layout = {
    screenPadding: spacing.lg,
    cardPadding: spacing.lg,
    sectionGap: spacing['2xl'],
    itemGap: spacing.md,
};

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
