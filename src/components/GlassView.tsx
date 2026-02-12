import React from 'react';
import { Platform, StyleSheet, View, ViewProps } from 'react-native';
import { BlurView, BlurViewProps } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

interface GlassViewProps extends ViewProps {
    children?: React.ReactNode;
    intensity?: number;
    tint?: 'light' | 'dark' | 'default';
    borderRadius?: number;
}

/**
 * Glass surface component with blur effect
 * iOS: Uses BlurView with proper glassmorphism
 * Android: Fallback to semi-transparent background
 */
export function GlassView({
    children,
    intensity = 40,
    tint,
    borderRadius = 20,
    style,
    ...props
}: GlassViewProps) {
    const { theme, isDark } = useTheme();

    // Determine tint based on theme if not provided
    const blurTint = tint || (isDark ? 'dark' : 'light');

    if (Platform.OS === 'ios') {
        return (
            <BlurView
                intensity={intensity}
                tint={blurTint}
                style={[
                    styles.glassContainer,
                    {
                        borderRadius,
                        borderColor: theme.colors.border,
                        borderWidth: 1,
                    },
                    style,
                ]}
                {...props}
            >
                {children}
            </BlurView>
        );
    }

    // Android fallback - semi-transparent background
    return (
        <View
            style={[
                styles.glassContainer,
                {
                    backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(255, 255, 255, 0.9)',
                    borderRadius,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    glassContainer: {
        overflow: 'hidden',
    },
});
