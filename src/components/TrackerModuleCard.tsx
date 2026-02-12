import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
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
    const { i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
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
                            fontFamily: isArabic ? theme.fontFamilies.arabic.semiBold : theme.fontFamilies.inter.semiBold,
                            textAlign: isArabic ? 'right' : 'left',
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
                                fontFamily: isArabic ? theme.fontFamilies.arabic.medium : theme.fontFamilies.inter.medium,
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
        minHeight: 160,
        flex: 1,
        minWidth: '47%',
        maxWidth: '48%',
    },
    content: {
        padding: 16,
        gap: 10,
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
        letterSpacing: 0.2,
    },
    progressContainer: {
        gap: 6,
        marginTop: 'auto',
    },
    progressText: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
});
