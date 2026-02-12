// Spacing and layout system for Ihssan Tracker
// Premium, consistent design tokens

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

// Standardized component sizes
export const componentSizes = {
    iconContainer: 40,      // Card header icon backgrounds
    iconSmall: 18,          // Small icons (pills, buttons)
    iconMedium: 22,         // Card header icons
    iconLarge: 28,          // Large feature icons
    pillWidth: 80,          // Prayer pill width
    pillHeight: 48,         // Prayer pill height
    actionButtonHeight: 56, // Quick action button height
    profileButton: 44,      // Profile button size
};

// Border radius - glassmorphism system
export const borderRadius = {
    none: 0,
    sm: 8,           // Small elements
    chip: 14,        // Small chips, pills
    md: 16,          // Medium chips
    card: 20,        // Standard cards
    lg: 24,          // Large cards
    modal: 28,       // Modals, hero containers
    xl: 32,          // Extra large containers
    full: 9999,      // Circular
};

// Border widths
export const borderWidth = {
    none: 0,
    thin: 1,
    medium: 1.5,
    thick: 2,
};

// Shadows for elevation - clean and subtle (from reference)
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
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
};

// Layout constants
export const layout = {
    screenPaddingHorizontal: spacing.lg,  // 16
    screenPaddingTop: spacing.lg,         // 16
    cardPadding: spacing.xl,              // 20
    cardGap: spacing.lg,                  // 16
    cardRadius: borderRadius['3xl'],      // 18
    sectionGap: spacing['2xl'],           // 24
    itemGap: spacing.md,                  // 12
};

export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
