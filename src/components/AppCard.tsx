// AppCard - Standardized card component for consistent styling
import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context';

interface AppCardProps {
    children: React.ReactNode;
    backgroundColor?: string;
    style?: ViewStyle;
    onPress?: () => void;
    testID?: string;
}

export const AppCard: React.FC<AppCardProps> = ({
    children,
    backgroundColor,
    style,
    onPress,
    testID,
}) => {
    const { theme, isDark } = useTheme();

    const cardStyle: ViewStyle[] = [
        styles.card,
        {
            backgroundColor: backgroundColor || theme.colors.surface,
            borderColor: theme.colors.cardBorder,
            borderWidth: isDark ? 0 : 1,
        },
        !isDark && styles.shadow,
        style,
    ];

    if (onPress) {
        return (
            <TouchableOpacity
                style={cardStyle}
                onPress={onPress}
                activeOpacity={0.7}
                testID={testID}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={cardStyle} testID={testID}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 18,
        padding: 20,
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
});
