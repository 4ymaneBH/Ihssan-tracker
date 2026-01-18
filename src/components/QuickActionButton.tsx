// QuickActionButton - Consistent action button for Adhkar and CTAs
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context';

interface QuickActionButtonProps {
    label: string;
    icon: string;
    iconColor: string;
    variant?: 'filled' | 'outline';
    completed?: boolean;
    onPress: () => void;
    subtitle?: string;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    label,
    icon,
    iconColor,
    variant = 'filled',
    completed = false,
    onPress,
    subtitle,
}) => {
    const { theme, isDark } = useTheme();

    const getButtonStyles = () => {
        if (completed) {
            return {
                backgroundColor: theme.colors.success.main + '15',
                borderColor: theme.colors.success.main,
            };
        }
        if (variant === 'outline') {
            return {
                backgroundColor: 'transparent',
                borderColor: theme.colors.primary,
            };
        }
        return {
            backgroundColor: theme.colors.surface,
            borderColor: isDark ? theme.colors.border : theme.colors.cardBorder,
        };
    };

    const buttonStyles = getButtonStyles();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: buttonStyles.backgroundColor,
                    borderColor: buttonStyles.borderColor,
                },
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.leftContent}>
                <View style={[styles.iconContainer, { backgroundColor: iconColor + '20' }]}>
                    <MaterialCommunityIcons
                        name={icon as any}
                        size={24}
                        color={iconColor}
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text
                        style={[styles.label, { color: theme.colors.text }]}
                        numberOfLines={1}
                    >
                        {label}
                    </Text>
                    {subtitle && (
                        <Text
                            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
                            numberOfLines={1}
                        >
                            {subtitle}
                        </Text>
                    )}
                </View>
            </View>
            {completed && (
                <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color={theme.colors.success.main}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 64,
        borderRadius: 14,
        borderWidth: 1.5,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '400',
        marginTop: 2,
    },
});
