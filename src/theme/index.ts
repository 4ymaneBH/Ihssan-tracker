// Theme barrel export
export * from './colors';
export * from './typography';
export * from './spacing';

import { lightTheme, darkTheme, Theme } from './colors';
import { typography, fontFamilies, fontSizes, lineHeights } from './typography';
import { spacing, borderRadius, shadows, layout, componentSizes, borderWidth } from './spacing';

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
    },
};

export type AppTheme = typeof theme.light;
