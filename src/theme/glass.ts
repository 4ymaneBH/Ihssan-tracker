// Glassmorphism design tokens
// Premium blur, opacity, and shadow system

import { Platform } from 'react-native';

// Blur intensity values
export const blurIntensity = {
    none: 0,
    subtle: 10,
    light: 20,
    medium: 40,
    strong: 60,
    intense: 80,
};

// Glass opacity presets
export const glassOpacity = {
    light: {
        surface: 0.15,
        surfaceHover: 0.25,
        border: 0.18,
        header: 0.7,
        modal: 0.85,
    },
    dark: {
        surface: 0.08,
        surfaceHover: 0.12,
        border: 0.12,
        header: 0.5,
        modal: 0.7,
    },
};

// Shadow presets for glassmorphism
export const glassShadows = {
    none: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    subtle: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    modal: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 8,
    },
    glow: {
        shadowColor: '#A78BFA',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
    },
};

// Backdrop blur values (for modals, overlays)
export const backdropBlur = {
    light: 10,
    medium: 20,
    strong: 40,
};

// Glass card configurations
export const glassPresets = {
    card: {
        borderRadius: 20,
        blur: blurIntensity.medium,
        opacity: Platform.select({
            ios: { light: 0.15, dark: 0.08 },
            android: { light: 0.9, dark: 0.15 }, // Android needs higher opacity
            default: { light: 0.15, dark: 0.08 },
        }),
    },
    header: {
        borderRadius: 0,
        blur: blurIntensity.medium,
        opacity: Platform.select({
            ios: { light: 0.7, dark: 0.5 },
            android: { light: 0.95, dark: 0.85 },
            default: { light: 0.7, dark: 0.5 },
        }),
    },
    modal: {
        borderRadius: 28,
        blur: blurIntensity.strong,
        opacity: Platform.select({
            ios: { light: 0.85, dark: 0.7 },
            android: { light: 0.98, dark: 0.9 },
            default: { light: 0.85, dark: 0.7 },
        }),
    },
    pill: {
        borderRadius: 16,
        blur: blurIntensity.light,
        opacity: Platform.select({
            ios: { light: 0.2, dark: 0.1 },
            android: { light: 0.85, dark: 0.2 },
            default: { light: 0.2, dark: 0.1 },
        }),
    },
    tabBar: {
        borderRadius: 0,
        blur: blurIntensity.medium,
        opacity: Platform.select({
            ios: { light: 0.7, dark: 0.5 },
            android: { light: 0.95, dark: 0.85 },
            default: { light: 0.7, dark: 0.5 },
        }),
    },
};
