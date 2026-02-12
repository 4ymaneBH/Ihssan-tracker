import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { GlassView } from './GlassView';
import { useTheme } from '../context/ThemeContext';
import { glassShadows } from '../theme/glass';

interface GlassCardProps extends TouchableOpacityProps {
    children?: React.ReactNode;
    onPress?: () => void;
    borderRadius?: number;
    intensity?: number;
    shadow?: boolean;
}

/**
 * Premium glass card component
 * - Blur background
 * - Soft shadows
 * - Touch feedback with lift animation
 */
export function GlassCard({
    children,
    onPress,
    borderRadius = 20,
    intensity = 40,
    shadow = true,
    style,
    ...props
}: GlassCardProps) {
    const { theme } = useTheme();

    const cardStyle = [
        shadow && glassShadows.card,
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.85}
                style={cardStyle}
                {...props}
            >
                <GlassView
                    intensity={intensity}
                    borderRadius={borderRadius}
                    style={styles.cardContainer}
                >
                    {children}
                </GlassView>
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle}>
            <GlassView
                intensity={intensity}
                borderRadius={borderRadius}
                style={styles.cardContainer}
            >
                {children}
            </GlassView>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        overflow: 'hidden',
    },
});
