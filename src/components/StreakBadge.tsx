// Streak Badge Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context';
import { formatNumber } from '../utils';

interface StreakBadgeProps {
    count: number;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'success' | 'warning';
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
    count,
    label,
    size = 'medium',
    variant = 'primary',
}) => {
    const { theme } = useTheme();
    const { i18n } = useTranslation();

    if (count === 0) return null;

    const getBackgroundColor = () => {
        switch (variant) {
            case 'success':
                return theme.colors.success.main;
            case 'warning':
                return theme.colors.warning.main;
            default:
                return theme.colors.primary;
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, iconSize: 12 };
            case 'large':
                return { paddingHorizontal: 16, paddingVertical: 10, fontSize: 18, iconSize: 18 };
            default:
                return { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14, iconSize: 14 };
        }
    };

    const sizeStyles = getSizeStyles();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    paddingHorizontal: sizeStyles.paddingHorizontal,
                    paddingVertical: sizeStyles.paddingVertical,
                },
            ]}
        >
            <Text style={[styles.icon, { fontSize: sizeStyles.iconSize }]}>🔥</Text>
            <Text
                style={[
                    styles.count,
                    { color: theme.colors.onPrimary, fontSize: sizeStyles.fontSize },
                ]}
            >
                {formatNumber(count, i18n.language)}
            </Text>
            {label && (
                <Text
                    style={[
                        styles.label,
                        { color: theme.colors.onPrimary, fontSize: sizeStyles.fontSize - 2 },
                    ]}
                >
                    {label}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        gap: 4,
    },
    icon: {
        marginRight: 2,
    },
    count: {
        fontWeight: '700',
    },
    label: {
        fontWeight: '500',
        marginLeft: 2,
    },
});

export default StreakBadge;
