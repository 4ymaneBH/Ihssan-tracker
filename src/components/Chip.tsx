// Chip/Tag Component
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../context';

interface ChipProps {
    label: string;
    icon?: string;
    selected?: boolean;
    onPress?: () => void;
    color?: string;
    size?: 'small' | 'medium';
}

export const Chip: React.FC<ChipProps> = ({
    label,
    icon,
    selected = false,
    onPress,
    color,
    size = 'medium',
}) => {
    const { theme } = useTheme();
    const chipColor = color || theme.colors.primary;

    const sizeStyles = {
        small: { paddingHorizontal: 10, paddingVertical: 6, fontSize: 12, iconSize: 14 },
        medium: { paddingHorizontal: 14, paddingVertical: 8, fontSize: 14, iconSize: 18 },
    };

    const currentSize = sizeStyles[size];

    const content = (
        <View
            style={[
                styles.container,
                {
                    paddingHorizontal: currentSize.paddingHorizontal,
                    paddingVertical: currentSize.paddingVertical,
                    backgroundColor: selected ? chipColor : theme.colors.surface,
                    borderColor: selected ? chipColor : theme.colors.border,
                },
            ]}
        >
            {icon && (
                <Text style={[styles.icon, { fontSize: currentSize.iconSize }]}>{icon}</Text>
            )}
            <Text
                style={[
                    styles.label,
                    {
                        fontSize: currentSize.fontSize,
                        color: selected ? theme.colors.onPrimary : theme.colors.text,
                    },
                ]}
            >
                {label}
            </Text>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        gap: 6,
    },
    icon: {},
    label: {
        fontWeight: '500',
    },
});

export default Chip;
