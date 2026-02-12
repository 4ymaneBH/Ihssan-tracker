// Theme barrel export
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './glass';

import { lightTheme, darkTheme, Theme } from './colors';
import { typography, fontFamilies, fontSizes, lineHeights } from './typography';
import { spacing, borderRadius, shadows, layout, componentSizes, borderWidth } from './spacing';
import { blurIntensity, glassOpacity, glassShadows, glassPresets, backdropBlur } from './glass';

export const theme = {
    light: {
        colors: lightTheme,
        typography,
        fontFamilies,
        fontSizes,
        lineHeights,
        spacing,
        borderRadius,
        borderWidth,
        shadows,
        layout,
        componentSizes,
        glass: {
            blurIntensity,
            opacity: glassOpacity.light,
            shadows: glassShadows,
            presets: glassPresets,
            backdropBlur,
        },
    },
    dark: {
        colors: darkTheme,
        typography,
        fontFamilies,
        fontSizes,
        lineHeights,
        spacing,
        borderRadius,
        borderWidth,
        shadows,
        layout,
        componentSizes,
        glass: {
            blurIntensity,
            opacity: glassOpacity.dark,
            shadows: glassShadows,
            presets: glassPresets,
            backdropBlur,
        },
    },
};

export type AppTheme = typeof theme.light;
