// Theme barrel export
export * from './colors';
export * from './typography';
export * from './spacing';

import { lightTheme, darkTheme, Theme } from './colors';
import { typography, fontFamilies, fontSizes, lineHeights } from './typography';
import { spacing, borderRadius, shadows, layout } from './spacing';

export const theme = {
    light: {
        colors: lightTheme,
        typography,
        fontFamilies,
        fontSizes,
        lineHeights,
        spacing,
        borderRadius,
        shadows,
        layout,
    },
    dark: {
        colors: darkTheme,
        typography,
        fontFamilies,
        fontSizes,
        lineHeights,
        spacing,
        borderRadius,
        shadows,
        layout,
    },
};

export type AppTheme = typeof theme.light;
