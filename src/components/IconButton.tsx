// Icon Button Component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../context';

interface IconButtonProps {
    icon: string;
    label?: string;
    onPress: () => void;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    label,
    onPress,
    size = 'medium',
    variant = 'secondary',
    disabled = false,
    style,
}) => {
    const { theme } = useTheme();

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { padding: 8, iconSize: 16, labelSize: 11 };
            case 'large':
                return { padding: 16, iconSize: 28, labelSize: 14 };
            default:
                return { padding: 12, iconSize: 22, labelSize: 12 };
        }
    };

    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: theme.colors.primary,
                    textColor: theme.colors.onPrimary,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    textColor: theme.colors.text,
                };
            default:
                return {
                    backgroundColor: theme.colors.surface,
                    textColor: theme.colors.text,
                };
        }
    };

    const sizeStyles = getSizeStyles();
    const variantStyles = getVariantStyles();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: variantStyles.backgroundColor,
                    padding: sizeStyles.padding,
                    opacity: disabled ? 0.5 : 1,
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <Text style={[styles.icon, { fontSize: sizeStyles.iconSize }]}>{icon}</Text>
            {label && (
                <Text
                    style={[
                        styles.label,
                        { color: variantStyles.textColor, fontSize: sizeStyles.labelSize },
                    ]}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {},
    label: {
        fontWeight: '500',
        marginTop: 4,
        textAlign: 'center',
    },
});

export default IconButton;
