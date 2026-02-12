import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { ProgressBar } from './ProgressBar';
import { useTheme } from '../context/ThemeContext';

interface TrackerModuleCardProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    progress: number;
    total: number;
    accentColor?: string;
    onPress?: () => void;
}

/**
 * Premium module card for dashboard
 * - Glass background
 * - Icon with accent color
 * - Progress indicator
 * - Smooth touch feedback
 */
export function TrackerModuleCard({
    title,
    icon,
    progress,
    total,
    accentColor,
    onPress,
}: TrackerModuleCardProps) {
    const { theme } = useTheme();
    const defaultAccent = accentColor || theme.colors.primary;

    return (
        <GlassCard
            onPress={onPress}
            borderRadius={24}
            style={styles.card}
        >
            <View style={styles.content}>
                {/* Icon */}
                <View style={[styles.iconContainer, { backgroundColor: defaultAccent + '20' }]}>
                    <Ionicons
                        name={icon}
                        size={24}
                        color={defaultAccent}
                    />
                </View>

                {/* Title */}
                <Text
                    style={[
                        styles.title,
                        {
                            color: theme.colors.text,
                            fontFamily: theme.fontFamilies.inter.semiBold,
                        },
                    ]}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text
                        style={[
                            styles.progressText,
                            {
                                color: theme.colors.textSecondary,
                                fontFamily: theme.fontFamilies.inter.medium,
                            },
                        ]}
                    >
                        {progress}/{total}
                    </Text>
                    <ProgressBar
                        progress={progress / total}
                        color={defaultAccent}
                        height={4}
                    />
                </View>
            </View>
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    card: {
        minHeight: 140,
    },
    content: {
        padding: 16,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
    },
    progressContainer: {
        gap: 6,
    },
    progressText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
