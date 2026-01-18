// PrayerPill - Pill-shaped button for individual prayer tracking
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';
import { SalatStatus } from '../types';

interface PrayerPillProps {
    label: string;
    status?: SalatStatus;
    onPress: () => void;
    onLongPress?: () => void;
}

export const PrayerPill: React.FC<PrayerPillProps> = ({
    label,
    status,
    onPress,
    onLongPress,
}) => {
    const { theme, isDark } = useTheme();

    const getStyles = () => {
        if (status === 'onTime') {
            return {
                backgroundColor: theme.colors.success.main,
                borderColor: theme.colors.success.main,
                textColor: '#FFFFFF',
                iconColor: '#FFFFFF',
                icon: 'check-circle' as const,
            };
        }
        if (status === 'late') {
            return {
                backgroundColor: theme.colors.warning.main,
                borderColor: theme.colors.warning.main,
                textColor: '#FFFFFF',
                iconColor: '#FFFFFF',
                icon: 'clock-alert' as const,
            };
        }
        if (status === 'missed') {
            return {
                backgroundColor: theme.colors.error.main,
                borderColor: theme.colors.error.main,
                textColor: '#FFFFFF',
                iconColor: '#FFFFFF',
                icon: 'close-circle' as const,
            };
        }
        // Not logged state
        return {
            backgroundColor: isDark ? theme.colors.surface : 'transparent',
            borderColor: theme.colors.border,
            textColor: theme.colors.text,
            iconColor: theme.colors.textSecondary,
            icon: 'circle-outline' as const,
        };
    };

    const pillStyles = getStyles();

    return (
        <TouchableOpacity
            style={[
                styles.pill,
                {
                    backgroundColor: pillStyles.backgroundColor,
                    borderColor: pillStyles.borderColor,
                },
            ]}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            delayLongPress={300}
        >
            <MaterialCommunityIcons
                name={pillStyles.icon}
                size={16}
                color={pillStyles.iconColor}
            />
            <Text
                style={[styles.label, { color: pillStyles.textColor }]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    pill: {
        minWidth: 64,
        height: 44,
        borderRadius: 14,
        borderWidth: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        gap: 5,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
    },
});
