import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { glassShadows } from '../theme/glass';

interface PrimaryGradientButtonProps extends TouchableOpacityProps {
    title?: string;
    onPress?: () => void;
    loading?: boolean;
    children?: React.ReactNode;
}

/**
 * Primary action button with gradient and glow
 * - Gradient fill
 * - Soft glow effect
 * - Premium feel
 */
export function PrimaryGradientButton({
    title,
    onPress,
    loading,
    children,
    style,
    ...props
}: PrimaryGradientButtonProps) {
    const { theme, isDark } = useTheme();

    const gradientColors: [string, string] = isDark
        ? [theme.colors.primary, '#6D28D9']
        : [theme.colors.primary, '#A78BFA'];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={loading}
            activeOpacity={0.8}
            style={[styles.button, glassShadows.glow, style]}
            {...props}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {children ? (
                    children
                ) : (
                    <Text
                        style={[
                            styles.title,
                            {
                                fontFamily: theme.fontFamilies.inter.semiBold,
                                color: '#FFFFFF',
                            },
                        ]}
                    >
                        {loading ? '...' : title}
                    </Text>
                )}
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    gradient: {
        paddingHorizontal: 32,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
});
