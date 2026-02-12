import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface GradientBackgroundProps extends ViewProps {
    children?: React.ReactNode;
}

/**
 * Premium gradient background for glassmorphism design
 * Light mode: soft lavender to warm pearl
 * Dark mode: deep indigo to near black
 */
export function GradientBackground({ children, style, ...props }: GradientBackgroundProps) {
    const { theme, isDark } = useTheme();

    const colors = isDark
        ? [theme.colors.gradientStart, theme.colors.gradientEnd]
        : [theme.colors.gradientStart, theme.colors.gradientEnd];

    return (
        <LinearGradient
            colors={colors}
            style={[styles.gradient, style]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            {...props}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});
